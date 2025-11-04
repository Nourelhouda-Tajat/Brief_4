
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

// ====== Variables globales ======
let allMissions = []; // Stocke toutes les missions

// ====== Chargement des missions ======
fetch('missions.json')
    .then(response => response.json())
    .then(data => {
        allMissions = data;
        displayMissions(allMissions);
        setupEventListeners();
    })
    .catch(err => console.error('Erreur :', err));

// ====== Affichage des missions ======
function displayMissions(missions) {
    const container = document.getElementById('mission_sec');
    container.innerHTML = '';
    
    if (missions.length === 0) {
        container.innerHTML = '<p style="color:red;">Aucune mission trouvée.</p>';
        return;
    }
    
    missions.forEach(mission => {
        const card = createMissionCard(mission);
        container.appendChild(card);
    });
}

// ====== Créer une carte mission ======
function createMissionCard(mission) {
    const card = document.createElement('div');
    card.classList.add('container_mission');
    
    card.innerHTML = `
        <img src="${mission.image}" class="mission_img">
        <div class="box_mission">
            <h2>${mission.name} - ${mission.agency}</h2>
            <p>${mission.objective}</p>
            <i class="material-symbols-outlined edit-icon">edit</i>
            <i class="material-symbols-outlined delete-icon">delete</i>

        </div>
        <div class="box1_mission">
            <img src="images/calendar.png" class="icone_mission">
            <span>${mission.launchDate}</span>
        </div>
        <i class="material-symbols-outlined favorite-icon">star_border</i>
        
    `;
    
    // Ajouter le favori
    const icon = card.querySelector('.favorite-icon');
    Favorite(icon);
    //icone edit
    const editIcon = card.querySelector('.edit-icon');
    editIcon.addEventListener('click', () => editMission(mission.id));
    
    // icone suppression
    const deleteIcon = card.querySelector('.delete-icon');
    deleteIcon.addEventListener('click', () => deleteMission(mission.id));
    
    return card;
}

// ====== Fonction favori ======
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

// ====== Fonction de RECHERCHE ======
function searchMissions(missions) {
    const searchInput = document.querySelector('.barre_mission input');
    const searchText = searchInput.value.toLowerCase();
    
    // Si la barre de recherche est vide, retourner toutes les missions
    if (searchText === '') {
        return missions;
    }
    
    // Sinon, rechercher dans les missions
    return missions.filter(mission => {
        return mission.name.toLowerCase().includes(searchText) ||
               mission.agency.toLowerCase().includes(searchText) ||
               mission.objective.toLowerCase().includes(searchText) ||
               mission.launchDate.includes(searchText);
    });
}

// ====== Fonction de FILTRAGE (CORRIGÉE avec includes) ======
function filterMissions(missions) {
    const agencySelect = document.getElementById('agency');
    const typeSelect = document.getElementById('type_mission');
    const yearSelect = document.getElementById('year');
    
    const agencyValue = agencySelect.value;
    const typeValue = typeSelect.value;
    const yearValue = yearSelect.value;
    
    // Filtrer par agence (utilise includes pour trouver NASA dans "NASA/ESA/CSA")
    if (agencyValue !== '' && agencyValue !== 'all_agency') {
        const selectedAgencyText = agencySelect.options[agencySelect.selectedIndex].text;
        missions = missions.filter(mission => mission.agency.includes(selectedAgencyText));
    }
    
    // Filtrer par type
    if (typeValue !== '' && typeValue !== 'type') {
        const selectedTypeText = typeSelect.options[typeSelect.selectedIndex].text;
        missions = missions.filter(mission => mission.type === selectedTypeText);
    }
    
    // Filtrer par année
    if (yearValue !== '' && yearValue !== 'Year') {
        const selectedYearText = yearSelect.options[yearSelect.selectedIndex].text;
        missions = missions.filter(mission => mission.launchDate.includes(selectedYearText));
    }
    
    return missions;
}

// ====== Appliquer recherche ET filtrage ======
function applySearchAndFilters() {
    // 1. D'abord on recherche
    let result = searchMissions(allMissions);
    
    // 2. Ensuite on filtre
    result = filterMissions(result);
    
    // 3. On affiche le résultat
    displayMissions(result);
}

// ====== Écouter les changements ======
function setupEventListeners() {
    const searchInput = document.querySelector('.barre_mission input');
    const agencySelect = document.getElementById('agency');
    const typeSelect = document.getElementById('type_mission');
    const yearSelect = document.getElementById('year');
    
    searchInput.addEventListener('input', applySearchAndFilters);
    agencySelect.addEventListener('change', applySearchAndFilters);
    typeSelect.addEventListener('change', applySearchAndFilters);
    yearSelect.addEventListener('change', applySearchAndFilters);
}
// ====== FONCTION POUR OUVRIR LE MODAL ======
function openModal() {
    const modal = document.getElementById('modal_add');
    modal.style.display = 'block';
}

// ====== FONCTION POUR FERMER LE MODAL ======
function closeModal() {
    const modal = document.getElementById('modal_add');
    modal.style.display = 'none';
    document.getElementById('form_add_mission').reset();
}

// ====== FONCTION POUR AJOUTER UNE MISSION ======
function addNewMission(event) {
    event.preventDefault(); // Empêche le rechargement de la page
    
    // Récupérer les valeurs du formulaire
    const name = document.getElementById('mission_name').value;
    const agency = document.getElementById('mission_agency').value;
    const type = document.getElementById('mission_type').value;
    const launchDate = document.getElementById('mission_date').value;
    const objective = document.getElementById('mission_objective').value;
    const image = document.getElementById('mission_image').value;
    
    // Créer un objet mission
    const newMission = {
        name: name,
        agency: agency,
        type: type,
        launchDate: launchDate,
        objective: objective,
        image: image
    };
    
    // Ajouter la nouvelle mission au début du tableau
    allMissions.unshift(newMission);
    
    // Rafraîchir l'affichage
    displayMissions(allMissions);
    
    // Fermer le modal
    closeModal();
    
    // Message de confirmation
    alert('Mission ajoutée avec succès !');
}

// ====== ÉCOUTER LES ÉVÉNEMENTS DU MODAL ======
function setupModalListeners() {
    // Bouton "Ajouter"
    const btnAdd = document.getElementById('btn_add_mission');
    btnAdd.addEventListener('click', openModal);
    
    // Bouton "X" pour fermer
    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', closeModal);
    
    // Cliquer en dehors du modal pour fermer
    const modal = document.getElementById('modal_add');
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Soumettre le formulaire
    const form = document.getElementById('form_add_mission');
    form.addEventListener('submit', addNewMission);
}

// ====== MODIFIER LA FONCTION setupEventListeners ======
// Remplacez votre fonction setupEventListeners existante par celle-ci :
function setupEventListeners() {
    const searchInput = document.querySelector('.barre_mission input');
    const agencySelect = document.getElementById('agency');
    const typeSelect = document.getElementById('type_mission');
    const yearSelect = document.getElementById('year');
    
    searchInput.addEventListener('input', applySearchAndFilters);
    agencySelect.addEventListener('change', applySearchAndFilters);
    typeSelect.addEventListener('change', applySearchAndFilters);
    yearSelect.addEventListener('change', applySearchAndFilters);
    
    // AJOUTER CETTE LIGNE
    setupModalListeners();
}