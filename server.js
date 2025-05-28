const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 مفتاح Gemini
const GEMINI_API_KEY = "AIzaSyCGxVLb5S2C6CcCbbYAvkmhvVa_CREYOcc";

app.post("/api/generate-game", async (req, res) => {
  try {
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text:
                  "اصنع لي لعبة HTML مضحكة وسخيفة تعمل داخل المتصفح. أرسل فقط الكود الكامل داخل وسم <html> بدون شرح أو نص إضافي.",
              },
            ],
          },
        ],
      }
    );

    // نأخذ النص المولد (code)
    const gameHtml = geminiRes.data.candidates[0]?.content?.parts[0]?.text;

    if (!gameHtml || !gameHtml.includes("<html")) {
      return res.status(400).send({ error: "الرد غير صالح أو فارغ من Gemini" });
    }

    res.send({ html: gameHtml });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send({ error: "فشل توليد اللعبة من Gemini API" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
