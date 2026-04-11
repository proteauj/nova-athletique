'use client';

import { useMemo, useState } from "react";
import { RequestType, requestTypeConfig } from "@/lib/booking/request-types";
import { Coach, ScheduleSlot } from "@/lib/schedule/types";

type Props = {
  coach: Coach;
  slot: ScheduleSlot;
  isTrialMode?: boolean;
  onClose?: () => void;
};

function buildDateFromDayAndTime(day: number, time: string): Date {
  const now = new Date();
  const currentDay = now.getDay();
  const delta = day - currentDay;

  const date = new Date(now);
  date.setDate(now.getDate() + delta);

  const [hours, minutes] = time.split(":").map(Number);
  date.setHours(hours, minutes, 0, 0);

  return date;
}

export default function BookingRequestForm({ coach, slot, onClose }: Props) {
  const [requestType, setRequestType] = useState<RequestType>("one_on_one");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const preset = useMemo(() => requestTypeConfig[requestType], [requestType]);

  const submit = async () => {
    if (!clientName.trim() || !clientEmail.trim()) {
      alert("Merci d’entrer votre nom et votre courriel.");
      return;
    }

    try {
      setIsSubmitting(true);

      const start = buildDateFromDayAndTime(slot.day, slot.start);
      const end = buildDateFromDayAndTime(slot.day, slot.end);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error('NEXT_PUBLIC_API_URL est manquante.');
      }

      const response = await fetch(`${apiUrl}/api/BookingRequests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          coachId: coach.id,
          coachName: coach.name,
          coachEmail: coach.email,
          calendarId: coach.calendarId,
          clientName,
          clientEmail,
          requestType,
          note: note.trim() || preset.defaultNote,
          startTimeUtc: start.toISOString(),
          endTimeUtc: end.toISOString(),
          slotId: slot.id,
          title: slot.title
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erreur lors de la création de la demande.");
      }

      alert("Demande envoyée et événement créé.");
      onClose?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Impossible d’envoyer la demande.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card" style={{ display: "grid", gap: 12 }}>
      <h3>Réserver avec {coach.name}</h3>

      <p className="section-copy">
        Créneau sélectionné : {slot.title} — {slot.start} à {slot.end}
      </p>

      <select
        value={requestType}
        onChange={(e) => setRequestType(e.target.value as RequestType)}
        style={fieldStyle}
      >
        <option value="programme">Programme</option>
        <option value="one_on_one">One on One</option>
        <option value="prise_de_plis_adipeux">Prise de plis adipeux</option>
        <option value="plan_alimentaire">Plan alimentaire</option>
      </select>

      <input
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        placeholder="Nom du client"
        style={fieldStyle}
      />

      <input
        type="email"
        value={clientEmail}
        onChange={(e) => setClientEmail(e.target.value)}
        placeholder="Courriel du client"
        style={fieldStyle}
      />

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={preset.defaultNote}
        style={{
          ...fieldStyle,
          minHeight: 120,
          paddingTop: 12,
          resize: "vertical"
        }}
      />

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button
          className="button"
          type="button"
          onClick={submit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Envoi..." : "Envoyer la demande"}
        </button>

        {onClose && (
          <button
            className="button-outline"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Annuler
          </button>
        )}
      </div>
    </div>
  );
}

const fieldStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 54,
  borderRadius: 16,
  border: "1px solid rgba(159,223,224,0.18)",
  background: "var(--surface-2)",
  color: "var(--text)",
  padding: "0 1rem",
  fontSize: 20
};