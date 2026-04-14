import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error('STRIPE_SECRET_KEY est manquante');
}

const stripe = new Stripe(secretKey);

const PRICE_MAP: Record<string, { priceId?: string; mode: 'subscription' | 'payment' }> = {
  'groupe-2x': {
    priceId: process.env.STRIPE_PRICE_ID_GROUPE_2X,
    mode: 'subscription'
  },
  'groupe-illimite': {
    priceId: process.env.STRIPE_PRICE_ID_GROUPE_ILLIMITE,
    mode: 'subscription'
  },
  'libre-illimite': {
    priceId: process.env.STRIPE_PRICE_ID_LIBRE_ILLIMITE,
    mode: 'subscription'
  },
  '10-seances': {
    priceId: process.env.STRIPE_PRICE_ID_10_SEANCES,
    mode: 'payment'
  },
  '30-seances': {
    priceId: process.env.STRIPE_PRICE_ID_30_SEANCES,
    mode: 'payment'
  },
  'drop-in': {
    priceId: process.env.STRIPE_PRICE_ID_DROP_IN,
    mode: 'payment'
  }
};

export async function POST(req: Request) {
  try {
    const { planId, clientEmail, clientId } = await req.json();

    const entry = PRICE_MAP[planId];

    if (!entry || !entry.priceId) {
      return Response.json(
        { error: `Price ID manquant pour ${planId}` },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (!siteUrl) {
      return Response.json(
        { error: 'NEXT_PUBLIC_SITE_URL est manquante.' },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: entry.mode,
      line_items: [
        {
          price: entry.priceId,
          quantity: 1
        }
      ],
      success_url: `${siteUrl}/abonnements?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/abonnements?cancel=1`,
      customer_email: clientEmail ?? undefined,
      client_reference_id: clientId ?? undefined,
      metadata: {
        planId,
        clientEmail: clientEmail ?? '',
        clientId: clientId ?? ''
      }
    });

    console.log('created stripe session', {
      id: session.id,
      client_reference_id: session.client_reference_id,
      metadata: session.metadata
    });
    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session', error);
    return Response.json(
      { error: 'Une erreur est survenue lors de la création de la session de paiement.' },
      { status: 500 }
    );
  }
}