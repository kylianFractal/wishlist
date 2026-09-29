const items = [
  {cat:"figurines", label:"Figurine", title:"Wuthering Waves", desc:"Phrolova, Yangyang, De Xuanling, Carlotta"},
  {cat:"figurines", label:"Figurine", title:"Genshin Impact", desc:"Columbina, Farina, Citlali, Arlecchino, Hu Tao"},
  {cat:"jeux", label:"Jeu", title:"Tide of Annihilation", desc:"Pas sortie"},
  {cat:"jeux", label:"Jeu", title:"Jurassic World Evolution 3", desc:""},
  {cat:"jeux", label:"Jeu", title:"The Isle", desc:""},
  {cat:"jeux", label:"Jeu", title:"Dragonsword", desc:""},
  {cat:"materiel", label:"Matériel", title:"Gant de tablette graphique", desc:""},
  {cat:"materiel", label:"Matériel", title:"SSD SATA 🙂", desc:""},
  {cat:"magic", label:"Magic / TCG", title:"Booster", desc:""},
  {cat:"magic", label:"Magic / TCG", title:"Dé", desc:""},
  {cat:"magic", label:"Magic / TCG", title:"Protège-carte", desc:""},
  {cat:"magic", label:"Magic / TCG", title:"Classeur", desc:""},
  {cat:"magic", label:"Magic / TCG", title:"Boîte", desc:""},
  {cat:"magic", label:"Magic / TCG", title:"TCG Wuthering Waves 🙂", desc:""}
];

const saved = JSON.parse(localStorage.getItem("wishlist-purchased") || "{}");
let filter = "all";
let query = "";

const grid = document.querySelector("#wishlist");
const empty = document.querySelector("#empty");

function render() {
  const filtered = items.filter(item => {
    const matchesFilter = filter === "all" || item.cat === filter;
    const text = `${item.title} ${item.desc} ${item.label}`.toLowerCase();
    return matchesFilter && text.includes(query.toLowerCase());
  });

  grid.innerHTML = filtered.map((item, index) => {
    const id = `${item.cat}-${item.title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const purchased = !!saved[id];
    return `
      <article class="card ${purchased ? "purchased" : ""}">
        <span class="badge">${item.label}</span>
        <div class="title">${item.title}</div>
        <div class="desc">${item.desc || "À ajouter à la liste."}</div>
        <button class="check" data-id="${id}" aria-label="Marquer comme acheté">
          ${purchased ? "✓ Acheté" : "À acheter"}
        </button>
      </article>
    `;
  }).join("");

  empty.hidden = filtered.length !== 0;
  updateStats();
}

function updateStats() {
  const done = items.filter(item => {
    const id = `${item.cat}-${item.title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return saved[id];
  }).length;
  document.querySelector("#total").textContent = items.length;
  document.querySelector("#done").textContent = done;
  document.querySelector("#left").textContent = items.length - done;
}

document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filter = btn.dataset.filter;
    render();
  });
});

document.querySelector("#search").addEventListener("input", e => {
  query = e.target.value;
  render();
});

grid.addEventListener("click", e => {
  const button = e.target.closest(".check");
  if (!button) return;
  const id = button.dataset.id;
  saved[id] = !saved[id];
  localStorage.setItem("wishlist-purchased", JSON.stringify(saved));
  render();
});

render();
