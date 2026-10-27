const crypto = require('crypto');
const Razorpay = require('razorpay');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require('../config/env');

const PLAN_AMOUNT_PAISE = 10000; // ₹100.00
const PLAN_NAME = 'AI Companion Pass (Monthly)';

/**
 * Initialize Razorpay client instance.
 */
function getRazorpayClient() {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new AppError(
      'Razorpay API keys are not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
      500
    );
  }
  return new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
}

/**
 * POST /api/v1/subscription/create-order
 * Create a new Razorpay order for ₹100 monthly subscription pass.
 */
exports.createOrder = async (req, res, next) => {
  try {
    const razorpay = getRazorpayClient();

    const receipt = `sub_${Date.now()}_${String(req.user._id).slice(-6)}`;
    const options = {
      amount: PLAN_AMOUNT_PAISE,
      currency: 'INR',
      receipt,
      notes: {
        userId: String(req.user._id),
        email: req.user.email,
        plan: 'ai_companion_monthly',
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
      planName: PLAN_NAME,
      prefill: {
        name: req.user.displayName,
        email: req.user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/subscription/verify-payment
 * Verify Razorpay HMAC signature and activate 30-day AI Companion Pass.
 */
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new AppError('Missing payment verification details.', 400);
    }

    if (!RAZORPAY_KEY_SECRET) {
      throw new AppError('Razorpay key secret is not configured on server.', 500);
    }

    // Verify HMAC SHA-256 signature
    const hmac = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      throw new AppError('Payment signature verification failed. Transaction rejected.', 400);
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    // Activate 30-day subscription period
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    user.subscription = {
      status: 'active',
      plan: 'ai_companion_monthly',
      currentPeriodEnd: new Date(Date.now() + thirtyDays),
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
    };

    await user.save();

    res.json({
      success: true,
      message: '🎉 Welcome to TinyWorld AI Companion Pass! You can now chat freely with your pet.',
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/subscription/status
 * Get current user's subscription status and days remaining.
 */
exports.getStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) throw new AppError('User not found.', 404);

    const isActive = user.hasActiveAiSubscription();
    let daysRemaining = 0;

    if (isActive && user.subscription.currentPeriodEnd) {
      const msLeft = new Date(user.subscription.currentPeriodEnd) - Date.now();
      daysRemaining = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
    }

    res.json({
      success: true,
      subscription: {
        status: isActive ? 'active' : 'none',
        plan: user.subscription?.plan || 'none',
        currentPeriodEnd: user.subscription?.currentPeriodEnd || null,
        daysRemaining,
      },
      hasActiveSubscription: isActive,
    });
  } catch (error) {
    next(error);
  }
};
