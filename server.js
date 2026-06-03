require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose'); // 1. Tambahkan Mongoose
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); 
app.use(express.json());

// Melayani file statis (HTML, CSS, JS, dan Assets)
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// KONEKSI MONGODB
// ==========================================
// Kamu bisa masukkan URL ini ke file .env dengan nama MONGO_URI agar lebih aman
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/database_kira';
mongoose.connect(mongoURI)
  .then(() => console.log('🔥 Hubungan intim dengan MongoDB berhasil terbentuk!'))
  .catch((err) => console.error('❌ Waduh, gagal konek database:', err));

// Membuat Schema & Model untuk menyimpan riwayat chat
const ChatSchema = new mongoose.Schema({
    pesanUser: String,
    balasanKira: String,
    waktu: { type: Date, default: Date.now }
});
const ChatLog = mongoose.model('ChatLog', ChatSchema);


// ==========================================
// ROUTE UNTUK HALAMAN-HALAMAN KAMU (Clean URL)
// ==========================================
// Contoh jika kamu mau buat link rapi untuk 5 halamanmu:
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chatkira.html'));
});
// Silakan tambah halaman lainnya di sini jika ingin URL-nya rapi tanpa ".html"
// app.get('/profil', (req, res) => res.sendFile(path.join(__dirname, 'public', 'profil.html')));


// ==========================================
// ROUTE API GEMINI & SIMPAN KE DATABASE
// ==========================================
if (!process.env.GEMINI_API_KEY) {
    console.error("❌ ERROR: GEMINI_API_KEY tidak ditemukan di file .env!");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        console.log("📩 Pesan masuk:", message);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        
        const result = await model.generateContent(`
            Kamu adalah Kira, teman virtual yang sangat suportif, ceria, dan peduli. 
            Gunakan bahasa Indonesia yang santai, akrab seperti teman sebaya, dan gunakan emoji. 
            Jawab dengan singkat dan hangat.
            Pesan user: ${message}
        `);

        const response = await result.response;
        const text = response.text();

        console.log("🤖 Balasan Kira:", text);

        // 2. SIMPAN DATA CHAT KE MONGODB
        const chatBaru = new ChatLog({
            pesanUser: message,
            balasanKira: text
        });
        await chatBaru.save(); // Menyimpan ke database secara otomatis
        console.log("💾 Chat berhasil disimpan ke database!");

        res.json({ reply: text });

    } catch (error) {
        console.error("❌ Error di server:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`\n🚀 ==========================================`);
    console.log(`✅ Mantap! Server Kira sudah jalan!`);
    console.log(`📍 Akses di: http://localhost:${PORT}`);
    console.log(`============================================\n`);
});