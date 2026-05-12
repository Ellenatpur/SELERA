require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');
app.use(cors());

const app = express();
app.use(cors());
app.use(express.json());

// Melayani file statis dari folder utama
app.use(express.static(path.join(__dirname, '/')));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        console.log("Pesan masuk:", message);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(`Kamu adalah Kira, teman virtual yang ceria. Pesan user: ${message}`);
        const response = await result.response;
        const text = response.text();

        console.log("Balasan AI:", text);
        res.json({ reply: text });
    } catch (error) {
        console.error("Error di server:", error);
        res.status(500).json({ error: "Gagal memproses pesan" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Mantap! Server Kira sudah jalan di http://localhost:${PORT}`);
});