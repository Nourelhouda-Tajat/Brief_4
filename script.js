
// fetch(`missions.json`)
//     .then (response => response.json())
//     .then( missions => {
       
      
//         console.log(missions)
        
//         missions.forEach(mission => {console.log(mission.name);});
        
//         const container= document.getElementById('mission_sec');
//         if ( missions.length === 0) {
//             container.innerHTML = `<p style="color:red;">Erreur : le fichier JSON est vide.</p>`;
//             console.error("Le fichier JSON est vide.");
//             return; 
//         }
        
//         missions.forEach(mission => {
             
//             const card = creatMissionCard(mission);
//             container.appendChild(card);

//         });

//         const allIcons = document.querySelectorAll('.favorite-icon');
//         allIcons.forEach(icon => Favorite(icon));

//     });
//     function creatMissionCard(mission){
//         const card = document.createElement('div');
//         card.classList.add('container_mission')
//         card.innerHTML = `
//             <img src="${mission.image}" class="mission_img">
//                 <div class="box_mission">
//                     <h2>${mission.name} - ${mission.agency}</h2>
//                     <p>${mission.objective}</p>
//                 </div>
//                 <div class="box1_mission">
//                     <img src="images/calendar.png" class="icone_mission">
//                     <span>${mission.launchDate}</span>
//                 </div>
//                 <i class="material-symbols-outlined favorite-icon">star_border</i>
//         `;
//         return card;
//     }
    
//     function Favorite(iconElement) {
//     iconElement.addEventListener('click', () => {
//         iconElement.classList.toggle('active'); 
        
//         if (iconElement.classList.contains('active')) {
//             iconElement.textContent = 'star';
//         } else {
//             iconElement.textContent = 'star_border';
//         }
//         });
//     }
//     function filtrer(missions){
//         missions.filter(mission => if (mission.agency === NSA) {
//             displayMission
//         } )


//     }

// ====== Missions.js : Affichage + Recherche + Filtres ======

let missions = []; // Tableau global pour stocker les missions
const container = document.getElementById("mission_sec");
const searchInput = document.querySelector(".barre_mission input");
const agencySelect = document.getElementById("agency");
const typeMissionSelect = document.getElementById("type_mission");
const yearSelect = document.getElementById("year");

// 1️⃣ Charger les missions depuis le fichier JSON
fetch("missions.json")
  .then((response) => response.json())
  .then((data) => {
    missions = data;
    displayMissions(missions); // affichage initial
  })
  .catch((err) => console.error("Erreur chargement missions.json :", err));

// 2️⃣ Fonction : créer une carte mission (retourne un élément HTML)
function createMissionCard(mission){
    const card = document.createElement('div');
    card.classList.add('container_mission');
    card.innerHTML = `
        <img src="${mission.image}" class="mission_img">
        <div class="box_mission">
            <h2>${mission.name} - ${mission.agency}</h2>
            <p>${mission.objective}</p>
        </div>
        <div class="box1_mission">
            <img src="images/calendar.png" class="icone_mission">
            <span>${mission.launchDate}</span>
        </div>
        <i class="material-symbols-outlined favorite-icon">star_border</i>
    `;
    
    // ✅ CORRECTION : Ajouter l'événement au favori
    const iconElement = card.querySelector('.favorite-icon');
    Favorite(iconElement);
    
    return card;
}

// ✅ CORRECTION : Votre fonction Favorite (elle marchait déjà !)
function Favorite(iconElement) {
    iconElement.addEventListener('click', () => {
        iconElement.classList.toggle('active'); 
        
        if (iconElement.classList.contains('active')) {
            iconElement.textContent = 'star';
        } else {
            iconElement.textContent = 'star_border';
        }
    });
}

// ❌ SUPPRIMÉ : fonction filtrer() cassée
// Elle contenait des erreurs de syntaxe

// 3️⃣ Fonction : afficher une liste de missions
function displayMissions(list) {
  container.innerHTML = "";
  if (list.length === 0) {
    container.innerHTML = "<p>Aucune mission trouvée.</p>";
    return;
  }
  list.forEach((mission) => container.appendChild(createMissionCard(mission)));
}

// 4️⃣ Filtres individuels
function filterMissionAgency(list, agencyValue) {
  if (agencyValue === "all_agency") return list;
  const selectedAgency = agencySelect.options[agencySelect.selectedIndex].text.toLowerCase();
  return list.filter((mission) => mission.agency.toLowerCase().includes(selectedAgency));
}

function filterMissionTypeMission(list, typeValue) {
  if (typeValue === "type") return list;
  const selectedType = typeMissionSelect.options[typeMissionSelect.selectedIndex].text.toLowerCase();
  return list.filter((mission) => mission.agency.toLowerCase().includes(selectedType));
}

function filterMissionYear(list, yearValue) {
  if (yearValue === "Year") return list;
  const selectedYear = yearSelect.options[yearSelect.selectedIndex].text;
  return list.filter((mission) => mission.launchDate.includes(selectedYear));
}

// 5️⃣ Recherche textuelle
function searchMission(list, searchText) {
  const lowerText = searchText.toLowerCase();
  return list.filter(
    (mission) =>
      mission.name.toLowerCase().includes(lowerText) ||
      mission.agency.toLowerCase().includes(lowerText) ||
      mission.objective.toLowerCase().includes(lowerText) ||
      mission.launchDate.includes(lowerText)
  );
}

// 6️⃣ Fonction globale : appliquer tous les filtres combinés
function applyAllFilters() {
  let result = [...missions];

  // Appliquer chaque filtre l'un après l'autre
  result = searchMission(result, searchInput.value);
  result = filterMissionAgency(result, agencySelect.value);
  result = filterMissionTypeMission(result, typeMissionSelect.value);
  result = filterMissionYear(result, yearSelect.value);

  displayMissions(result);
}

// 7️⃣ Écouteurs d'événements (mise à jour dynamique)
searchInput.addEventListener("input", applyAllFilters);
agencySelect.addEventListener("change", applyAllFilters);
typeMissionSelect.addEventListener("change", applyAllFilters);
yearSelect.addEventListener("change", applyAllFilters);
