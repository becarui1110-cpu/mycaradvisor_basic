import { ColorScheme, StartScreenPrompt, ThemeOption } from "@openai/chatkit";

/** === ⚙️ Configuration générale (BASIC) === */
export const APP_NAME = "MyCarAdvisor Basic";

export const WORKFLOW_ID =
  process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID?.trim() ?? "";

export const CREATE_SESSION_ENDPOINT = "/api/create-session";
export const PLAN = "basic";

/** === 🧠 Prompts rapides (plus simples pour Basic) === */
export const STARTER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "Fiabilité Clio 2016",
    prompt: "La Renault Clio 2016 est-elle fiable pour un usage quotidien ?",
  },
  {
    label: "Coût d’entretien annuel",
    prompt:
      "Combien coûte l’entretien annuel moyen d’une citadine essence récente ?",
  },
  {
    label: "Estimer la conso",
    prompt:
      "Estime la consommation pour 12 000 km/an avec un petit moteur essence.",
  },
];

/** === 💬 Placeholder de la barre de saisie === */
export const PLACEHOLDER_INPUT = "Posez une question automobile (Basic)";

/** === 👋 Message d’accueil (Markdown OK) === */
export const GREETING =
  "Bonjour 👋 Je suis **MyCarAdvisor Basic**. Posez vos questions simples sur la fiabilité, l’entretien et la consommation.";

/** === 🎨 Thème du chat (Basic) ===
 * Palette plus neutre, accent vert “MyCarAdvisor”
 */
export const getThemeConfig = (theme: ColorScheme): ThemeOption => ({
  color: {
    grayscale: {
      hue: 220,
      tint: 6,
      shade: theme === "dark" ? -1 : -4,
    },
    accent: {
      primary: "#10B981", // vert émeraude
      level: 1,
    },
  },
  radius: "round",
});
