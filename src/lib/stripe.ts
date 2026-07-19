import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('Missing STRIPE_SECRET_KEY environment variable. Stripe features will fail.');
}

// Initialize Stripe with the secret key from env or a dummy key to prevent crashes at boot
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2025-01-27.acacia' as any,
})
