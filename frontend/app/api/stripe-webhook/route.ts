import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook signature invalid';
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      await handleCheckoutCompleted(session); // 👈 APPEL ICI
    }

    return new Response(null, { status: 200 });
  } catch (err) {
    console.error('Webhook processing error:', err);
    const message = err instanceof Error ? err.message : 'Unknown webhook error';
    return new Response(`Webhook handler error: ${message}`, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const planId = session.metadata?.planId;
  const clientId = session.metadata?.clientId || session.client_reference_id;
  const clientEmail =
    session.metadata?.clientEmail || session.customer_details?.email;

  console.log('Paiement réussi', {
    sessionId: session.id,
    planId,
    clientId,
    clientEmail
  });

  if (!planId) {
    throw new Error('planId manquant dans metadata');
  }

  if (!clientId && !clientEmail) {
    throw new Error('Aucun clientId ni clientEmail trouvé');
  }

  // 👇 ICI tu vas créer / activer l’abonnement
  await createSubscription({
    clientId: typeof clientId === 'string' ? clientId : '',
    clientEmail: clientEmail ?? '',
    stripeSessionId: session.id,
    stripeCustomerId: typeof session.customer === 'string' ? session.customer : null,
    stripeSubscriptionId:
      typeof session.subscription === 'string' ? session.subscription : null,
    planId
  });
}

async function createSubscription(data: {
  clientId: string;
  clientEmail: string;
  stripeSessionId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  planId: string;
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL est manquante');
  }

  const response = await fetch(`${apiUrl}/api/subscriptions/stripe-webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur création abonnement Nova: ${errorText}`);
  }

  return response.json();
}