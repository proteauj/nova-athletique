import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text(); // ⚠️ IMPORTANT: raw body
  const sig = req.headers.get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET! // ✅ ICI
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // 👇 Traitement de l'événement
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // 👉 Ici tu actives l'abonnement / crédit / etc
    console.log('Paiement réussi', session);
  }

  return new Response(null, { status: 200 });
}