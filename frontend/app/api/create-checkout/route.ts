import Stripe from "stripe";

const PRICE_MAP: Record<
  string,
  { priceId?: string; mode: "subscription" | "payment" }
> = {
  "groupe-2x": {
    priceId: process.env.STRIPE_PRICE_ID_GROUPE_2X,
    mode: "subscription",
  },
  "groupe-illimite": {
    priceId: process.env.STRIPE_PRICE_ID_GROUPE_ILLIMITE,
    mode: "subscription",
  },
  "libre-illimite": {
    priceId: process.env.STRIPE_PRICE_ID_LIBRE_ILLIMITE,
    mode: "subscription",
  },
  "10-seances": {
    priceId: process.env.STRIPE_PRICE_ID_10_SEANCES,
    mode: "payment",
  },
  "30-seances": {
    priceId: process.env.STRIPE_PRICE_ID_30_SEANCES,
    mode: "payment",
  },
  "drop-in": {
    priceId: process.env.STRIPE_PRICE_ID_DROP_IN,
    mode: "payment",
  },
};

export async function POST(req: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY manquante");
      return Response.json(
        { error: "Configuration Stripe incomplète." },
        { status: 500 }
      );
    }

    const { planId, clientEmail } = await req.json();

    if (!planId || typeof planId !== "string") {
      return Response.json(
        { error: "Plan invalide." },
        { status: 400 }
      );
    }

    const entry = PRICE_MAP[planId];

    if (!entry || !entry.priceId) {
      return Response.json(
        { error: "Plan Stripe non configuré." },
        { status: 400 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const stripe = new Stripe(stripeSecretKey);

    const session = await stripe.checkout.sessions.create({
      mode: entry.mode,
      line_items: [
        {
          price: entry.priceId,
          quantity: 1,
        },
      ],
      customer_email:
        typeof clientEmail === "string" && clientEmail.length > 0
          ? clientEmail
          : undefined,
      success_url: `${siteUrl}/abonnements?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/abonnements?cancel=1`,
      metadata: {
        planId,
        clientEmail:
          typeof clientEmail === "string" ? clientEmail : "",
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout", error);
    return Response.json(
      { error: "Erreur Stripe Checkout." },
      { status: 500 }
    );
  }
}