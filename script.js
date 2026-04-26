const chatBox = document.getElementById("chatBox");
const diary = document.getElementById("diaryInput");
const menu = document.getElementById("menu");
const container = document.getElementById("container");
const toast = document.getElementById("toast");

let started = false;

/* ================= DATE ================= */
setInterval(() => {
    const now = new Date();
    document.getElementById("date").innerText =
        now.toLocaleDateString("id-ID");

    document.getElementById("time").innerText =
        now.toLocaleTimeString("id-ID",{hour:'2-digit',minute:'2-digit'});
}, 1000);

/* ================= TOAST ================= */
function showToast(msg){
    toast.innerText = msg;
    toast.style.opacity = 1;

    setTimeout(()=>{
        toast.style.opacity = 0;
    },2000);
}

/* ================= START CHAT ================= */
function startChat(){
    if(started) return;
    started = true;

    addBubble("Hai 😊 gimana kabarmu hari ini?");
    setTimeout(()=>{
        addBubble("Pilih emoji yang menggambarkan perasaanmu ya 😊", true);
    },1500);
}

/* ================= ADD BUBBLE ================= */
function addBubble(text, withEmoji=false, callback){

    const typing = document.createElement("div");
    typing.className = "message";
    typing.innerHTML = `
        <div class="avatar"></div>
        <div class="bubble typing">
            <span></span><span></span><span></span>
        </div>
    `;
    chatBox.appendChild(typing);

    setTimeout(()=>{
        typing.remove();

        const msg = document.createElement("div");
        msg.className = "message";

        const bubble = document.createElement("div");
        bubble.className = "bubble";

        typeText(bubble, text, ()=>{
            if(withEmoji){
                const em = document.createElement("div");
                em.className = "emoji";
                em.innerHTML = `
                    <span onclick="selectMood('happy')">😊</span>
                    <span onclick="selectMood('confused')">😐</span>
                    <span onclick="selectMood('sad')">😢</span>
                    <span onclick="selectMood('angry')">😡</span>
                `;
                bubble.appendChild(em);
            }

            if(callback) callback();
        });

        msg.innerHTML = `<div class="avatar"></div>`;
        msg.appendChild(bubble);

        chatBox.appendChild(msg);

    },800);
}

/* ================= TYPE ================= */
function typeText(el, text, cb){
    let i = 0;
    let interval = setInterval(()=>{
        el.innerHTML += text.charAt(i);
        i++;
        if(i >= text.length){
            clearInterval(interval);
            if(cb) cb();
        }
    },25);
}

/* ================= SELECT MOOD ================= */
function selectMood(mood){

    diary.disabled = false;

    let response = "";

    if(mood === "happy"){
        response = "Wah seneng ya hari ini 😊 semoga hal baik terus terjadi ya!";
        container.style.background = "linear-gradient(#c8f7c5,#eaffea)";
    }
    else if(mood === "confused"){
        response = "Lagi bingung ya? gapapa pelan-pelan aja, semua pasti ada jalan 😊";
        container.style.background = "linear-gradient(#dbe6f6,#c5796d)";
    }
    else if(mood === "sad"){
        response = "Sedih ya... gapapa kok, kamu kuat 💙 aku dengerin ceritamu ya";
        container.style.background = "linear-gradient(#a0bcd6,#d6e6f2)";
    }
    else if(mood === "angry"){
        response = "Lagi marah ya 😤 coba tarik napas dulu... aku di sini buat kamu";
        container.style.background = "linear-gradient(#f7c5c5,#f2d6d6)";
    }

    addBubble(response, false, ()=>{

        const hint = document.createElement("div");
        hint.className = "click-hint";
        hint.innerText = "klik untuk lanjut...";
        chatBox.appendChild(hint);

        hint.addEventListener("click", hideChatOnce);
    });
}

/* ================= HIDE CHAT ================= */
function hideChatOnce(){

    chatBox.style.transition = "0.3s";
    chatBox.style.opacity = "0";
    chatBox.style.transform = "translateY(10px)";

    setTimeout(()=>{
        chatBox.innerHTML = "";
        chatBox.style.opacity = "1";
        chatBox.style.transform = "translateY(0)";
    },300);
}

/* ================= MENU ================= */
function toggleMenu(){
    menu.classList.toggle("show");
}

/* ================= CRUD ================= */
function saveDiary(){
    localStorage.setItem("diary", diary.value);
    showToast("Diary tersimpan 💾");
}

function editDiary(){
    diary.disabled = false;
    showToast("Mode edit aktif ✏️");
}

function deleteDiary(){
    diary.value = "";
    localStorage.removeItem("diary");
    showToast("Diary dihapus 🗑️");
}

/* ================= LOAD ================= */
window.onload = function(){
    const saved = localStorage.getItem("diary");
    if(saved){
        diary.value = saved;
    }
};

/* ================= AUTO SAVE ================= */
diary.addEventListener("input", ()=>{
    localStorage.setItem("diary", diary.value);
});

function showToast(msg){
    toast.innerText = msg;

    toast.classList.add("show");

    setTimeout(()=>{
        toast.classList.remove("show");
    },2000);
};