let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

// START OF MY CODE SECTION

function init(){
// form submit button for adding new toy
  let newToyButton = document.querySelector('form')
  newToyButton.addEventListener('submit', e => {
    e.preventDefault()
    newToyFormSubmit()
  })

  function newToyFormSubmit(){
    let toyForm = document.querySelector('form')
    newToyFetch(toyForm.name.value, toyForm.image.value)
  }

  let divToyCollection = document.getElementById('toy-collection')
// Initial fetch to get toys added to cards on page
  return fetch("http://localhost:3000/toys")
  .then(response => response.json())
  .then(data => {
    let toyArr = [...data]
    toyArr.forEach(toy => createToyInfo(toy))
  })
// Function to create the information within the cards on the page
  function createToyInfo(toy){
    let h2 = document.createElement('h2')
    h2.innerText = `${toy.name}`
    
    let img = document.createElement('img')
    img.src = toy.image
    img.className = "toy-avatar"
    
    let p = document.createElement('p')
    p.innerHTML = `<span>${toy.likes}</span> likes`
    
    let button = document.createElement('button')
    button.className = "like-btn"
    button.id = `${toy.id}`
    button.innerText = 'Like ❤️'
    button.addEventListener('click', (e) => {
      let numOfLikes = e.target.parentElement.querySelector('span').innerText
      updateLikes(e.target.id, numOfLikes)
    })
    
    let createDivCard = document.createElement('div')
    createDivCard.className = "card"
    createDivCard.append(h2, img, p, button)
    divToyCollection.appendChild(createDivCard)
  }
// function for being able to pdate likes and patching the server
  function updateLikes(toyID, likes){
    return fetch(`http://localhost:3000/toys/${toyID}`,{
      method: "PATCH",
      headers:
      {
      "Content-Type": "application/json",
      Accept: "application/json"
      },
      body: JSON.stringify({
        "likes": ++likes
        }
      )}
    )
    .then(resp => resp.json())
    .then(data => changeLikes(data))
}

  function changeLikes(toyInfo){
    let specificToy = document.getElementById(`${toyInfo.id}`).parentElement
    let thisToysLikes = specificToy.querySelector('span')
    ++thisToysLikes.innerText
  }

// Post fetch, used to add new toys to the JSON server and update the DOM
  function newToyFetch(name, URL){
    return fetch("http://localhost:3000/toys", {
      method: "POST",
      headers:
      {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "name": name,
        "image": URL,
        "likes": 0
      })
    })
    .then(resp => resp.json())
    .then(data => createToyInfo(data))
  }

}
document.addEventListener("DOMContentLoaded", init)