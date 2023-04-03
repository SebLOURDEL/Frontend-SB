const form = document.querySelector("#login-form");

form.addEventListener("submit", event => {
  event.preventDefault();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Connexion échouée");
    }
  })
  .then(data => {
    console.log(data)
    if (data.token) {
      localStorage.setItem("token", data.token);
      location.href = "./index.html";
    } else {
      alert("Identifiant ou mot de passe incorrect");
    }
  })
  .catch(error => {
    console.error(error);
    alert("Une erreur s'est produite, veuillez réessayer plus tard");
  });
});


