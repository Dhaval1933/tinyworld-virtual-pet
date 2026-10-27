import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { worldService } from '../services';

const RoomContext = createContext(null);

export function RoomProvider({ children }) {
  const [world, setWorld] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Undo / cancel history refs & states
  const originalLayoutRef = useRef([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const saveTimeoutRef = useRef(null);

  const fetchWorld = useCallback(async () => {
    try {
      setLoading(true);
      const data = await worldService.getWorld();
      setWorld(data.world);
      return data.world;
    } catch (err) {
      console.error('Failed to fetch world:', err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Save layout immediately to server.
   */
  const saveLayoutNow = useCallback(async (layoutToSave, targetScene) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    const currentScene = targetScene || world?.activeScene || 'room';
    const layout =
      layoutToSave ||
      (currentScene === 'balcony' ? world?.balconyLayout : world?.roomLayout) ||
      [];
    if (layout) {
      try {
        setSaving(true);
        await worldService.updateLayout(layout, currentScene);
      } catch (err) {
        console.error('Failed to save layout:', err.message);
        throw err;
      } finally {
        setSaving(false);
      }
    }
  }, [world]);

  /**
   * Update active layout locally, manage undo history, and debounce save.
   */
  const updateLayout = useCallback(
    (newLayout, recordHistory = true, targetScene) => {
      const currentScene = targetScene || world?.activeScene || 'room';
      const field = currentScene === 'balcony' ? 'balconyLayout' : 'roomLayout';

      setWorld((prev) => (prev ? { ...prev, [field]: newLayout } : prev));

      if (recordHistory) {
        setHistory((prev) => {
          const sliced = prev.slice(0, historyIndex + 1);
          return [...sliced, { scene: currentScene, layout: newLayout }];
        });
        setHistoryIndex((prev) => prev + 1);
      }

      // Debounce save (1.2 seconds)
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await worldService.updateLayout(newLayout, currentScene);
        } catch (err) {
          console.error('Failed to debounced-save layout:', err.message);
        }
      }, 1200);
    },
    [world?.activeScene, historyIndex]
  );

  /**
   * Undo last layout action.
   */
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevEntry = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      const field = prevEntry.scene === 'balcony' ? 'balconyLayout' : 'roomLayout';
      setWorld((prev) => (prev ? { ...prev, [field]: prevEntry.layout } : prev));
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        worldService.updateLayout(prevEntry.layout, prevEntry.scene).catch(console.error);
      }, 1000);
    }
  }, [historyIndex, history]);

  /**
   * Toggle edit mode: entering takes a snapshot, exiting auto-saves.
   */
  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => {
      if (!prev) {
        // Entering edit mode
        const initial = {
          roomLayout: world?.roomLayout ? JSON.parse(JSON.stringify(world.roomLayout)) : [],
          balconyLayout: world?.balconyLayout ? JSON.parse(JSON.stringify(world.balconyLayout)) : [],
        };
        originalLayoutRef.current = initial;
        setHistory([]);
        setHistoryIndex(-1);
        return true;
      } else {
        // Exiting edit mode — commit
        saveLayoutNow();
        setSelectedItem(null);
        return false;
      }
    });
  }, [world, saveLayoutNow]);

  /**
   * Cancel editing: discard unsaved edits and restore initial snapshot.
   */
  const cancelEdit = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    const initial = originalLayoutRef.current || { roomLayout: [], balconyLayout: [] };
    setWorld((prev) => (prev ? { ...prev, ...initial } : prev));
    worldService.updateLayout(initial).catch(console.error);
    setEditMode(false);
    setSelectedItem(null);
    setHistory([]);
    setHistoryIndex(-1);
  }, []);

  /**
   * Save and finish editing.
   */
  const saveAndExit = useCallback(async () => {
    const currentScene = world?.activeScene || 'room';
    const layout = currentScene === 'balcony' ? world?.balconyLayout : world?.roomLayout;
    if (layout) {
      await saveLayoutNow(layout, currentScene);
    }
    setEditMode(false);
    setSelectedItem(null);
    setHistory([]);
    setHistoryIndex(-1);
  }, [world, saveLayoutNow]);

  /**
   * Rotate a placed item by 45 degrees in active scene.
   */
  const rotateItem = useCallback(
    (placementId) => {
      const currentScene = world?.activeScene || 'room';
      const field = currentScene === 'balcony' ? 'balconyLayout' : 'roomLayout';
      const currentList = world?.[field] || [];
      const newLayout = currentList.map((item) =>
        item.placementId === placementId
          ? { ...item, rotation: ((item.rotation || 0) + 45) % 360 }
          : item
      );
      updateLayout(newLayout, true, currentScene);
    },
    [world, updateLayout]
  );

  /**
   * Adjust layer (z-order) of an item in active scene.
   */
  const changeLayer = useCallback(
    (placementId, direction) => {
      const currentScene = world?.activeScene || 'room';
      const field = currentScene === 'balcony' ? 'balconyLayout' : 'roomLayout';
      const currentList = world?.[field] || [];
      const newLayout = currentList.map((item) => {
        if (item.placementId !== placementId) return item;
        const current = item.layer || 0;
        const next = direction === 'up' ? current + 1 : Math.max(0, current - 1);
        return { ...item, layer: next };
      });
      updateLayout(newLayout, true, currentScene);
    },
    [world, updateLayout]
  );

  /**
   * Remove item from room or balcony.
   */
  const removeItem = useCallback(
    (placementId) => {
      const currentScene = world?.activeScene || 'room';
      const field = currentScene === 'balcony' ? 'balconyLayout' : 'roomLayout';
      const currentList = world?.[field] || [];
      const newLayout = currentList.filter((i) => i.placementId !== placementId);
      updateLayout(newLayout, true, currentScene);
      setSelectedItem(null);
    },
    [world, updateLayout]
  );

  /**
   * Update active scene ('room' vs 'balcony') and balcony view ('sunset', etc.)
   */
  const updateSceneOrView = useCallback(async ({ activeScene, balconyView }) => {
    setSelectedItem(null); // Clear selection on scene change
    setWorld((prev) =>
      prev
        ? {
            ...prev,
            activeScene: activeScene !== undefined ? activeScene : prev.activeScene,
            balconyView: balconyView !== undefined ? balconyView : prev.balconyView,
          }
        : prev
    );

    try {
      await worldService.updateTheme({ activeScene, balconyView });
    } catch (err) {
      console.warn('Failed to persist scene/view update:', err.message);
    }
  }, []);

  /**
   * Unlock a scenic balcony view.
   */
  const unlockBalconyView = useCallback(async (viewId) => {
    try {
      const res = await worldService.unlockBalconyView(viewId);
      if (res.world) {
        setWorld(res.world);
      }
      return res;
    } catch (err) {
      console.error('Failed to unlock balcony view:', err.message);
      throw err;
    }
  }, []);

  const value = {
    world,
    setWorld,
    editMode,
    toggleEditMode,
    selectedItem,
    setSelectedItem,
    loading,
    saving,
    fetchWorld,
    updateLayout,
    saveLayoutNow,
    undo,
    canUndo: historyIndex > 0,
    cancelEdit,
    saveAndExit,
    rotateItem,
    changeLayer,
    removeItem,
    updateSceneOrView,
    unlockBalconyView,
  };

  return (
    <RoomContext.Provider value={value}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
}

export default RoomContext;
