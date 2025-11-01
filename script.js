
fetch(`missions.json`)
    .then (response => response.json())
    .then( missions => {
       
      
        console.log(missions)
        
        missions.forEach(mission => {console.log(mission.name);});
        
        const container= document.getElementById('mission_sec');
        if ( missions.length === 0) {
            container.innerHTML = `<p style="color:red;">Erreur : le fichier JSON est vide.</p>`;
            console.error("Le fichier JSON est vide.");
            return; 
        }
        
        missions.forEach(mission => {
             
            const card = creatMissionCard(mission);
            container.appendChild(card);

        });

        const allIcons = document.querySelectorAll('.favorite-icon');
        allIcons.forEach(icon => Favorite(icon));

    });
    function creatMissionCard(mission){
        const card = document.createElement('div');
        card.classList.add('container_mission')
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
        return card;
    }
    
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