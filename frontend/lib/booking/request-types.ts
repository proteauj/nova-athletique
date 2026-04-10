export type RequestType =
  | "programme"
  | "one_on_one"
  | "prise_de_plis_adipeux"
  | "plan_alimentaire";

export const requestTypeConfig: Record<
  RequestType,
  {
    label: string;
    durationMinutes: number;
    summaryPrefix: string;
    defaultNote: string;
  }
> = {
  programme: {
    label: "Programme",
    durationMinutes: 60,
    summaryPrefix: "Demande - Programme",
    defaultNote: "Demande de rencontre pour programme personnalisé."
  },
  one_on_one: {
    label: "One on One",
    durationMinutes: 60,
    summaryPrefix: "Demande - One on One",
    defaultNote: "Demande de séance privée avec coach."
  },
  prise_de_plis_adipeux: {
    label: "Prise de plis adipeux",
    durationMinutes: 30,
    summaryPrefix: "Demande - Prise de plis adipeux",
    defaultNote: "Demande d’évaluation de composition corporelle."
  },
  plan_alimentaire: {
    label: "Plan alimentaire",
    durationMinutes: 60,
    summaryPrefix: "Demande - Plan alimentaire",
    defaultNote: "Demande de rencontre pour plan alimentaire."
  }
};