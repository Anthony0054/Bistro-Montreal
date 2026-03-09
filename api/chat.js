export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "Seules les requêtes POST sont autorisées." });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const userPrompt = body.prompt || "Bonjour !";

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Nouveau modèle à jour
        messages: [
          { 
            role: "system", 
            content: "Tu es l'assistant du Bistro Le Plateau à Montréal. Tu es poli et chaleureux. Réponds en maximum 2 phrases." 
          },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(500).json({ text: "Erreur Groq: " + errorData.error.message });
    }

    const data = await response.json();
    return res.status(200).json({ text: data.choices[0].message.content });

  } catch (error) {
    return res.status(500).json({ text: "Erreur serveur interne." });
  }
}
