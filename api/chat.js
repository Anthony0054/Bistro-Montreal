export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "Méthode non autorisée" });
  }

  try {
    const { prompt } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // Modèle le plus léger et rapide
        messages: [
          { 
            role: "system", 
            content: "Tu es le concierge du Bistro Le Plateau à Montréal. Tu aides les clients à réserver. Si l'utilisateur donne son Nom, Date et Heure, confirme la réservation. Réponds courtement en 2 phrases max." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.5
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // Ce log apparaîtra dans ton tableau de bord Vercel
      console.log("Détails erreur Groq:", JSON.stringify(data));
      return res.status(500).json({ text: "Erreur IA: " + (data.error?.message || "Problème de connexion") });
    }

    return res.status(200).json({ text: data.choices[0].message.content });

  } catch (error) {
    return res.status(500).json({ text: "Erreur technique côté serveur." });
  }
}
