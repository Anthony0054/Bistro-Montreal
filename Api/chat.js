export default async function handler(req, res) {
  const { prompt } = JSON.parse(req.body);
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "Tu es l'assistant du Bistro Montréal. Réponds poliment aux clients sur le menu (Burger 18$, Bol Énergie 16$). Sois bref." },
        { role: "user", content: prompt }
      ]
    })
  });
  const data = await response.json();
  res.status(200).json({ text: data.choices[0].message.content });
}
