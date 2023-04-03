

 //token verification pour
const token = localStorage.getItem("token");
const element = document.querySelector("#logg");
const adminPanel = document.querySelector("#paanel");
const modFirst = document.querySelector("#mod-first");
const contMod = document.querySelector(".containModif");
const dispFiltres = document.querySelector("#filters");
if (localStorage.getItem("token")) {
  element.innerHTML ="disconnect"
  adminPanel.style.display = "flex"
  modFirst.style.display = "flex"
  contMod.style.display = "block"
  dispFiltres.style.display = "none"}

  element.addEventListener("click", function() {
    localStorage.removeItem("token");
    element.innerHTML = "login";
    location.reload();
  });


 //AFFICHER LES WORKS HOMEPAGE
  
  fetch("http://localhost:5678/api/works")
  .then( data => data.json())
  .then( jsonListArticle => {
      for(let jsonArticle of jsonListArticle){
          let article = new Article(jsonArticle);
          document.querySelector(".gallery").innerHTML += 
          `<figure>
          <div><img crossorigin="anonymous" src="${article.imageUrl}"</div>
          <div><h5>${article.title}</h5></div>
          </figure>`
      }
  }); 

  // AFFICHER LES WORKS DANS LA MODALE

  fetch("http://localhost:5678/api/works")
  .then(data => data.json())
  .then(jsonListArticle => {
    for (let jsonArticle of jsonListArticle) {
      let article = new modifArticle(jsonArticle);

      // Créer les éléments de la figure
      let figure = document.createElement("figure");
      let workImageDiv = document.createElement("div");
      let workImage = document.createElement("img");
      let workActionsDiv = document.createElement("div");
      let editLink = document.createElement("a");
      let deleteImage = document.createElement("img");

      // Ajouter les classes pour le style
      figure.classList.add("work");
      workImageDiv.classList.add("work-image");
      workActionsDiv.classList.add("work-actions");
      editLink.classList.add("edit-link");
      deleteImage.classList.add("delete-image");

      // Configurer les éléments
      workImage.setAttribute("crossorigin", "anonymous");
      workImage.setAttribute("src", article.imageUrl);
      workImageDiv.appendChild(workImage);

      editLink.textContent = "Editer";
      editLink.setAttribute("href", "#");
      editLink.setAttribute("style", "text-decoration:none;color:black;font-size:12px;margin-left:5px");

      deleteImage.setAttribute("src", "./assets/images/corbeille.png");
      deleteImage.style.position = "absolute";
      deleteImage.style.marginTop = "-104px";
      deleteImage.style.marginLeft = "10px";
      deleteImage.style.width = "12px";
      deleteImage.style.padding = "5px";

      deleteImage.addEventListener("click", () => {
        fetch(`http://localhost:5678/api/works/${article.id}`, {
            method: "DELETE",
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("token")
            }
          })
          .then(() => {
            // Supprime la figure du DOM
            figure.remove();
          })
          .catch(error => console.error(error));
      });

      // Ajouter les éléments au DOM
      workActionsDiv.appendChild(editLink);
      workActionsDiv.appendChild(deleteImage);
      figure.appendChild(workImageDiv);
      figure.appendChild(workActionsDiv);
      document.querySelector(".containWorks").appendChild(figure);
    }

    });

    ////////////////

    // SUPPRIMER TOUS LES WORKS DUN COUP (DANS LA MODALE)

    document.querySelector("#suppAllWo").addEventListener("click", function dlAll() {
    fetch("http://localhost:5678/api/works")
  .then(data => data.json())
  .then(jsonListArticle => {
    for (let jsonArticle of jsonListArticle) {
      let article = new modifArticle(jsonArticle);

      fetch(`http://localhost:5678/api/works/${article.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      })
      .then(() => {
        console.log(`Article ${article.id} supprimé avec succès`);
      })
      .catch(error => console.error(error));
    }
  })
  .catch(error => console.error(error));

    })
 

//AFFICHER LES BUTTON (filtres) CATEGORIES HOMEPAGE
  fetch("http://localhost:5678/api/categories")
  .then(data => data.json())
  .then(jsonListCate => {
    let ids = [];
    for (let jsonCate of jsonListCate) {
      let category = new Category(jsonCate);
      ids.push(category.id);
      document.querySelector("#filters").innerHTML +=
        `<button id="${category.id}" class="item-filters"><h5>${category.name}</h5></button>`
    }
 
    // Ajout de l'événement click sur le bouton ALL
    document.querySelector("#all").addEventListener("click", function() {
      // Supprime les travaux existants avant d'afficher tous les travaux
      const galleryElement = document.getElementById("gallery");
      galleryElement.innerHTML = '';
      // Affiche tous les travaux
      fetch("http://localhost:5678/api/works")
        .then(response => response.json())
        .then(worksData => {
          worksData.forEach(function(work) {
            var workElement = document.createElement("figure");
            workElement.innerHTML =
              `<div><img crossorigin='anonymous' src="${work.imageUrl}"</div><div><h5>${work.title}"</h5></div>`;
            document.getElementById("gallery").appendChild(workElement);
          });
        })
        .catch(error => console.error("Error: ", error));
    });

    
    const catButtons = document.getElementsByClassName('item-filters');
const allButton = document.getElementById('all');

function resetButtons() {
  for (let j = 0; j < catButtons.length; j++) {
    catButtons[j].style.backgroundColor = '';
    catButtons[j].style.color = '';
  }
  allButton.style.backgroundColor = '';
  allButton.style.color = '';
}

for (let i = 0; i < catButtons.length; i++) {
  let catButton = catButtons[i];
  catButton.addEventListener("click", function() {
    // Supprime les travaux existants avant d'afficher les nouveaux
    const galleryElement = document.getElementById("gallery");
    galleryElement.innerHTML = '';

    // Réinitialise tous les boutons
    resetButtons();

    // Change la couleur de fond et la couleur du texte du bouton actif
    catButton.style.backgroundColor = '#1D6154';
    catButton.style.color = 'white';

    // Affiche les travaux de la catégorie correspondante
    fetch("http://localhost:5678/api/works")
      .then(response => response.json())
      .then(worksData => {
        worksData = worksData.filter(work => work.categoryId === ids[i]);
        worksData.forEach(function(work) {
          var workElement = document.createElement("figure");
          workElement.innerHTML =
            `<div><img crossorigin='anonymous' id="${work.id}" src="${work.imageUrl}"</div><div><h5>${work.title}"</h5></div>`;
          document.getElementById("gallery").appendChild(workElement);
        });
      })
      .catch(error => console.error("Error: ", error));
  });
}

allButton.addEventListener('click', function() {
  // Supprime les travaux existants avant d'afficher les nouveaux
  const galleryElement = document.getElementById("gallery");
  galleryElement.innerHTML = '';

  // Réinitialise tous les boutons
  resetButtons();

  // Change la couleur de fond et la couleur du texte du bouton actif
  allButton.style.backgroundColor = '#1D6154';
  allButton.style.color = 'white';

  // Affiche tous les travaux
  fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(worksData => {
      worksData.forEach(function(work) {
        var workElement = document.createElement("figure");
        workElement.innerHTML =
          `<div><img crossorigin='anonymous' id="${work.id}" src="${work.imageUrl}"</div><div><h5>${work.title}"</h5></div>`;
        document.getElementById("gallery").appendChild(workElement);
      });
    })
    .catch(error => console.error("Error: ", error));
});
  });

    


  const select = document.getElementById("work-category");
const url = "http://localhost:5678/api/categories";

// Fonction pour ajouter des options de sélection
function addOption(value, text) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = text;
  select.appendChild(option);
}

// Requête pour récupérer les catégories de l'API
fetch(url)
  .then(response => response.json())
  .then(data => {
    // Pour chaque catégorie, ajouter une option de sélection
    data.forEach(category => {
      addOption(category.id, category.name);
    });
  })
  .catch(error => console.error(error));

