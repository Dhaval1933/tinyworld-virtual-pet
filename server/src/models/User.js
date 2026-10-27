const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: [true, 'Display name is required'],
      trim: true,
      minlength: [2, 'Display name must be at least 2 characters'],
      maxlength: [30, 'Display name cannot exceed 30 characters'],
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username cannot exceed 20 characters'],
      match: [/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores'],
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    coins: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalXP: {
      type: Number,
      default: 0,
      min: 0,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    subscription: {
      status: {
        type: String,
        enum: ['none', 'active', 'expired'],
        default: 'none',
      },
      plan: {
        type: String,
        default: 'none',
      },
      currentPeriodEnd: {
        type: Date,
        default: null,
      },
      razorpayPaymentId: {
        type: String,
        default: null,
      },
      razorpayOrderId: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);


/**
 * Hash password before saving (only if modified).
 */
userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
});

/**
 * Compare a candidate password with the stored hash.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

/**
 * Check if user has an active AI conversation subscription pass.
 */
userSchema.methods.hasActiveAiSubscription = function () {
  return (
    this.subscription &&
    this.subscription.status === 'active' &&
    this.subscription.currentPeriodEnd &&
    new Date(this.subscription.currentPeriodEnd) > new Date()
  );
};

/**
 * Return user data without sensitive fields.
 */
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  obj.hasAiSubscription = this.hasActiveAiSubscription();
  return obj;
};

module.exports = mongoose.model('User', userSchema);
