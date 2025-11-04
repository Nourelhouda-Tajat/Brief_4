// ====== Variables globales ======
let allMissions = []; // Stocke toutes les missions
let editingMissionId = null; // Pour savoir si on édite ou on ajoute

// ====== Chargement des missions ======
fetch("missions.json")
  .then((response) => response.json())
  .then((data) => {
    allMissions = data;
    displayMissions(allMissions);
    setupEventListeners();
  })
  .catch((err) => console.error("Erreur :", err));

// ====== Affichage des missions ======
function displayMissions(missions) {
  const container = document.getElementById("mission_sec");
  container.innerHTML = "";

  if (missions.length === 0) {
    container.innerHTML = '<p style="color:red;">Aucune mission trouvée.</p>';
    return;
  }

  missions.forEach((mission) => {
    const card = createMissionCard(mission);
    container.appendChild(card);
  });
}

// ====== Créer une carte mission ======
function createMissionCard(mission) {
  const card = document.createElement("div");
  card.classList.add("container_mission");

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
        <i class="material-symbols-outlined favorite-icon">star_border</i>
    `;

  // Ajouter le favori
  const icon = card.querySelector(".favorite-icon");
  Favorite(icon);

  // Icone edit
  const editIcon = card.querySelector(".edit-icon");
  editIcon.addEventListener("click", () => {
    const missionId = editIcon.getAttribute("data-id");
    openEditModal(missionId);
  });

  // Icone suppression
  const deleteIcon = card.querySelector(".delete-icon");
  deleteIcon.addEventListener("click", () => {
    const missionId = deleteIcon.getAttribute("data-id");
    deleteMission(missionId);
  });

  return card;
}

// ====== Fonction favori ======
function Favorite(iconElement) {
  iconElement.addEventListener("click", () => {
    iconElement.classList.toggle("active");

    if (iconElement.classList.contains("active")) {
      iconElement.textContent = "star";
    } else {
      iconElement.textContent = "star_border";
    }
  });
}

// ====== Fonction de RECHERCHE ======
function searchMissions(missions) {
  const searchInput = document.querySelector(".barre_mission input");
  const searchText = searchInput.value.toLowerCase();

  if (searchText === "") {
    return missions;
  }

  return missions.filter((mission) => {
    return (
      mission.name.toLowerCase().includes(searchText) ||
      mission.agency.toLowerCase().includes(searchText) ||
      mission.objective.toLowerCase().includes(searchText) ||
      mission.launchDate.includes(searchText)
    );
  });
}

// ====== Fonction de FILTRAGE ======
function filterMissions(missions) {
  const agencySelect = document.getElementById("agency");
  const typeSelect = document.getElementById("type_mission");
  const yearSelect = document.getElementById("year");

  const agencyValue = agencySelect.value;
  const typeValue = typeSelect.value;
  const yearValue = yearSelect.value;

  if (agencyValue !== "" && agencyValue !== "all_agency") {
    const selectedAgencyText =
      agencySelect.options[agencySelect.selectedIndex].text;
    missions = missions.filter((mission) =>
      mission.agency.includes(selectedAgencyText)
    );
  }

  if (typeValue !== "" && typeValue !== "type") {
    const selectedTypeText = typeSelect.options[typeSelect.selectedIndex].text;
    missions = missions.filter((mission) => mission.type === selectedTypeText);
  }

  if (yearValue !== "" && yearValue !== "Year") {
    const selectedYearText = yearSelect.options[yearSelect.selectedIndex].text;
    missions = missions.filter((mission) =>
      mission.launchDate.includes(selectedYearText)
    );
  }

  return missions;
}

// ====== Appliquer recherche ET filtrage ======
function applySearchAndFilters() {
  let result = searchMissions(allMissions);
  result = filterMissions(result);
  displayMissions(result);
}

// ====== FONCTION POUR OUVRIR LE MODAL (AJOUT) ======
function openModal() {
  editingMissionId = null; // Mode ajout
  const modal = document.getElementById("modal_add");
  const modalTitle = modal.querySelector("h2");
  const submitBtn = modal.querySelector(".btn_submit");

  // Changer le titre et le bouton
  modalTitle.textContent = "Add New Mission";
  submitBtn.textContent = "Add Mission";

  // Vider le formulaire
  document.getElementById("form_add_mission").reset();

  // Afficher le modal
  modal.style.display = "block";
}

// ====== NOUVELLE FONCTION : OUVRIR LE MODAL (ÉDITION) ======
function openEditModal(missionId) {
  editingMissionId = missionId; // Mode édition

  // Trouver la mission à éditer
  const mission = allMissions.find((m) => m.id == missionId);

  if (!mission) {
    alert("Mission non trouvée !");
    return;
  }

  // Remplir le formulaire avec les données existantes
  document.getElementById("mission_name").value = mission.name;
  document.getElementById("mission_agency").value = mission.agency;
  document.getElementById("mission_type").value = mission.type;
  document.getElementById("mission_date").value = mission.launchDate;
  document.getElementById("mission_objective").value = mission.objective;
  document.getElementById("mission_image").value = mission.image;

  // Changer le titre et le bouton
  const modal = document.getElementById("modal_add");
  const modalTitle = modal.querySelector("h2");
  const submitBtn = modal.querySelector(".btn_submit");

  modalTitle.textContent = "Edit Mission";
  submitBtn.textContent = "Update Mission";

  // Afficher le modal
  modal.style.display = "block";
}

// ====== FONCTION POUR FERMER LE MODAL ======
function closeModal() {
  const modal = document.getElementById("modal_add");
  modal.style.display = "none";
  document.getElementById("form_add_mission").reset();
  editingMissionId = null; // Réinitialiser
}

// ====== FONCTION POUR AJOUTER OU MODIFIER UNE MISSION ======
function saveMission(event) {
  event.preventDefault();

  // Récupérer les valeurs du formulaire
  const name = document.getElementById("mission_name").value;
  const agency = document.getElementById("mission_agency").value;
  const type = document.getElementById("mission_type").value;
  const launchDate = document.getElementById("mission_date").value;
  const objective = document.getElementById("mission_objective").value;
  const image = document.getElementById("mission_image").value;

  // Vérifier si on est en mode ÉDITION ou AJOUT
  if (editingMissionId !== null) {
    // MODE ÉDITION : Modifier la mission existante
    const missionIndex = allMissions.findIndex((m) => m.id == editingMissionId);

    if (missionIndex !== -1) {
      allMissions[missionIndex].name = name;
      allMissions[missionIndex].agency = agency;
      allMissions[missionIndex].type = type;
      allMissions[missionIndex].launchDate = launchDate;
      allMissions[missionIndex].objective = objective;
      allMissions[missionIndex].image = image;

      alert("✅ Mission modifiée avec succès !");
    }
  } else {
    // MODE AJOUT : Créer une nouvelle mission
    const newMission = {
      id: Date.now(), // Générer un ID unique
      name: name,
      agency: agency,
      type: type,
      launchDate: launchDate,
      objective: objective,
      image: image,
    };

    allMissions.unshift(newMission);
    alert("✅ Mission ajoutée avec succès !");
  }

  // Rafraîchir l'affichage
  displayMissions(allMissions);

  // Fermer le modal
  closeModal();
}

// ====== FONCTION SUPPRESSION (À COMPLÉTER PLUS TARD) ======
function deleteMission(missionId) {
   const mission = allMissions.find((m) => m.id == missionId);

   if (!mission) {
     alert("❌ Mission non trouvée !");
     return;
   }

   // 2. Demander confirmation avec le nom de la mission
   const confirmation = confirm(
     `⚠️ Êtes-vous sûr de vouloir supprimer la mission "${mission.name}" ?\n\nCette action est irréversible.`
   );

   // 3. Si l'utilisateur clique sur "Annuler", on arrête
   if (!confirmation) {
     return;
   }

   // 4. Supprimer la mission du tableau
   const missionIndex = allMissions.findIndex((m) => m.id == missionId);
   allMissions.splice(missionIndex, 1);

   // 5. Rafraîchir l'affichage
   displayMissions(allMissions);

   // 6. Message de confirmation
   alert("✅ Mission supprimée avec succès !");
}

// ====== ÉCOUTER LES ÉVÉNEMENTS DU MODAL ======
function setupModalListeners() {
  // Bouton "Ajouter"
  const btnAdd = document.getElementById("btn_add_mission");
  btnAdd.addEventListener("click", openModal);

  // Bouton "X" pour fermer
  const closeBtn = document.querySelector(".close");
  closeBtn.addEventListener("click", closeModal);

  // Cliquer en dehors du modal pour fermer
  const modal = document.getElementById("modal_add");
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Soumettre le formulaire
  const form = document.getElementById("form_add_mission");
  form.addEventListener("submit", saveMission);
}

// ====== Écouter les changements ======
function setupEventListeners() {
  const searchInput = document.querySelector(".barre_mission input");
  const agencySelect = document.getElementById("agency");
  const typeSelect = document.getElementById("type_mission");
  const yearSelect = document.getElementById("year");

  searchInput.addEventListener("input", applySearchAndFilters);
  agencySelect.addEventListener("change", applySearchAndFilters);
  typeSelect.addEventListener("change", applySearchAndFilters);
  yearSelect.addEventListener("change", applySearchAndFilters);

  setupModalListeners();
}
