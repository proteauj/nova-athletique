import { BookingRequestPayload } from "./types";

export function buildMailtoLink(payload: BookingRequestPayload) {
  const subject = encodeURIComponent(
    `Demande de réservation - ${payload.coachName}`
  );

  const body = encodeURIComponent(
`Bonjour ${payload.coachName},

J’aimerais faire une demande de réservation.

Informations du client :
Nom : ${payload.clientName}
Courriel : ${payload.clientEmail}

Créneau demandé :
Slot ID : ${payload.slotId}

Note :
${payload.note ?? ""}

Merci.`
  );

  return `mailto:${payload.coachEmail}?cc=${encodeURIComponent(payload.clientEmail)}&subject=${subject}&body=${body}`;
}

export async function createBookingRequest(payload: BookingRequestPayload) {
  const response = await fetch("/api/booking-requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Impossible de créer la demande de réservation.");
  }

  return response.json();
}