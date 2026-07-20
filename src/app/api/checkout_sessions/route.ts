import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { itemId, email } = body

        if (!itemId) {
            return NextResponse.json({ error: 'No itemId provided' }, { status: 400 })
        }

        // Fetch item from zyvora-server to ensure price is secure (public endpoint, no auth needed)
        let item;
        try {
            const serverApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${serverApiUrl}/items/${itemId}`);
            if (!res.ok) throw new Error(`Item fetch failed: ${res.status}`);
            const data = await res.json();
            item = data.item;
        } catch (error) {
            console.error('Error fetching item from server:', error);
            return NextResponse.json({ error: 'Item not found' }, { status: 404 })
        }

        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 })
        }

        const appUrl = process.env.NEXT_PUBLIC_BASE_URL

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
        // We forward the raw cookie header so the backend's Better Auth session can authenticate the user.
        // This is necessary because this is a server-side route — browser cookies don't auto-attach.
        try {
            const cookieHeader = req.headers.get('cookie') || '';
            const serverApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            
            const bookingRes = await fetch(`${serverApiUrl}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Forward the browser's cookie verbatim so Better Auth can read the session
                    'Cookie': cookieHeader,
                },
                body: JSON.stringify({
                    itemId: item._id,
                    amount: item.price,
                    stripeSessionId: checkoutSession.id,
                }),
            });

            if (!bookingRes.ok) {
                const errData = await bookingRes.json().catch(() => ({}));
                console.error('Failed to create pending booking:', bookingRes.status, errData);
            }
        } catch (bookingError) {
            console.error('Failed to create pending booking in backend:', bookingError);
            // Proceed anyway — verifyBookingSuccess on the success page will handle it
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
