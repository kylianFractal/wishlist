const items = [
  // Figurines — priorité : 1 = la plus voulue
  {
    cat: "figurines",
    label: "Figurine • Priorité 1",
    title: "Yangyang xuanling",
    desc: "Wuthering Waves",
    priority: 1
  },
  {
    cat: "figurines",
    label: "Figurine • Priorité 2",
    title: "Phrolova",
    desc: "Wuthering Waves",
    priority: 2
  },

  {
    cat: "figurines",
    label: "Figurine • Priorité 3",
    title: "Columbina",
    desc: "Genshin Impact",
    priority: 4
  },
  {
    cat: "figurines",
    label: "Figurine • Priorité 4",
    title: "Furina",
    desc: "Genshin Impact",
    priority: 5
  },
  {
    cat: "figurines",
    label: "Figurine • Priorité 5",
    title: "Citlali",
    desc: "Genshin Impact",
    priority: 6
  },

  // Jeux
  {
    cat: "jeux",
    label: "Jeu",
    title: "Tides of Annihilation",
    desc: "Steam",
    link: "https://store.steampowered.com/app/3292470/Tides_of_Annihilation/"
  },
  {
    cat: "jeux",
    label: "Jeu",
    title: "The Isle",
    desc: "Steam",
    link: "https://store.steampowered.com/app/376210/The_Isle/"
  },
  {
    cat: "jeux",
    label: "Jeu",
    title: "Jurassic World Evolution 3",
    desc: "Steam",
    link: "https://store.steampowered.com/app/2958130/Jurassic_World_Evolution_3/"
  },
  {
    cat: "jeux",
    label: "Jeu",
    title: "DragonSword: Awakening",
    desc: "Steam",
    link: "https://store.steampowered.com/app/4570720/DragonSword__Awakening/"
  },

  // Matériel
  {
    cat: "materiel",
    label: "Matériel",
    title: "Gant de tablette graphique",
    desc: "À chercher sur Amazon.fr",
    link: "https://www.amazon.fr/"
  },
  {
    cat: "materiel",
    label: "Matériel",
    title: "SSD SATA ",
    desc: "À chercher sur Amazon.fr",
    link: "https://www.amazon.fr/"
  },

  // Magic / MTG
  {
    cat: "magic",
    label: "Magic / MTG",
    title: "Booster",
    desc: "À chercher sur Amazon.fr ou Logigames",
    links: [
      { label: "Amazon.fr", url: "https://www.amazon.fr/" },
      { label: "Logigames", url: "https://logigames.fr/" }
    ]
  },
  {
    cat: "magic",
    label: "Magic / MTG",
    title: "Dé",
    desc: "Dé 20, +1/+1 et -1/-1",
    links: [
      { label: "Amazon.fr", url: "https://www.amazon.fr/" },
      { label: "Logigames", url: "https://logigames.fr/" }
    ]
  },
  {
    cat: "magic",
    label: "Magic / MTG",
    title: "Protège-carte",
    desc: "Format American Size — taille des cartes Magic: The Gathering / Pokémon",
    links: [
      { label: "Amazon.fr", url: "https://www.amazon.fr/" },
      { label: "Logigames", url: "https://logigames.fr/" }
    ]
  },
  {
    cat: "magic",
    label: "Magic / MTG",
    title: "Classeur",
    desc: "Pour cartes Magic / TCG",
    links: [
      { label: "Amazon.fr", url: "https://www.amazon.fr/" },
      { label: "Logigames", url: "https://logigames.fr/" }
    ]
  },
  {
    cat: "magic",
    label: "Magic / MTG",
    title: "Deckbox",
    desc: "Boîte de rangement pour deck Magic: The Gathering",
    links: [
      { label: "Amazon.fr", url: "https://www.amazon.fr/" },
      { label: "Logigames", url: "https://logigames.fr/" }
    ]
  },
  {
    cat: "magic",
    label: "Magic / MTG",
    title: "TCG Wuthering Waves ",
    desc: "À chercher au prix le plus bas sur AliExpress",
    link: "https://www.aliexpress.com/"
  }
];

const saved = JSON.parse(localStorage.getItem("wishlist-purchased") || "{}");
let filter = "all";
let query = "";

const grid = document.querySelector("#wishlist");
const empty = document.querySelector("#empty");

function getId(item) {
  return `${item.cat}-${item.title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function render() {
  const filtered = items
    .filter(item => {
      const matchesFilter = filter === "all" || item.cat === filter;
      const linksText = item.links ? item.links.map(link => link.label).join(" ") : "";
      const text = `${item.title} ${item.desc} ${item.label} ${linksText}`.toLowerCase();
      return matchesFilter && text.includes(query.toLowerCase());
    })
    .sort((a, b) => {
      if (a.cat === "figurines" && b.cat === "figurines") {
        return (a.priority || 999) - (b.priority || 999);
      }
      return 0;
    });

  grid.innerHTML = filtered.map(item => {
    const id = getId(item);
    const purchased = !!saved[id];

    const links = item.links
      ? item.links.map(link =>
          `<a class="link-btn" href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label} ↗</a>`
        ).join("")
      : item.link
        ? `<a class="link-btn" href="${item.link}" target="_blank" rel="noopener noreferrer">Voir le site ↗</a>`
        : "";

    return `
      <article class="card ${purchased ? "purchased" : ""}">
        <span class="badge">${item.label}</span>
        <div class="title">${item.title}</div>
        <div class="desc">${item.desc || "À ajouter à la liste."}</div>
        ${links ? `<div class="links">${links}</div>` : ""}
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
    const id = getId(item);
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
