import React, { useState } from 'react';
import { X, Sparkles, Check, ShieldCheck, Zap, Heart, Bot } from 'lucide-react';
import Button from '../common/Button';
import { subscriptionService } from '../../services';
import { loadRazorpayScript } from '../../utils/razorpay';
import toast from 'react-hot-toast';

export default function SubscriptionModal({ isOpen, onClose, onSuccess, petName = 'your pet' }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Failed to load Razorpay SDK. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // Step 1: Create order on server
      const orderData = await subscriptionService.createOrder();
      const { orderId, amount, currency, keyId, prefill, planName } = orderData;

      if (!keyId) {
        toast.error('Razorpay Key ID is not configured on the backend.');
        setLoading(false);
        return;
      }

      // Step 2: Configure Razorpay Checkout options
      const options = {
        key: keyId,
        amount: amount,
        currency: currency || 'INR',
        name: 'TinyWorld',
        description: planName || 'AI Companion Pass (₹100/mo)',
        order_id: orderId,
        prefill: {
          name: prefill?.name || 'TinyWorld Explorer',
          email: prefill?.email || '',
        },
        theme: {
          color: '#9b87f5', // Cozy lavender brand color
        },
        handler: async function (response) {
          try {
            // Step 3: Verify payment signature on backend
            const verifyRes = await subscriptionService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success(verifyRes.message || 'Subscribed successfully! 🎉', {
              duration: 5000,
              icon: '✨',
            });

            if (onSuccess) {
              onSuccess(verifyRes.user);
            }
            onClose();
          } catch (verifyErr) {
            console.error('Payment verification error:', verifyErr);
            toast.error(verifyErr.message || 'Payment verification failed.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast('Payment cancelled. You can subscribe whenever you are ready!', { icon: 'ℹ️' });
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      console.error('Subscription order error:', err);
      toast.error(err.message || 'Could not initiate subscription order.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-modal border border-lavender/30 overflow-hidden animate-pop-in">
        {/* Decorative Header Banner */}
        <div className="bg-gradient-to-r from-lavender/40 via-peach/30 to-mint/30 p-6 text-center relative border-b border-lavender/20">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/80 hover:bg-white text-ink-muted hover:text-ink transition-all cursor-pointer shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 mx-auto rounded-3xl bg-white shadow-soft flex items-center justify-center border border-lavender/40 mb-3 text-lavender-dark animate-float">
            <Sparkles className="w-7 h-7 text-lavender-dark" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-lavender/40 text-lavender-dark border border-lavender/60 mb-1">
            <Bot className="w-3.5 h-3.5" /> Razorpay Test Gateway
          </span>

          <h2 className="text-xl font-display font-bold text-ink">
            AI Companion Pass
          </h2>
          <p className="text-xs text-ink-muted mt-1">
            Unlock real-time intelligent conversations & voice chat with {petName}!
          </p>

          <div className="mt-4 flex items-baseline justify-center gap-1">
            <span className="text-3xl font-display font-extrabold text-ink">₹100</span>
            <span className="text-sm font-semibold text-ink-muted">/ month</span>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="p-6 space-y-4">
          <ul className="space-y-3">
            {[
              {
                icon: Bot,
                title: 'Unlimited AI Pet Conversations',
                desc: `Speak or type anything — ${petName} replies smartly with Groq AI in real time.`,
              },
              {
                icon: Zap,
                title: '5 Natural Cartoon Voice Styles',
                desc: 'Sweet, Playful Kitten, Cozy Friend, Cartoon Squeak, and Whisper modes.',
              },
              {
                icon: Heart,
                title: 'Emotional Bonding & Happiness Boosts',
                desc: 'Earn +2 pet happiness on every conversational interaction.',
              },
              {
                icon: ShieldCheck,
                title: 'Talking Tom Mimic is Always Free',
                desc: 'Basic voice repeat mode remains 100% free for everyone forever.',
              },
            ].map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-xl bg-lavender/20 border border-lavender/40 flex items-center justify-center shrink-0 mt-0.5 text-lavender-dark">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink">{feature.title}</h4>
                  <p className="text-[11px] text-ink-muted">{feature.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Action Button */}
          <div className="pt-2">
            <Button
              id="razorpay-subscribe-btn"
              type="button"
              variant="primary"
              size="lg"
              className="w-full text-sm font-bold shadow-soft"
              loading={loading}
              onClick={handleSubscribe}
              icon={Sparkles}
            >
              Subscribe with Razorpay (₹100)
            </Button>
            <p className="text-center text-[11px] text-ink-muted mt-2">
              🔒 Test Mode: No real money is charged. Use any Razorpay test method.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
