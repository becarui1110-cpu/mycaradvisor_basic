import { ColorScheme, StartScreenPrompt, ThemeOption } from "@openai/chatkit";

/** === ⚙️ Configuration générale === */
export const APP_NAME = "MyCarAdvisor Basic";

export const WORKFLOW_ID =
  process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID?.trim() ?? "";

export const CREATE_SESSION_ENDPOINT = "/api/create-session";
export const PLAN = "basic";

/** === 🧠 Prompts rapides visibles sur l’écran d’accueil === */
export const STARTER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "Fiabilité Golf 7 1.6 TDI (2015)",
    prompt: "Peux-tu me dire si la Golf 7 1.6 TDI 2015 est fiable ?",
  },
  {
    label: "Coût d’entretien Yaris 2018",
    prompt: "Quel est le coût d’entretien moyen d’une Toyota Yaris 2018 ?",
  },
  {
    label: "Estimation de reprise",
    prompt:
      "Quelle est la valeur de reprise estimée pour une Peugeot 308 2017, 95 000 km, bon état, 2e main ?",
  },
  {
    label: "Comparatif conso hybride vs diesel",
    prompt:
      "Compare la consommation et le coût annuel d’une Corolla Hybride 2020 vs une Clio 1.5 dCi 2020 pour 15 000 km/an.",
  },
];

/** === 💬 Texte par défaut dans la barre de saisie === */
export const PLACEHOLDER_INPUT = "Posez votre question (Premium)";

/** === 👋 Message d’accueil du chatbot ===
 * -> le markdown ** ... ** mettra bien le début en gras
 */
export const GREETING =
  "**Bonjour 👋 et bienvenue sur MyCarAdvisor Premium.** Posez-moi vos questions sur la fiabilité, l’entretien, la valeur de votre véhicule, et profitez d’analyses détaillées.";

/** === 🎨 Thème du chat (palette Premium) ===
 * On reste dans les props que ta version de @openai/chatkit connaît.
 */
export const getThemeConfig = (theme: ColorScheme): ThemeOption => ({
  color: {
    grayscale: {
      hue: 220,
      tint: 6,
      shade: theme === "dark" ? -1 : -4,
    },
    accent: {
      // vert premium
      primary: theme === "dark" ? "#00c58e" : "#0f766e",
      level: 1,
    },
  },
  radius: "round",
});
