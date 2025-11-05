// ====== Variables globales ======
let allMissions = []; // Toutes les missions
let favoriteMissions = []; // IDs des missions favorites

// ====== Chargement initial ======
fetch("missions.json")
  .then((response) => response.json())
  .then((data) => {
    allMissions = data;
    loadFavorites(); // Charger les favoris sauvegardés
    displayMissions(allMissions);
    setupEventListeners();
  })
  .catch((err) => console.error("Erreur :", err));

// ====== GESTION DES FAVORIS ======

// Charger les favoris depuis localStorage
function loadFavorites() {
  const saved = localStorage.getItem("favoriteMissions");
  if (saved) {
    favoriteMissions = JSON.parse(saved);
  }
}

// Sauvegarder les favoris dans localStorage
function saveFavorites() {
  localStorage.setItem("favoriteMissions", JSON.stringify(favoriteMissions));
}

// Vérifier si une mission est favorite
function isFavorite(missionId) {
  return favoriteMissions.includes(Number(missionId));
}

// Ajouter ou retirer une mission des favoris
function toggleFavorite(missionId) {
  const id = Number(missionId);
  const index = favoriteMissions.indexOf(id);

  if (index === -1) {
    // Ajouter aux favoris
    favoriteMissions.push(id);
    console.log("✅ Mission ajoutée aux favoris:", id);
  } else {
    // Retirer des favoris
    favoriteMissions.splice(index, 1);
    console.log("❌ Mission retirée des favoris:", id);
  }

  saveFavorites();

  // Rafraîchir l'affichage principal
  applySearchAndFilters();

  // Rafraîchir le menu latéral s'il est ouvert
  if (
    document.getElementById("favorites-sidebar").classList.contains("active")
  ) {
    updateFavoritesSidebar();
  }
}

// ====== MENU LATÉRAL FAVORIS ======

// Ouvrir le menu latéral
function openFavoritesSidebar() {
  document.getElementById("favorites-overlay").classList.add("active");
  document.getElementById("favorites-sidebar").classList.add("active");
  document.getElementById("btn_show_favorites").classList.add("active");
  updateFavoritesSidebar();
  document.body.style.overflow = "hidden"; // Bloquer le scroll
}

// Fermer le menu latéral
function closeFavoritesSidebar() {
  document.getElementById("favorites-overlay").classList.remove("active");
  document.getElementById("favorites-sidebar").classList.remove("active");
  document.getElementById("btn_show_favorites").classList.remove("active");
  document.body.style.overflow = "auto"; // Réactiver le scroll
}

// Mettre à jour le contenu du menu latéral
function updateFavoritesSidebar() {
  const favoritesList = document.getElementById("favorites-list");
  const favoritesCount = document.getElementById("favorites-count");

  // Récupérer les missions favorites
  const favorites = allMissions.filter((mission) => isFavorite(mission.id));

  // Mettre à jour le compteur
  const count = favorites.length;
  favoritesCount.textContent =
    count === 0
      ? "No favorite mission"
      : count === 1
      ? "1 favorite mission"
      : `${count} favorite missions`;

  // Vider la liste
  favoritesList.innerHTML = "";

  // Si aucun favori
  if (favorites.length === 0) {
    favoritesList.innerHTML = `
      <div class="favorites-empty">
        <span class="material-symbols-outlined">star_border</span>
        <h3>No favorites yet</h3>
        <p>Click on the star icon on any mission to add it to your favorites</p>
      </div>
    `;
    return;
  }

  // Afficher les favoris
  favorites.forEach((mission) => {
    const card = createFavoriteCard(mission);
    favoritesList.appendChild(card);
  });
}

// Créer une carte favorite pour le menu latéral
function createFavoriteCard(mission) {
  const card = document.createElement("div");
  card.classList.add("favorite-card");

  card.innerHTML = `
    <div class="favorite-card-header">
      <img src="${mission.image}" alt="${mission.name}" class="favorite-card-img">
      <div class="favorite-card-info">
        <h3>${mission.name}</h3>
        <p>${mission.agency}</p>
      </div>
    </div>
    <div class="favorite-card-body">
      ${mission.objective}
    </div>
    <div class="favorite-card-footer">
      <div class="favorite-card-date">
        <img src="images/calendar.png" alt="date">
        <span>${mission.launchDate}</span>
      </div>
      <button class="remove-favorite" data-id="${mission.id}">Remove</button>
    </div>
  `;

  // Bouton pour retirer des favoris
  const removeBtn = card.querySelector(".remove-favorite");
  removeBtn.addEventListener("click", () => {
    toggleFavorite(mission.id);
  });

  return card;
}

// ====== AFFICHAGE DES MISSIONS ======

// Afficher les missions
function displayMissions(missions) {
  const container = document.getElementById("mission_sec");
  container.innerHTML = "";

  if (missions.length === 0) {
    container.innerHTML =
      '<p style="color:red; text-align:center; font-size:18px;">No mission found.</p>';
    return;
  }

  missions.forEach((mission) => {
    const card = createMissionCard(mission);
    container.appendChild(card);
  });
}

// Créer une carte mission
function createMissionCard(mission) {
  const card = document.createElement("div");
  card.classList.add("container_mission");

  // Déterminer l'icône et la classe pour les favoris
  const isFav = isFavorite(mission.id);
  const starIcon = isFav ? "star" : "star_border";
  const activeClass = isFav ? "active" : "";

  card.innerHTML = `
    <img src="${mission.image}" class="mission_img">
    <div class="box_mission">
      <h2>${mission.name} - ${mission.agency}</h2>
      <p>${mission.objective}</p>
      <div class="action_buttons">
        <i class="material-symbols-outlined edit-icon" data-id="${mission.id}">edit</i>
        <i class="material-symbols-outlined delete-icon" data-id="${mission.id}">delete</i>
      </div>
    </div>
    <div class="box1_mission">
      <img src="images/calendar.png" class="icone_mission">
      <span>${mission.launchDate}</span>
    </div>
    <i class="material-symbols-outlined favorite-icon ${activeClass}" data-id="${mission.id}">${starIcon}</i>
  `;

  // Événements
  card
    .querySelector(".favorite-icon")
    .addEventListener("click", () => toggleFavorite(mission.id));
  card
    .querySelector(".edit-icon")
    .addEventListener("click", () => openEditModal(mission.id));
  card
    .querySelector(".delete-icon")
    .addEventListener("click", () => deleteMission(mission.id));

  return card;
}

// ====== RECHERCHE ET FILTRAGE ======

// Recherche
function searchMissions(missions) {
  const searchText = document
    .querySelector(".barre_mission input")
    .value.toLowerCase();

  if (searchText === "") return missions;

  return missions.filter((mission) => {
    return (
      mission.name.toLowerCase().includes(searchText) ||
      mission.agency.toLowerCase().includes(searchText) ||
      mission.objective.toLowerCase().includes(searchText) ||
      mission.launchDate.includes(searchText)
    );
  });
}

// Filtrage
function filterMissions(missions) {
  const agencyValue = document.getElementById("agency").value;
  const typeValue = document.getElementById("type_mission").value;
  const yearValue = document.getElementById("year").value;

  // Filtre agence
  if (agencyValue !== "" && agencyValue !== "all_agency") {
    const agencyText =
      document.getElementById("agency").options[
        document.getElementById("agency").selectedIndex
      ].text;
    missions = missions.filter((m) => m.agency.includes(agencyText));
  }

  // Filtre type
  if (typeValue !== "" && typeValue !== "type") {
    const typeText =
      document.getElementById("type_mission").options[
        document.getElementById("type_mission").selectedIndex
      ].text;
    missions = missions.filter((m) => m.type === typeText);
  }

  // Filtre année
  if (yearValue !== "" && yearValue !== "Year") {
    const yearText =
      document.getElementById("year").options[
        document.getElementById("year").selectedIndex
      ].text;
    missions = missions.filter((m) => m.launchDate.includes(yearText));
  }

  return missions;
}

// Appliquer recherche + filtres
function applySearchAndFilters() {
  let result = searchMissions(allMissions);
  result = filterMissions(result);
  displayMissions(result);
}

// ====== MODAL AJOUT/ÉDITION ======

let editingMissionId = null;

// Ouvrir modal en mode ajout
function openModal() {
  editingMissionId = null;
  document.querySelector("#modal_add h2").textContent = "Add New Mission";
  document.querySelector(".btn_submit").textContent = "Add Mission";
  document.getElementById("form_add_mission").reset();
  document.getElementById("modal_add").style.display = "block";
}

// Ouvrir modal en mode édition
function openEditModal(missionId) {
  editingMissionId = missionId;
  const mission = allMissions.find((m) => m.id == missionId);

  if (!mission) {
    alert("Mission not found");
    return;
  }

  document.getElementById("mission_name").value = mission.name;
  document.getElementById("mission_agency").value = mission.agency;
  document.getElementById("mission_type").value = mission.type;
  document.getElementById("mission_date").value = mission.launchDate;
  document.getElementById("mission_objective").value = mission.objective;
  document.getElementById("mission_image").value = mission.image;

  document.querySelector("#modal_add h2").textContent = "Edit Mission";
  document.querySelector(".btn_submit").textContent = "Update Mission";
  document.getElementById("modal_add").style.display = "block";
}

// Fermer modal
function closeModal() {
  document.getElementById("modal_add").style.display = "none";
  document.getElementById("form_add_mission").reset();
  editingMissionId = null;
}

// Sauvegarder mission (ajout ou édition)
function saveMission(event) {
  event.preventDefault();

  const name = document.getElementById("mission_name").value;
  const agency = document.getElementById("mission_agency").value;
  const type = document.getElementById("mission_type").value;
  const launchDate = document.getElementById("mission_date").value;
  const objective = document.getElementById("mission_objective").value;
  const image = document.getElementById("mission_image").value;

  if (editingMissionId !== null) {
    // Mode édition
    const mission = allMissions.find((m) => m.id == editingMissionId);
    mission.name = name;
    mission.agency = agency;
    mission.type = type;
    mission.launchDate = launchDate;
    mission.objective = objective;
    mission.image = image;  
    alert("Mission modified successfully");
  } else {
    // Mode ajout
    const newMission = {
      id: Date.now(),
      name,
      agency,
      type,
      launchDate,
      objective,
      image,
    };
    allMissions.unshift(newMission);
    alert("Mission added successfully");
  }

  applySearchAndFilters();
  closeModal();
}

// ====== SUPPRESSION ======

function deleteMission(missionId) {
  const mission = allMissions.find((m) => m.id == missionId);

  if (!mission) {
    alert("Mission not found!");
    return;
  }

  if (!confirm(`Delete "${mission.name}"?\n\nThis action is irreversible.`)) {
    return;
  }

  // Supprimer la mission
  const index = allMissions.findIndex((m) => m.id == missionId);
  allMissions.splice(index, 1);

  // Retirer des favoris si présent
  const favIndex = favoriteMissions.indexOf(Number(missionId));
  if (favIndex !== -1) {
    favoriteMissions.splice(favIndex, 1);
    saveFavorites();
  }

  applySearchAndFilters();

  // Mettre à jour le menu latéral
  if (
    document.getElementById("favorites-sidebar").classList.contains("active")
  ) {
    updateFavoritesSidebar();
  }

  alert("Mission deleted successfully");
}

// ====== ÉVÉNEMENTS ======

function setupEventListeners() {
  // Recherche et filtres
  document
    .querySelector(".barre_mission input")
    .addEventListener("input", applySearchAndFilters);
  document
    .getElementById("agency")
    .addEventListener("change", applySearchAndFilters);
  document
    .getElementById("type_mission")
    .addEventListener("change", applySearchAndFilters);
  document
    .getElementById("year")
    .addEventListener("change", applySearchAndFilters);

  // Modal
  document
    .getElementById("btn_add_mission")
    .addEventListener("click", openModal);
  document.querySelector(".close").addEventListener("click", closeModal);
  document
    .getElementById("form_add_mission")
    .addEventListener("submit", saveMission);

  window.addEventListener("click", (e) => {
    if (e.target === document.getElementById("modal_add")) {
      closeModal();
    }
  });

  // Bouton favoris dans le header (ouvrir le menu latéral)
  document
    .getElementById("btn_show_favorites")
    .addEventListener("click", openFavoritesSidebar);

  // Fermer le menu latéral
  document
    .getElementById("close-favorites")
    .addEventListener("click", closeFavoritesSidebar);
  document
    .getElementById("favorites-overlay")
    .addEventListener("click", closeFavoritesSidebar);
}