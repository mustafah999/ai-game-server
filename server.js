
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = "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";

app.post("/api/generate-game", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "أنت مولد ألعاب HTML سخيفة ومضحكة.",
          },
          {
            role: "user",
            content: "اصنع لي لعبة HTML مضحكة وسخيفة، مع تعليمات داخل اللعبة.",
          },
        ],
        temperature: 1.3,
        max_tokens: 800,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const gameHtml = response.data.choices[0].message.content;
    res.send({ html: gameHtml });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send({ error: "فشل توليد اللعبة من OpenAI" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
