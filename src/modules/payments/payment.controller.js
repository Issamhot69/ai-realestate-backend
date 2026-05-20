const User = require('../users/user.model');

const PLANS = {
  pro: { amount: 2900, name: 'PRO' },
  elite: { amount: 9900, name: 'ELITE' }
};

const createCheckoutSession = async (req, res) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { plan } = req.body;
    if (!PLANS[plan]) return res.status(400).json({ message: 'Invalid plan' });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: `AI RealEstate ${PLANS[plan].name}` },
          unit_amount: PLANS[plan].amount,
          recurring: { interval: 'month' }
        },
        quantity: 1
      }],
      success_url: `${process.env.FRONTEND_URL}/pricing?success=true&plan=${plan}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?cancelled=true`,
      metadata: { userId: req.user.id, plan }
    });
    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    res.status(500).json({ message: 'Stripe error', error: err.message });
  }
};

const stripeWebhook = async (req, res) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { userId, plan } = session.metadata;
      await User.findByIdAndUpdate(userId, { plan });
    }
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      await User.findOneAndUpdate({ stripeCustomerId: subscription.customer }, { plan: 'free' });
    }
    res.json({ received: true });
  } catch (err) {
    res.status(400).json({ message: `Webhook error: ${err.message}` });
  }
};

const getUserPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('plan email name');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createCheckoutSession, stripeWebhook, getUserPlan };