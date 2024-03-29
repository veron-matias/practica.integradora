const productsCardsContainer = document.getElementById("productCardsContainer");
const pageButtonsContainer = document.getElementById("pageButtonsContainer");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const pageCounter = document.getElementById("pageCounter");

products.docs.forEach((product) => {
  const card = document.createElement("div");
  card.classList.add("productCard");
  card.innerHTML = `<a class="productLink"><div class="productImage" ></div></a><div class="textAndButtonContainer"><div>${
    product.title
  }</div><div>$${
    product.price
  }</div><div class="quantityContainer"><button class="arrowButton decrease"><</button><div class="quantityCounter">${1}</div><button class="arrowButton increase">></button></div><button class="button fixMargin newButton add"> ADD TO CART </button></div>`;
  productsCardsContainer.appendChild(card);
  const addButton = card.querySelector(".add");
  const decreaseButton = card.querySelector(".decrease");
  const increaseButton = card.querySelector(".increase");
  const cardImageLink = card.querySelector(".productLink");
  console.log("cartImageLink:", cardImageLink);
  cardImageLink.href = `/api/products/view/${product._id}/`;
  addButton.addEventListener("click", () => {
    console.log("Adding to cart:", product.title);
  });
  decreaseButton.addEventListener("click", () => {
    console.log("Decreasing quantity for:", product.title);
  });
  increaseButton.addEventListener("click", () => {
    console.log("Increasing quantity for:", product.title);
  });
});

prevButton.classList.add("arrowButton");
prevButton.innerHTML = "<";
if (products.hasPrevPage) {
  prevButton.href = products.prevLink;
} else {
  prevButton.classList.add("disabled");
  prevButton.disabled = true
}

nextButton.classList.add("arrowButton");
nextButton.innerHTML = ">";
if (products.hasNextPage) {
  nextButton.href = products.nextLink;
} else {
  nextButton.classList.add("disabled");
  nextButton.disabled = true
}

pageCounter.innerHTML = products.page;