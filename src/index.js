document.addEventListener("DOMContentLoaded", () => {
    fetchDogs();
  
    const form = document.querySelector("#dog-form");
    if (form) {
      form.addEventListener("submit", event => {
        event.preventDefault();
        const id = form.dataset.id;
        updateDog(id);
      });
    }
  });
  
  function fetchDogs() {
    fetch("http://localhost:3000/dogs")
      .then(response => response.json())
      .then(dogs => renderDogs(dogs))
      .catch(error => console.error("Error fetching dogs:", error));
  }
  
  function renderDogs(dogs) {
    const tableBody = document.querySelector("#table-body");
    tableBody.innerHTML = ""; 
    dogs.forEach(dog => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${dog.name}</td>
        <td>${dog.breed}</td>
        <td>${dog.sex}</td>
        <td><button onclick="editDog(${dog.id})">Edit</button></td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  function editDog(id) {
    fetch(`http://localhost:3000/dogs/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Dog not found (404): ${response.statusText}`);
        }
        return response.json();
      })
      .then(dog => {
        const nameInput = document.querySelector("#name");
        const breedInput = document.querySelector("#breed");
        const sexInput = document.querySelector("#sex");
  
        if (nameInput && breedInput && sexInput) {
          nameInput.value = dog.name;
          breedInput.value = dog.breed;
          sexInput.value = dog.sex;
          document.querySelector("#dog-form").dataset.id = dog.id;
        } else {
          console.error("Form input elements not found.");
        }
      })
      .catch(error => console.error("Error fetching dog:", error));
      console.log("Dog fetched:", dog); 
      console.log("Name Input:", nameInput); 

  }
  
  function updateDog(id) {
    const updatedDog = {
      name: document.querySelector("#name").value,
      breed: document.querySelector("#breed").value,
      sex: document.querySelector("#sex").value
    };
  
    fetch(`http://localhost:3000/dogs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedDog)
    })
      .then(response => response.json())
      .then(() => fetchDogs()) 
      .catch(error => console.error("Error updating dog:", error));
  }
  
  