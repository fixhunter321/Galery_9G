console.log("js josjis 9g")
const cardStack = document.getElementById("cardStack");
const counter = document.getElementById("counter");
const gallery = document.querySelector(".gallery");

const TOTAL_CARDS = 25;

let currentIndex = 0;
let isMoving = false;


// ==============================
// Membuat 38 kartu
// ==============================

for (let i = 0; i < TOTAL_CARDS; i++) {

    const card = document.createElement("div");
    card.className = "card";

    const art = document.createElement("div");
    art.className = "art";

    art.textContent = String(i + 1).padStart(2, "0");

    card.appendChild(art);
    cardStack.appendChild(card);
}

const cards = document.querySelectorAll(".card");


// ==============================
// Mengatur posisi kartu
// ==============================

function updateCards(animate = true) {

    cards.forEach((card, index) => {

        card.style.transition = animate
            ? "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)"
            : "none";

        if (index === currentIndex) {

            card.classList.add("active");
            card.classList.remove("next");

            card.style.transform =
                "translate3d(0, 0, 0)";

            card.style.opacity = "1";

        } else if (index === currentIndex + 1) {
    card.style.transform = "translateY(99%)";
    card.style.opacity = "1";
    card.style.zIndex = "1";


        } else {

            card.classList.remove("active", "next");

            card.style.transform =
                "translate3d(0, 110%, 0)";

            card.style.opacity = "0";
        }
    });

    counter.textContent =
        `${String(currentIndex + 1).padStart(2, "0")} / ${TOTAL_CARDS}`;
}


// ==============================
// Pindah ke kartu berikutnya
// ==============================


function nextCard() {
    if (isMoving || artworks.length === 0) return;

    // Kalau sudah di kartu terakhir, kembali ke kartu pertama
    if (currentIndex >= artworks.length - 1) {
        currentIndex = 0;
        renderWindow(false);
        return;
    }

    isMoving = true;
    currentIndex++;

    updateCards(true);

    setTimeout(() => {
        renderWindow(false);
        isMoving = false;
    }, ANIMATION_DURATION);
}



// ==============================
// Kembali ke kartu sebelumnya
// ==============================

function previousCard() {

    if (isMoving || currentIndex <= 0) {
        return;
    }

    isMoving = true;

    currentIndex--;

    updateCards(true);

    setTimeout(() => {
        isMoving = false;
    }, 450);
}


// ==============================
// MOUSE — Scroll Wheel
// ==============================

gallery.addEventListener("wheel", (event) => {

    event.preventDefault();

    if (event.deltaY > 0) {

        // Scroll ke bawah
        nextCard();

    } else if (event.deltaY < 0) {

        // Scroll ke atas
        previousCard();
    }

}, { passive: false });


// ==============================
// TABLET — Swipe
// ==============================

let touchStartY = 0;
let touchEndY = 0;

gallery.addEventListener("touchstart", (event) => {

    touchStartY = event.touches[0].clientY;

}, { passive: true });


gallery.addEventListener("touchend", (event) => {

    touchEndY = event.changedTouches[0].clientY;

    const distance = touchEndY - touchStartY;

    const SWIPE_THRESHOLD = 50;

    // Swipe ke atas
    if (distance < -SWIPE_THRESHOLD) {

        nextCard();
    }

    // Swipe ke bawah
    else if (distance > SWIPE_THRESHOLD) {

        previousCard();
    }

}, { passive: true });


// ==============================
// Posisi awal
// ==============================

updateCards(false);

//from JSON to JS FUNCTION
let artworks = [];

async function loadArtworks() {
    try {
        const response = await fetch("./data.json");

        if (!response.ok) {
            throw new Error("Gagal mengambil artworks.json");
        }

        artworks = await response.json();

        console.log("Jumlah artwork:", artworks.length);
        console.log("Semua data:", artworks);
        console.log("Artwork pertama:", artworks[0]);
    } catch (error) {
        console.error("Error:", error);
    }
}

loadArtworks();