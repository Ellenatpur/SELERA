// public/assets/supabase-init.js
const supabaseUrl = 'https://cyxmsawygqrunhinfvyj.supabase.co'; // Isi URL asli kamu
const supabaseKey = 'sb_publishable_3cxazIXr7B0ypa2fN6YVxw_jQyA6TDY'; // Isi Key asli kamu

// Kita buat variabel global agar bisa dipakai di file HTML lain
window.supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);