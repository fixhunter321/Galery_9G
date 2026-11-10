
console.log("Gallery JS berjalan!");

const cardStack = document.getElementById("cardStack");
const counter = document.getElementById("counter");
const gallery = document.querySelector(".gallery");

let artworks = [];
let currentIndex = 0;
let isMoving = false;

const ANIMATION_DURATION = 500;

// Membuat satu kartu dari data JSON
function createCard(artwork) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.index = artwork.id - 1;

    const art = document.createElement("div");
    art.className = "art";

    const img = document.createElement("img");
    img.src = artwork.picture;
    img.alt = artwork.title;
    img.loading = "lazy";

    const content = document.createElement("div");
    content.className = "art-content";

    const title = document.createElement("h2");
    title.textContent = artwork.title;

    const description = document.createElement("div");
    description.className = "art-description";


const paragraphs = Array.isArray(artwork.description)
    ? artwork.description
    : [artwork.description || ""];

paragraphs.forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    description.appendChild(p);
});


    const creator = document.createElement("p");
    creator.className = "art-creator";
    creator.textContent = `creator: ${artwork.creator}`;

    content.append(title, description, creator);
    art.append(img, content);
    card.appendChild(art);

    return card;
}

// Hanya menyimpan kartu sekitar artwork aktif
function renderWindow(animate = false) {
    const start = Math.max(0, currentIndex - 1);
    const end = Math.min(artworks.length - 1, currentIndex + 2);

    cardStack.replaceChildren();

    for (let i = start; i <= end; i++) {
        const card = createCard(artworks[i]);
        cardStack.appendChild(card);
    }

    updateCards(animate);
}

// Mengatur posisi kartu
function updateCards(animate = true) {
    const cards = cardStack.querySelectorAll(".card");

    cards.forEach((card) => {
        const index = Number(card.dataset.index);
        const distance = index - currentIndex;

        card.style.transition = animate
            ? `transform ${ANIMATION_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${ANIMATION_DURATION}ms`
            : "none";

        card.classList.toggle("active", distance === 0);
        card.classList.toggle("next", distance === 1);

        card.style.zIndex = String(10 - Math.abs(distance));

        if (distance === 0) {
            card.style.transform = "translate3d(0, 0, 0)";
            card.style.opacity = "1";
        } else if (distance === 1) {
            card.style.transform = "translate3d(0, 99%, 0)";
            card.style.opacity = "1";
        } else if (distance < 0) {
            card.style.transform = "translate3d(0, -110%, 0)";
            card.style.opacity = "0";
        } else {
            card.style.transform = "translate3d(0, 110%, 0)";
            card.style.opacity = "0";
        }
    });

    counter.textContent =
        `${String(currentIndex + 1).padStart(2, "0")} / ${String(artworks.length).padStart(2, "0")}`;
}

// Pindah ke artwork berikutnya

function nextCard() {
    if (isMoving || artworks.length === 0) return;

    isMoving = true;

    const isLastCard = currentIndex >= artworks.length - 1;

    if (isLastCard) {
        // Tambahkan kartu pertama sementara di bawah kartu terakhir
        const firstCard = createCard(artworks[0]);
        firstCard.dataset.index = artworks.length;
        cardStack.appendChild(firstCard);

        firstCard.style.transition = "none";
        firstCard.style.transform = "translate3d(0, 110%, 0)";
        firstCard.style.opacity = "1";
        firstCard.style.zIndex = "20";

        // Paksa browser menerapkan posisi awal
        firstCard.offsetHeight;

        currentIndex++;

        updateCards(true);

        setTimeout(() => {
            currentIndex = 0;
            renderWindow(false);
            isMoving = false;
        }, ANIMATION_DURATION);

        return;
    }

    currentIndex++;
    updateCards(true);

    setTimeout(() => {
        renderWindow(false);
        isMoving = false;
    }, ANIMATION_DURATION);
}


// Kembali ke artwork sebelumnya
function previousCard() {
    if (isMoving || currentIndex <= 0) return;

    isMoving = true;
    currentIndex--;

    updateCards(true);

    setTimeout(() => {
        renderWindow(false);
        isMoving = false;
    }, ANIMATION_DURATION);
}

// Mouse: scroll
gallery.addEventListener("wheel", (event) => {
    event.preventDefault();

    if (event.deltaY > 0) {
        nextCard();
    } else if (event.deltaY < 0) {
        previousCard();
    }
}, { passive: false });

// Tablet: swipe
let touchStartY = 0;
let touchEndY = 0;

gallery.addEventListener("touchstart", (event) => {
    touchStartY = event.touches[0].clientY;
}, { passive: true });

gallery.addEventListener("touchend", (event) => {
    touchEndY = event.changedTouches[0].clientY;

    const distance = touchEndY - touchStartY;
    const SWIPE_THRESHOLD = 50;

    if (distance < -SWIPE_THRESHOLD) {
        nextCard();
    } else if (distance > SWIPE_THRESHOLD) {
        previousCard();
    }
}, { passive: true });

// Mengambil data JSON
async function loadArtworks() {
    try {
        const response = await fetch("./data.json");

        if (!response.ok) {
            throw new Error(`Gagal mengambil data: HTTP ${response.status}`);
        }

        artworks = await response.json();

        if (!Array.isArray(artworks) || artworks.length === 0) {
            throw new Error("Data artwork kosong atau formatnya salah.");
        }

        console.log("Jumlah artwork:", artworks.length);
        renderWindow(false);

    } catch (error) {
        console.error("Error:", error);
        counter.textContent = "Gagal memuat artwork";
    }
}

loadArtworks();
