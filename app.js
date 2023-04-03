let modal = null

const modalCloseButtons = document.querySelectorAll('.js-modal-close');
const modalCloseAllButton = document.querySelector('.js-modal-close-all');

modalCloseButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modalId = button.dataset.modalId;
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
  });
});

modalCloseAllButton.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => modal.style.display = 'none');
});


const openModal = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute('href'))
    target.style.display = null
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal', 'true')
    modal = target
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)

}


const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = "none"
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})


const form = document.getElementById('add-work-form');
form.addEventListener('submit', async (event) => {
event.preventDefault(); // Empêcher le comportement par défaut du formulaire

const formData = new FormData();
const title = document.getElementById('work-title').value;
const category = document.getElementById('work-category').value;
const imageFile = document.getElementById('work-image').files[0];



  // Créer un objet qui représente le work à ajouter
  formData.append('title', title);
  formData.append('category', category);
  formData.append('image', imageFile, imageFile.name);
  const imageBlob = new Blob([imageFile], { type: imageFile.type });
  const work = {
  'image': imageBlob,
  'title': title,
  'category': category,
  };

  try {
  const response = await fetch('http://localhost:5678/api/works', {
    method: 'POST',
    body: formData,
    headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  console.log(response); // Affiche la réponse de l'API
  } catch (error) {
  console.error(error);
  }
}
);


function resetGallery() {
  document.getElementById("gallery").innerHTML = "";
  
  fetch("http://localhost:5678/api/works")
    .then(data => data.json())
    .then(jsonListArticle => {
      for(let jsonArticle of jsonListArticle){
        let article = new Article(jsonArticle);
        document.querySelector(".gallery").innerHTML += 
          `<figure>
            <div><img crossorigin="anonymous" src="${article.imageUrl}"</div>
            <div><h5>${article.title}</h5></div>
          </figure>`;
      }
    });
}


document.querySelectorAll(".js-modal-close").forEach(function(button) {
  button.addEventListener("click", function() {
    resetGallery();
  });
});


function resetContainGallery() {
  document.getElementById("newContain").innerHTML = "";
  
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
}


const closeButton = document.querySelector('[data-modal-id="modal2"].js-modal-close');

closeButton.addEventListener('click', function() {
  resetContainGallery();
});
