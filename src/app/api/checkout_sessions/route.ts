import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import api from '@/lib/api'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { itemId, email } = body

        if (!itemId) {
            return NextResponse.json({ error: 'No itemId provided' }, { status: 400 })
        }

        // Fetch item from zyvora-server to ensure price is secure
        let item;
        try {
            // Using absolute URL if needed, but api uses NEXT_PUBLIC_API_URL
            const res = await api.get(`/items/${itemId}`);
            item = res.data.item;
        } catch (error) {
            console.error('Error fetching item from server:', error);
            return NextResponse.json({ error: 'Item not found' }, { status: 404 })
        }

        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 })
        }

        const appUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.title,
                        description: item.shortDescription || 'Course enrollment',
                        images: item.thumbnail ? [item.thumbnail] : [],
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: 1,
            }
        ]

        // Create Stripe Checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items,
            customer_email: email || undefined,
            metadata: {
                itemId: item._id,
            },
            success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${appUrl}/items/${item._id}`,
        })

        // Create pending booking in zyvora-server
        try {
            // Forward the cookie from the incoming request so the backend can authenticate the user
            const cookieHeader = req.headers.get('cookie') || '';
            await api.post(
                '/bookings', 
                {
                    itemId: item._id,
                    amount: item.price,
                    stripeSessionId: checkoutSession.id,
                },
                {
                    headers: {
                        Cookie: cookieHeader,
                    }
                }
            );
        } catch (bookingError) {
            console.error('Failed to create pending booking in backend:', bookingError);
            // We can choose to fail the checkout, but for now we proceed. 
            // In a real production app, you might want to cancel the stripe session if DB save fails.
        }

        return NextResponse.json({ url: checkoutSession.url })
    } catch (err) {
        const error = err as { message?: string; statusCode?: number }
        console.error('Stripe checkout error:', err)
        return NextResponse.json(
            { error: error.message ?? 'Failed to create checkout session' },
            { status: error.statusCode ?? 500 }
        )
    }
}
