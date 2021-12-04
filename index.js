let restaurantData = [];
//let favourites = [];
let showFavs = false;
//localStorage.setItem("favourites", JSON.stringify(favourites));
init();

async function init() {
  restaurantData = await getData();
  console.log(restaurantData);
  //render();
  generateView(restaurantData);
}

function getData() {
  return fetch("./sampleData.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      return data;
    });
}

function getCard(restaurant, selected = false) {
  return `
  <div class="restaurant-card">
  <i class="fa fa-star ${selected ? "selected" : null}" aria-hidden="true" id=${
    restaurant.id
  } onclick="toggleFavourite(event)"></i>
    <div>
      <img src=${restaurant.image} alt=${restaurant.name} />
    </div>
    <div class="restaurant-info">
      <div><b>Name:</b>${restaurant.name}</div>
      <div><b>ETA:</b>${restaurant.eta}</div>
      <div><b>Rating:</b>${restaurant.rating}</div>
      <div><b>Tags:</b>${restaurant.tags}</div>
    </div>
  </div>`;
}

function generateView(restaurantData) {
  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  //console.log(favourites);
  let restaurantsTemplate = restaurantData.map((rest) => {
    //console.log(rest);
    let index = favourites.findIndex((fav) => fav.id === rest.id);
    if (index >= 0) {
      return getCard(rest, true);
    }
    return getCard(rest);
  });

  console.log(restaurantsTemplate);
  let restaurants = document.querySelector(".restaurants");
  restaurants.innerHTML = restaurantsTemplate;
  //console.log(restaurants);
  //return restaurants;
}

// function render() {
//   generateView();
// }

function searchClickHandler() {
  let searchInput = document.querySelector("#input-search").value;
  console.log("search clicked", searchInput);
  let requiredRestaurants = restaurantData.filter((rest) =>
    rest.name.includes(searchInput)
  );
  if (requiredRestaurants) {
    generateView(requiredRestaurants);
  } else {
    generateView(restaurantData);
  }
}

function changeHandler(e) {
  console.log("chanfe", e.target.value);
  let searchInput = e.target.value;
  let requiredRestaurants = restaurantData.filter((rest) =>
    rest.name.includes(searchInput)
  );
  if (requiredRestaurants) {
    generateView(requiredRestaurants);
  } else {
    generateView(restaurantData);
  }
}

function sortby(q) {
  let sortBy = document.querySelector("#sort-by").value;
  console.log(sortBy);
  let tempRestaurants;
  switch (sortBy) {
    case "eta":
      tempRestaurants = restaurantData.sort((a, b) =>
        a.eta > b.eta ? 1 : b.eta > a.eta ? -1 : 0
      );

      break;
    case "name":
      tempRestaurants = restaurantData.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      );
      break;
    case "rating":
      tempRestaurants = restaurantData.sort((a, b) =>
        a.rating > b.rating ? 1 : b.rating > a.rating ? -1 : 0
      );
      break;
  }
  generateView(tempRestaurants);
}

function filterby(q) {
  let filterBy = q.target.value;
  let tempRestaurants;
  console.log(q.target.value);
  if (filterBy === "default") {
    tempRestaurants = restaurantData;
  } else {
    tempRestaurants = restaurantData.filter((rest) =>
      rest.tags.includes(filterBy)
    );
  }

  generateView(tempRestaurants);
}

function toggleFavourite(e) {
  console.log("toggle", e);
  let itemId = e.target.id;
  let favData = restaurantData.find((rest) => rest.id === itemId);
  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  let favIndex = favourites.findIndex((fav) => fav.id === itemId);
  if (favIndex >= 0) {
    favourites.splice(favIndex, 1);
  } else {
    favourites.push(favData);
  }
  document.querySelector("#" + itemId).classList.toggle("selected");
  localStorage.setItem("favourites", JSON.stringify(favourites));
}

function showFavourites() {
  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  console.log("fav");
  if (showFavs) {
    generateView(favourites);
    document.querySelector("#fav").classList.add("fav");
  } else {
    generateView(restaurantData);
    document.querySelector("#fav").classList.remove("fav");
  }
  showFavs = !showFavs;
}
