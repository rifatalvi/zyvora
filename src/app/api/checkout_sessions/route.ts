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

        // Create pending booking in MongoDB directly
        // We do this directly because cross-domain cookie forwarding from Next.js server to Express backend is unreliable in Vercel
        try {
            const { MongoClient, ObjectId } = await import('mongodb')
            const client = new MongoClient(process.env.MONGODB_URI as string)
            const db = client.db('zyvora')
            
            await db.collection('booking').insertOne({
                userId: body.userId, // passed from frontend
                itemId: new ObjectId(item._id),
                amount: item.price,
                stripeSessionId: checkoutSession.id,
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            await client.close()
        } catch (bookingError: any) {
            console.error('Failed to create pending booking in DB directly:', bookingError.message);
            return NextResponse.json(
                { error: `Failed to initialize booking: ${bookingError.message}` },
                { status: 500 }
            )
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
