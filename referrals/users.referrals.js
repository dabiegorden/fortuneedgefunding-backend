const crypto = require('crypto');

// Generate a unique referral code
exports.generateReferralCode = () => {
  return crypto.randomBytes(5).toString('hex').toUpperCase();
};

// Process referral bonus
exports.processReferralBonus = async (referredByCode, newUserId) => {
  if (!referredByCode) return;

  try {
    const referrer = await User.findOne({ 
      where: { referralCode: referredByCode } 
    });

    if (referrer) {
      // Calculate referral bonus (5% of first account purchase)
      const referralBonus = 50; // Example fixed amount

      // Update referrer's account balance
      referrer.accountBalance += referralBonus;
      await referrer.save();

      // Log referral transaction
      await ReferralTransaction.create({
        referrerId: referrer.id,
        referredUserId: newUserId,
        bonusAmount: referralBonus
      });
    }
  } catch (error) {
    console.error('Referral bonus processing error:', error);
  }
};