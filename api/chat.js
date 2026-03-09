export default async function handler(req, res) {
  // 1. Sécurité : On accepte uniquement les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "Seules les requêtes POST sont autorisées." });
  }

  try {
    // 2. Extraction du message (avec fallback si le JSON est mal formé)
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const userPrompt = body.prompt || "Bonjour !";

    // 3. Appel à l'API Groq
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Modèle ultra-rapide et gratuit
        messages: [
          { 
            role: "system", 
            content: "Tu es l'assistant du Bistro Le Plateau à Montréal. Tu es poli, chaleureux et tu connais le menu (Soupe à l'oignon 14$, Tartare de betterave 16$). Réponds en maximum 2 phrases." 
          },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7
      })
    });

    // 4. Gestion des erreurs de la clé API ou du serveur Groq
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erreur Groq:", errorData);
      return res.status(500).json({ text: "Erreur de clé API ou quota dépassé. Vérifie la console Vercel." });
    }

    const data = await response.json();
    
    // 5. Envoi de la réponse au site
    return res.status(200).json({ text: data.choices[0].message.content });

  } catch (error) {
    console.error("Erreur Serveur:", error);
    return res.status(500).json({ text: "Le serveur a crashé. Vérifie le format de ta requête." });
  }
}

