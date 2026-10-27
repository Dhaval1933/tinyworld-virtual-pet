import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useRoom } from '../context/RoomContext';
import { useAuth } from '../context/AuthContext';
import { petService } from '../services';
import RoomScene from '../components/room/RoomScene';
import RoomInventoryDrawer from '../components/room/RoomInventoryDrawer';
import Button from '../components/common/Button';
import ProgressBar from '../components/common/ProgressBar';
import Loading from '../components/common/Loading';
import {
  Edit3,
  Eye,
  Plus,
  RotateCw,
  Undo2,
  X,
  Save,
  Heart,
  Sparkles,
  Coins,
  Star,
  UtensilsCrossed,
  Hand,
  Moon,
  Trash2,
  Mic,
  MicOff,
  Volume2,
  Send,
  MessageSquare,
  Gamepad2,
  Bot,
  SlidersHorizontal,
  Volume1,
  Play,
  Check,
  Lock,
  Crown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { generateId } from '../utils/formatters';
import SubscriptionModal from '../components/subscription/SubscriptionModal';

// ─── Preset Voice Profiles for Different Pet Personalities ───
// Finely calibrated between 0.96 and 1.12 to preserve natural human resonance and avoid robotic/chipmunk distortion
export const VOICE_STYLES = [
  {
    id: 'sweet',
    name: 'Sweet & Natural',
    icon: '🌸',
    pitch: 1.04,
    rate: 0.98,
    desc: 'Soft, natural, and soothing friendly companion voice',
  },
  {
    id: 'playful',
    name: 'Playful Kitten',
    icon: '🐱',
    pitch: 1.08,
    rate: 1.02,
    desc: 'Upbeat and cheery, cute without robotic chipmunk distortion',
  },
  {
    id: 'cozy',
    name: 'Cozy Friend',
    icon: '🧸',
    pitch: 1.0,
    rate: 0.96,
    desc: 'Warm, smooth, natural conversational companion',
  },
  {
    id: 'cartoon',
    name: 'Cheerful Animation',
    icon: '🐹',
    pitch: 1.12,
    rate: 1.04,
    desc: 'Expressive and animated, crisp and clear',
  },
  {
    id: 'gentle',
    name: 'Gentle Whisper',
    icon: '🍃',
    pitch: 0.96,
    rate: 0.90,
    desc: 'Quiet, slow, peaceful relaxed tone',
  },
];

// Clean text for speech synthesis so it doesn't stumble on asterisks, stage directions, or emojis
export const cleanForSpeech = (rawText) => {
  if (!rawText) return '';
  let cleaned = rawText
    // Remove stage directions/sound cues like *purrs happily*, *meows*, *hops*
    .replace(/\*[^*]+\*/g, '')
    // Remove parenthetical notes like (giggles), (yawns)
    .replace(/\([^)]+\)/g, '')
    // Remove brackets like [snicker]
    .replace(/\[[^\]]+\]/g, '')
    // Remove markdown symbols
    .replace(/[_~`#*]/g, '')
    // Remove emojis which TTS engines read awkwardly as symbols
    .replace(/[\u{1F300}-\u{1FAD6}\u{2600}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, '')
    // Clean up multiple spaces and leading/trailing punctuation
    .replace(/\s+/g, ' ')
    .replace(/^[\s,.;:!?-]+/, '')
    .trim();

  if (!cleaned) {
    return 'Meow! Purr purr!';
  }
  return cleaned;
};

// Subtle, gentle acoustic bell chime (soft harmonic celesta bell)
export const playPetChime = () => {
  // Silent by default so speech starts cleanly and naturally without artificial synthesized beeps
};

export default function GameRoomPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { pet, setPet, inventory, fetchPet, fetchInventory } = useGame();
  const {
    world,
    editMode,
    toggleEditMode,
    selectedItem,
    setSelectedItem,
    fetchWorld,
    updateLayout,
    undo,
    canUndo,
    cancelEdit,
    saveAndExit,
    rotateItem,
    changeLayer,
    removeItem,
    updateSceneOrView,
    unlockBalconyView,
    saving,
  } = useRoom();

  const [pageLoading, setPageLoading] = useState(true);
  const [showInventory, setShowInventory] = useState(false);
  const [speechBubble, setSpeechBubble] = useState('');
  const [petState, setPetState] = useState('idle'); // 'idle' | 'pet' | 'feed' | 'rest' | 'talking'
  const [actionLoading, setActionLoading] = useState('');

  // ─── Conversational AI & Voice State ───
  const [talkMode, setTalkMode] = useState('chat'); // 'chat' | 'repeat'
  const [showSubModal, setShowSubModal] = useState(false);
  const hasSubscription = Boolean(
    user?.hasAiSubscription ||
    (user?.subscription?.status === 'active' &&
      user?.subscription?.currentPeriodEnd &&
      new Date(user.subscription.currentPeriodEnd) > new Date())
  );
  const [voiceStyle, setVoiceStyle] = useState(() => {
    return localStorage.getItem('tinyworld_voice_style') || 'sweet';
  });
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(() => {
    return localStorage.getItem('tinyworld_voice_uri') || '';
  });
  const [availableVoices, setAvailableVoices] = useState([]);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [talkInput, setTalkInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const recognitionRef = useRef(null);
  const speechBubbleTimerRef = useRef(null);

  // Load and listen for available system/browser voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const loadVoices = () => {
      const all = window.speechSynthesis.getVoices() || [];
      if (all.length > 0) {
        const enVoices = all.filter((v) => v.lang && v.lang.toLowerCase().startsWith('en'));
        setAvailableVoices(enVoices.length ? enVoices : all);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Load all room and game data on mount
  useEffect(() => {
    const loadAll = async () => {
      await Promise.all([fetchPet(), fetchInventory(), fetchWorld()]);
      setPageLoading(false);
    };
    loadAll();

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (speechBubbleTimerRef.current) {
        clearTimeout(speechBubbleTimerRef.current);
      }
    };
  }, [fetchPet, fetchInventory, fetchWorld]);

  // Speech bubble helper
  const showSpeech = useCallback((text, duration = 3200) => {
    if (speechBubbleTimerRef.current) clearTimeout(speechBubbleTimerRef.current);
    setSpeechBubble(text);
    speechBubbleTimerRef.current = setTimeout(() => setSpeechBubble(''), duration);
  }, []);

  // Temporary pet reaction animation state
  const triggerPetReaction = useCallback((reactionState, duration = 1200) => {
    setPetState(reactionState);
    setTimeout(() => setPetState('idle'), duration);
  }, []);

  // ─── Helper to select the highest-fidelity natural voice available ───
  const getBestVoice = useCallback(
    (targetURI) => {
      if (!('speechSynthesis' in window)) return null;
      const voices = window.speechSynthesis.getVoices() || [];
      if (!voices.length) return null;

      const uriToFind = targetURI || selectedVoiceURI;
      if (uriToFind) {
        const match = voices.find((v) => v.voiceURI === uriToFind || v.name === uriToFind);
        if (match) return match;
      }

      const enVoices = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith('en'));
      const pool = enVoices.length ? enVoices : voices;

      // Identify robotic/metallic male voices that sound weird for a cute pet
      const isRobotic = (name) => {
        const n = (name || '').toLowerCase();
        return (
          n.includes('david') ||
          n.includes('mark') ||
          n.includes('george') ||
          n.includes('desktop') ||
          n.includes('ravi')
        );
      };

      // Priority 1: Google UK English Female (Sweetest, warmest, natural accent in Chrome)
      const googleUKFemale = pool.find(
        (v) =>
          v.name.toLowerCase().includes('google') &&
          v.name.toLowerCase().includes('uk') &&
          v.name.toLowerCase().includes('female')
      );
      if (googleUKFemale) return googleUKFemale;

      // Priority 2: Google US English or clean Google voice
      const googleUS = pool.find(
        (v) =>
          v.name.toLowerCase().includes('google') &&
          !v.name.toLowerCase().includes('male')
      );
      if (googleUS) return googleUS;

      // Priority 3: Modern Microsoft Natural / Neural online voices (Jenny, Aria, Natural, Neural)
      const neuralVoice = pool.find(
        (v) =>
          (v.name.toLowerCase().includes('natural') ||
            v.name.toLowerCase().includes('neural') ||
            v.name.toLowerCase().includes('online') ||
            v.name.toLowerCase().includes('jenny') ||
            v.name.toLowerCase().includes('aria') ||
            v.name.toLowerCase().includes('samantha')) &&
          !isRobotic(v.name)
      );
      if (neuralVoice) return neuralVoice;

      // Priority 4: Soft pleasant female voices (Zira, Eva, Hazel, Susan)
      const pleasantFemale = pool.find((v) =>
        ['zira', 'female', 'girl', 'woman', 'eva', 'hazel', 'susan', 'karen', 'victoria'].some(
          (k) => v.name.toLowerCase().includes(k)
        )
      );
      if (pleasantFemale) return pleasantFemale;

      // Priority 5: Any non-robotic voice
      const nonRobotic = pool.find((v) => !isRobotic(v.name));
      if (nonRobotic) return nonRobotic;

      return pool[0] || voices[0];
    },
    [selectedVoiceURI]
  );

  // ─── Pet Voice Synthesis with Custom Profiles ───
  const speakAsPet = useCallback(
    (textToSpeak, overrideStyleId, overrideVoiceURI) => {
      if (!textToSpeak || !textToSpeak.trim()) return;
      const cleanText = textToSpeak.trim();
      const speechText = cleanForSpeech(cleanText);

      // Play cheerful acoustic chime
      playPetChime();

      // Display speech bubble above pet and set mouth talking animation
      showSpeech(cleanText, Math.max(5000, cleanText.length * 110));
      setPetState('talking');
      setIsSpeaking(true);

      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel(); // cancel any active speech
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }

          const utterance = new SpeechSynthesisUtterance(speechText);
          const activeStyleId = overrideStyleId || voiceStyle;
          const currentStyle =
            VOICE_STYLES.find((s) => s.id === activeStyleId) || VOICE_STYLES[0];

          utterance.pitch = currentStyle.pitch;
          utterance.rate = currentStyle.rate;

          const voice = getBestVoice(overrideVoiceURI || selectedVoiceURI);
          if (voice) {
            utterance.voice = voice;
          }

          utterance.onend = () => {
            setPetState('idle');
            setIsSpeaking(false);
          };

          utterance.onerror = (e) => {
            console.warn('SpeechSynthesis audio notice:', e);
            setTimeout(() => {
              setPetState('idle');
              setIsSpeaking(false);
            }, 2800);
          };

          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.warn('SpeechSynthesis error:', err);
          setTimeout(() => {
            setPetState('idle');
            setIsSpeaking(false);
          }, 2800);
        }
      } else {
        setTimeout(() => {
          setPetState('idle');
          setIsSpeaking(false);
        }, 2800);
      }
    },
    [showSpeech, voiceStyle, selectedVoiceURI, getBestVoice]
  );

  // Preview voice style immediately
  const handlePreviewVoice = (styleId = voiceStyle, voiceURI = selectedVoiceURI) => {
    const style = VOICE_STYLES.find((s) => s.id === styleId) || VOICE_STYLES[0];
    const previewPhrases = [
      `Hi! I'm ${pet?.name || 'your pet'}! How do you like this voice?`,
      `Meow! I love chatting with you in my new cozy voice!`,
      `Hello bestie! This voice feels so warm and cute!`,
    ];
    const picked = previewPhrases[Math.floor(Math.random() * previewPhrases.length)];
    speakAsPet(picked, styleId, voiceURI);
    toast.success(`Voice style: ${style.name}`, { icon: style.icon });
  };

  // ─── AI Conversational Chat with Pet (Groq Powered) ───
  const handlePetChat = useCallback(
    async (messageToSend) => {
      // Paywall check: AI conversational replies require active AI Companion Pass (₹100/mo)
      if (!hasSubscription) {
        setShowSubModal(true);
        toast('TinyWorld AI Companion Pass (₹100/mo) is required to chat with AI.', { icon: '✨' });
        return;
      }

      const text = (messageToSend || talkInput || '').trim();
      if (!text) {
        toast('Please speak or type something to talk with your pet!', { icon: '💭' });
        return;
      }

      setTalkInput('');
      setIsChatting(true);
      // Immediate visual thinking indicator
      showSpeech('*thinking...* 🐾', 8000);
      setPetState('talking');

      try {
        const data = await petService.chat(text, chatHistory);
        if (data?.pet) {
          setPet(data.pet);
        }
        const reply = data?.reply || `Meow! I'm so happy to talk with you! 💕`;
        setChatHistory((prev) => [
          ...prev.slice(-5),
          { role: 'user', content: text },
          { role: 'assistant', content: reply },
        ]);
        speakAsPet(reply);
      } catch (err) {
        console.warn('Pet chat error:', err);
        if (err.code === 'SUBSCRIPTION_REQUIRED' || err.response?.data?.code === 'SUBSCRIPTION_REQUIRED') {
          setShowSubModal(true);
          toast.error('AI Companion Pass (₹100/mo) is required to chat with your pet.');
          return;
        }
        const fallback = `*snuggles happily* I love hearing your voice, bestie! 💕`;
        speakAsPet(fallback);
      } finally {
        setIsChatting(false);
      }
    },
    [talkInput, chatHistory, setPet, showSpeech, speakAsPet, hasSubscription]
  );

  // ─── Speech Recognition (Listen to User) ───
  const toggleListening = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error(
        'Speech recognition is not supported in this browser. You can type words below!',
        { icon: '⌨️' }
      );
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast('Listening to you... Speak now! 🎙️', { icon: '👂' });
      };

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript;
        setIsListening(false);
        setTalkInput(spoken);
        toast.success(`Heard: "${spoken}"`);
        if (talkMode === 'repeat') {
          speakAsPet(spoken);
        } else {
          handlePetChat(spoken);
        }
      };

      recognition.onerror = (event) => {
        console.warn('SpeechRecognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          toast.error('Microphone permission denied. You can type in the box below!');
        } else if (event.error === 'no-speech') {
          toast('No speech detected. Try again or type below!', { icon: '🤔' });
        } else {
          toast.error(`Mic error (${event.error}). You can type below!`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      toast.error('Could not access microphone. You can type in the box below!');
    }
  }, [isListening, speakAsPet, handlePetChat, talkMode]);

  const handleSaySubmit = (e) => {
    if (e) e.preventDefault();
    const domVal = document.getElementById('talking-tom-input')?.value?.trim();
    const textToSay = talkInput.trim() || domVal || '';
    if (!textToSay) {
      toast(
        talkMode === 'repeat'
          ? 'Please type or speak something for your pet to repeat!'
          : 'Please type or speak something to chat with your pet!',
        { icon: '💭' }
      );
      return;
    }
    if (talkMode === 'repeat') {
      setTalkInput(textToSay);
      speakAsPet(textToSay);
    } else {
      if (!hasSubscription) {
        setShowSubModal(true);
        return;
      }
      handlePetChat(textToSay);
    }
  };

  // ─── Pet Click Reaction (Talking Tom Physical Reactions) ───
  const handlePetClick = () => {
    const dialogs = [
      `Hello ${user?.displayName || 'friend'}! ✨`,
      'This room and balcony are so cozy! 🏡',
      'Hehehe! That tickles! 🤭',
      'I love spending time with you! 💕',
      'High five, bestie! 🐾',
      '*purrs with pure happiness* 🌸',
      'Look at that beautiful sky! 🌅',
      'Want to play a mini-game together? 🎮',
    ];
    const picked = dialogs[Math.floor(Math.random() * dialogs.length)];
    showSpeech(picked);
    triggerPetReaction('pet', 1200);
  };

  // ─── Pet Care Actions ───
  const handleFeed = async () => {
    setActionLoading('feed');
    try {
      const data = await petService.feed();
      setPet(data.pet);
      showSpeech('Yum! That was delicious! 🍓');
      triggerPetReaction('feed', 1500);
      toast.success(data.message || 'Pet fed!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading('');
    }
  };

  const handlePetAction = async () => {
    setActionLoading('pet');
    try {
      const data = await petService.pet();
      setPet(data.pet);
      showSpeech('So warm and happy! 💕');
      triggerPetReaction('pet', 1500);
      toast.success(data.message || 'Pet loved!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading('');
    }
  };

  const handleRest = async () => {
    setActionLoading('rest');
    try {
      const data = await petService.rest();
      setPet(data.pet);
      showSpeech('Zzz... restful nap time... 💤');
      triggerPetReaction('rest', 2500);
      toast.success(data.message || 'Pet is resting!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading('');
    }
  };

  // ─── Placement from Inventory Drawer ───
  const handlePlaceItem = (invItem) => {
    if (!world) return;
    const isBalcony = world?.activeScene === 'balcony';
    const currentScene = isBalcony ? 'balcony' : 'room';
    const currentLayout = isBalcony ? (world.balconyLayout || []) : (world.roomLayout || []);

    if (currentLayout.length >= 30) {
      toast.error(`${isBalcony ? 'Balcony' : 'Room'} capacity full (max 30 items)!`);
      return;
    }

    // Special constraint: Window Curtains can only be placed on the window in Cozy Room!
    if (invItem.itemId === 'window-curtains' || invItem.itemId === 'curtains') {
      if (isBalcony) {
        toast('Window Curtains belong on the room window! Switch to Cozy Room to install them. 🪟', {
          icon: 'ℹ️',
        });
        return;
      }
      const alreadyHasCurtains = (world.roomLayout || []).some(
        (i) => i.itemId === 'window-curtains' || i.itemId === 'curtains'
      );
      if (alreadyHasCurtains) {
        toast('Window Curtains are already installed on the window! 🪟', { icon: 'ℹ️' });
        return;
      }
      const newPlacementId = `curtains-${generateId()}`;
      const newItem = {
        placementId: newPlacementId,
        itemId: invItem.itemId,
        x: 0.88,
        y: 0.18,
        rotation: 0,
        layer: 5,
      };
      updateLayout([...(world.roomLayout || []), newItem], true, 'room');
      toast.success('Window Curtains installed onto the window! 🪟✨');
      return;
    }

    const newPlacementId = `item-${generateId()}`;
    const newItem = {
      placementId: newPlacementId,
      itemId: invItem.itemId,
      // Place near lower center of active scene
      x: Number((0.45 + Math.random() * 0.1).toFixed(3)),
      y: Number((isBalcony ? 0.62 + Math.random() * 0.08 : 0.62 + Math.random() * 0.1).toFixed(3)),
      rotation: 0,
      layer: currentLayout.length,
    };

    updateLayout([...currentLayout, newItem], true, currentScene);
    setSelectedItem(newPlacementId);
    toast.success(
      `Placed ${invItem.item?.name || invItem.itemId} ${isBalcony ? 'on the Balcony' : 'in the Room'}! Drag to reposition.`
    );
  };

  if (pageLoading) return <Loading message="Entering your cozy world..." />;

  return (
    <div className="page-enter space-y-5">
      {/* ─── ROOM HUD HEADER ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 backdrop-blur-xs p-4 rounded-3xl border border-cream-dark shadow-soft">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink flex items-center gap-2">
            <span>{pet?.name}'s Sanctuary</span>
            <span className="text-xl">🏡</span>
          </h1>
          <p className="text-xs text-ink-muted">
            Theme:{' '}
            <span className="capitalize font-semibold text-ink">
              {world?.roomTheme || 'cozy'}
            </span>{' '}
            •{' '}
            {world?.activeScene === 'balcony'
              ? `${world?.balconyLayout?.length || 0}/30 balcony items`
              : `${(world?.roomLayout || []).filter((i) => i.itemId !== 'window-curtains').length}/30 room items`}
          </p>
        </div>

        {/* Currency, Level, and Mini-Games Button */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/games')}
            icon={Gamepad2}
            className="shadow-xs font-bold"
          >
            Play Mini-Games 🎮
          </Button>
          <div className="flex items-center gap-1.5 bg-cream/70 rounded-2xl px-3.5 py-1.5 border border-cream-dark">
            <Coins className="w-4 h-4 text-peach-dark" />
            <span className="font-bold text-sm text-ink">{user?.coins ?? 0}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-lavender/30 rounded-2xl px-3.5 py-1.5 border border-lavender/50">
            <Star className="w-4 h-4 text-lavender-dark" />
            <span className="font-bold text-sm text-ink">Lv. {user?.level ?? 1}</span>
          </div>
        </div>
      </div>

      {/* ─── 2D GAME ROOM SCENE ─── */}
      <RoomScene
        world={world}
        pet={pet}
        user={user}
        inventory={inventory}
        editMode={editMode}
        selectedItem={selectedItem}
        onSelectItem={setSelectedItem}
        onUpdateLayout={updateLayout}
        onRotateItem={rotateItem}
        onChangeLayer={changeLayer}
        onRemoveItem={removeItem}
        petState={petState}
        speechBubble={speechBubble}
        onPetClick={handlePetClick}
        onSceneChange={(newScene) => updateSceneOrView({ activeScene: newScene })}
        onViewChange={(newView) => updateSceneOrView({ balconyView: newView })}
        onUnlockBalconyView={unlockBalconyView}
      />

      {/* ─── ROOM CONTROL TOOLBAR ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl p-3 shadow-soft border border-cream-dark">
        <div className="flex flex-wrap items-center gap-2">
          {/* Main Edit Toggle */}
          <Button
            variant={editMode ? 'secondary' : 'primary'}
            size="sm"
            onClick={toggleEditMode}
            icon={editMode ? Eye : Edit3}
          >
            {editMode ? 'Exit Edit Mode' : 'Edit Room'}
          </Button>

          {/* Edit Mode Actions */}
          {editMode && (
            <>
              {/* Add Item Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInventory(true)}
                icon={Plus}
              >
                Add Furniture
              </Button>

              {/* Undo Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={undo}
                disabled={!canUndo}
                icon={Undo2}
                title="Undo last layout change"
              >
                Undo
              </Button>

              {/* Selected Item Rotation & Remove */}
              {selectedItem && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => rotateItem(selectedItem)}
                    icon={RotateCw}
                    title="Rotate 45°"
                  >
                    Rotate
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeItem(selectedItem)}
                    icon={Trash2}
                    title="Put in Inventory"
                  >
                    Remove
                  </Button>
                </>
              )}
            </>
          )}
        </div>

        {/* Edit Mode Save / Cancel Controls */}
        {editMode && (
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={cancelEdit}
              icon={X}
              title="Discard unsaved edits"
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={saveAndExit}
              loading={saving}
              icon={Save}
            >
              Save Room
            </Button>
          </div>
        )}
      </div>

      {/* ─── PET TALK & AI COMPANION SECTION ─── */}
      {pet && (
        <div className="bg-gradient-to-r from-lavender/20 via-cream to-peach/20 rounded-3xl p-4 sm:p-5 shadow-soft border border-lavender/30 space-y-3.5 transition-all">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-lavender/40 border border-lavender/60 flex items-center justify-center text-lavender-dark shadow-xs">
                {talkMode === 'chat' ? (
                  <Bot className="w-5 h-5 text-lavender-dark" />
                ) : (
                  <Volume2 className="w-5 h-5 text-lavender-dark" />
                )}
              </div>
              <div>
                <h3 className="font-display font-bold text-ink text-base flex items-center gap-2">
                  <span>Talk with {pet.name}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-lavender/30 text-lavender-dark border border-lavender/40 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-lavender-dark" />
                    {talkMode === 'chat' ? 'AI Companion' : 'Talking Tom Mimic'}
                  </span>
                </h3>
                <p className="text-xs text-ink-muted">
                  {talkMode === 'chat'
                    ? `Say anything to ${pet.name} — your pet listens, replies smartly with AI, and speaks back in its cartoon voice!`
                    : `Speak into your mic or type — ${pet.name} repeats everything in a squeaky cartoon voice!`}
                </p>
              </div>
            </div>

              {/* Mode Switcher & Status Indicators */}
              <div className="flex items-center gap-2">
                <div className="inline-flex p-1 bg-white/80 border border-cream-dark rounded-2xl shadow-2xs">
                  <button
                    type="button"
                    id="talk-mode-chat-btn"
                    onClick={() => {
                      if (!hasSubscription) {
                        setShowSubModal(true);
                        return;
                      }
                      setTalkMode('chat');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      talkMode === 'chat'
                        ? 'bg-lavender text-lavender-dark shadow-xs'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Chat with AI ✨</span>
                    {!hasSubscription ? (
                      <span className="text-[10px] px-1.5 py-0.2 bg-peach/40 text-peach-dark rounded-full border border-peach/50 flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" /> ₹100
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-300 flex items-center gap-0.5">
                        <Crown className="w-2.5 h-2.5" /> Pass
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    id="talk-mode-repeat-btn"
                    onClick={() => setTalkMode('repeat')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      talkMode === 'repeat'
                        ? 'bg-lavender text-lavender-dark shadow-xs'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Repeat Me 🦜</span>
                  </button>
                </div>

              {isChatting && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-lavender/40 text-lavender-dark animate-pulse border border-lavender/50">
                  <Sparkles className="w-3 h-3 animate-spin" />
                  Thinking...
                </span>
              )}
              {isListening && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-peach/30 text-peach-dark animate-pulse border border-peach/50">
                  <span className="w-2 h-2 rounded-full bg-peach-dark animate-ping" />
                  Listening...
                </span>
              )}
              {isSpeaking && !isListening && !isChatting && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-lavender/40 text-lavender-dark animate-bounce-gentle border border-lavender/50">
                  <span>🎶</span> Speaking!
                </span>
              )}
            </div>
          </div>

          {/* Voice Input & Action Bar */}
          <form
            onSubmit={handleSaySubmit}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
          >
            {/* Microphone Toggle Button */}
            <button
              type="button"
              id="talking-tom-mic-btn"
              onClick={toggleListening}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-xs cursor-pointer select-none active:scale-95 ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-md ring-2 ring-rose-300'
                  : 'bg-white hover:bg-cream border border-cream-dark text-ink hover:text-lavender-dark'
              }`}
              title={isListening ? 'Click to stop listening' : 'Click to speak through microphone'}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 animate-spin" />
                  <span>Listening... Stop</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-peach-dark" />
                  <span>Speak (Mic)</span>
                </>
              )}
            </button>

            {/* Text Input for Typing */}
            <div className="relative flex-1">
              <input
                id="talking-tom-input"
                type="text"
                value={talkInput}
                onChange={(e) => setTalkInput(e.target.value)}
                placeholder={
                  talkMode === 'chat'
                    ? `Say something to ${pet.name}... (e.g. "How are you today?" or "Tell me a joke!")`
                    : `Say something or type here for ${pet.name} to repeat...`
                }
                className="w-full bg-white text-ink text-sm rounded-2xl px-4 py-2.5 pl-9 border border-cream-dark focus:outline-hidden focus:ring-2 focus:ring-lavender focus:border-transparent transition-all shadow-xs placeholder:text-ink-muted/70"
              />
              <MessageSquare className="w-4 h-4 text-ink-muted/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {talkInput && (
                <button
                  type="button"
                  onClick={() => setTalkInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink text-xs font-bold px-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Chat or Repeat Button */}
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={Send}
              loading={isChatting}
              id="talking-tom-repeat-btn"
              onClick={handleSaySubmit}
            >
              {talkMode === 'chat' ? 'Chat 💬' : 'Repeat 🗣️'}
            </Button>
          </form>

          {/* Quick Preset Phrases */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-ink-muted mr-1">
              {talkMode === 'chat' ? 'Try asking:' : 'Quick phrases:'}
            </span>
            {(talkMode === 'chat'
              ? [
                  'How are you feeling today? 💕',
                  'What is your favorite snack? 🍓',
                  'Tell me a cute pet joke! 🐾',
                  'Want to play a mini-game? 🎮',
                  'Do you like your cozy room? 🏡',
                  'I love you so much! ✨',
                ]
              : [
                  'I love you! 💕',
                  "You're the best! 🌸",
                  'Give me a yummy treat! 🍓',
                  "Let's play in my cozy room! 🎈",
                  'Good morning sunshine! ☀️',
                  'Meow meow, squeak squeak! 🐾',
                ]
            ).map((phrase) => (
              <button
                key={phrase}
                type="button"
                onClick={() => {
                  if (talkMode === 'chat') {
                    handlePetChat(phrase);
                  } else {
                    setTalkInput(phrase);
                    speakAsPet(phrase);
                  }
                }}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white/80 hover:bg-white text-ink hover:text-lavender-dark border border-cream-dark hover:border-lavender/50 transition-all cursor-pointer active:scale-95 shadow-2xs font-medium"
              >
                {phrase}
              </button>
            ))}
          </div>

          {/* ─── VOICE CUSTOMIZATION & STYLE PICKER ─── */}
          <div className="pt-2 border-t border-cream-dark/60 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-ink-muted flex items-center gap-1 mr-1">
                  <Volume1 className="w-3.5 h-3.5 text-lavender-dark" />
                  Voice Style:
                </span>
                {VOICE_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    id={`voice-style-${style.id}-btn`}
                    onClick={() => {
                      setVoiceStyle(style.id);
                      localStorage.setItem('tinyworld_voice_style', style.id);
                      handlePreviewVoice(style.id);
                    }}
                    className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer active:scale-95 shadow-2xs ${
                      voiceStyle === style.id
                        ? 'bg-lavender text-lavender-dark border border-lavender-dark/40 ring-2 ring-lavender/40'
                        : 'bg-white/80 hover:bg-white text-ink-muted hover:text-ink border border-cream-dark'
                    }`}
                    title={style.desc}
                  >
                    <span>{style.icon}</span>
                    <span>{style.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="preview-voice-btn"
                  onClick={() => handlePreviewVoice()}
                  className="flex items-center gap-1 text-[11px] font-bold text-lavender-dark hover:text-lavender-dark/80 px-2.5 py-1 rounded-xl bg-lavender/30 hover:bg-lavender/50 border border-lavender/40 transition-all cursor-pointer shadow-2xs active:scale-95"
                  title="Hear how the current voice sounds"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Preview Voice</span>
                </button>
                <button
                  type="button"
                  id="voice-settings-toggle-btn"
                  onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                  className="flex items-center gap-1 text-[11px] font-bold text-ink-muted hover:text-ink px-2 py-1 rounded-xl bg-white/70 hover:bg-white border border-cream-dark transition-all cursor-pointer shadow-2xs"
                  title="Choose installed device voices or test"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-ink-muted" />
                  <span>{showVoiceSettings ? 'Hide Options' : 'Device Voices'}</span>
                </button>
              </div>
            </div>

            {/* Expandable Advanced Voice Settings */}
            {showVoiceSettings && (
              <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-3 border border-lavender/30 space-y-2 animate-pop-in shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-ink mb-1">
                      Choose Voice ({availableVoices.length} installed on your browser/device)
                    </label>
                    <select
                      id="custom-voice-select"
                      value={selectedVoiceURI}
                      onChange={(e) => {
                        const uri = e.target.value;
                        setSelectedVoiceURI(uri);
                        localStorage.setItem('tinyworld_voice_uri', uri);
                        handlePreviewVoice(voiceStyle, uri);
                      }}
                      className="w-full bg-cream/50 text-ink text-xs font-medium rounded-xl px-3 py-1.5 border border-cream-dark focus:outline-hidden focus:ring-2 focus:ring-lavender cursor-pointer"
                    >
                      <option value="">Auto (Highest-Fidelity Natural Voice)</option>
                      {availableVoices.map((v) => (
                        <option key={v.voiceURI || v.name} value={v.voiceURI || v.name}>
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-1 sm:pt-4">
                    <button
                      type="button"
                      onClick={() => handlePreviewVoice()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lavender text-lavender-dark text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Test Selected Voice</span>
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-ink-muted">
                  Tip: Natural and Online voices sound most realistic. You can switch voices and styles anytime!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── PET STATS & CARE INTERACTIONS ─── */}
      {pet && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pet Status Gauges */}
          <div className="bg-white rounded-3xl p-5 shadow-soft border border-cream-dark space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-ink flex items-center gap-2 text-base">
                <Heart className="w-4 h-4 text-peach-dark" />
                {pet.name}'s Vitals
              </h3>
              <span className="text-xs text-ink-muted">Decays naturally over time</span>
            </div>
            <div className="space-y-3">
              <ProgressBar
                value={pet.hunger}
                max={100}
                color="peach"
                label="Hunger"
                showLabel
                size="sm"
              />
              <ProgressBar
                value={pet.happiness}
                max={100}
                color="lavender"
                label="Happiness"
                showLabel
                size="sm"
              />
              <ProgressBar
                value={pet.energy}
                max={100}
                color="sage"
                label="Energy"
                showLabel
                size="sm"
              />
            </div>
          </div>

          {/* Care Actions */}
          <div className="bg-white rounded-3xl p-5 shadow-soft border border-cream-dark flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-ink flex items-center gap-2 text-base mb-1">
                <Sparkles className="w-4 h-4 text-lavender-dark" />
                Care & Bonding
              </h3>
              <p className="text-xs text-ink-muted mb-4">
                Interact with {pet.name} to keep them healthy and happy
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={handleFeed}
                disabled={!!actionLoading}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-peach/15 hover:bg-peach/30 border border-peach/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <UtensilsCrossed className="w-5 h-5 text-peach-dark" />
                <span className="text-xs font-bold text-ink">Feed</span>
              </button>

              <button
                onClick={handlePetAction}
                disabled={!!actionLoading}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-lavender/25 hover:bg-lavender/40 border border-lavender/40 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Hand className="w-5 h-5 text-lavender-dark" />
                <span className="text-xs font-bold text-ink">Pet</span>
              </button>

              <button
                onClick={handleRest}
                disabled={!!actionLoading}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-sage/20 hover:bg-sage/35 border border-sage/40 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Moon className="w-5 h-5 text-sage-dark" />
                <span className="text-xs font-bold text-ink">Rest</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── INVENTORY DRAWER ─── */}
      <RoomInventoryDrawer
        isOpen={showInventory}
        onClose={() => setShowInventory(false)}
        inventory={inventory}
        roomLayout={world?.roomLayout || []}
        balconyLayout={world?.balconyLayout || []}
        activeScene={world?.activeScene || 'room'}
        onPlaceItem={handlePlaceItem}
      />

      {/* ─── RAZORPAY SUBSCRIPTION PAYWALL MODAL ─── */}
      <SubscriptionModal
        isOpen={showSubModal}
        onClose={() => setShowSubModal(false)}
        onSuccess={(updatedUser) => {
          if (updateUser) updateUser(updatedUser);
          setTalkMode('chat');
        }}
        petName={pet?.name || 'your pet'}
      />
    </div>
  );
}
