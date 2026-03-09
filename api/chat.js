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
        model: "llama3-70b-8192", 
        messages: [
          { 
            role: "system", 
            content: "Tu es le concierge du Bistro Le Plateau à Montréal. Tu aides les clients à réserver. Si l'utilisateur donne son Nom, Date et Heure, confirme la réservation avec le code [RESERVATION_CONFIRMED]. Réponds courtement." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erreur Groq:", data);
      return res.status(500).json({ text: "Erreur Groq: " + (data.error?.message || "Inconnue") });
    }

    return res.status(200).json({ text: data.choices[0].message.content });

  } catch (error) {
    console.error("Erreur Serveur:", error);
    return res.status(500).json({ text: "Erreur de serveur interne." });
  }
}
