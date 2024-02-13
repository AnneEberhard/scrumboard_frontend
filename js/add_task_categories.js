//for includeHTML() and initTemplate('addTask') see script_Templates.js
//for overall functions of the site see add_task.js
//for saving see save_add_tasks.js
//for backend see storage.js

/**
 * this function begins the rendering of the categories
 * @param - no parameter
 */
function renderCategories() {
  document.getElementById("newCategoryDotsContainer").innerHTML = "";
  document.getElementById("category").innerHTML = templateCategory();
  //createFreecolors();
  renderCategoryOptions();
  resetCategories();
  document.getElementById("categoryAlert").innerHTML = "";
}

/**
 * this function returns the main template for categories
 * @param - no parameter
 */
function templateCategory() {
  let templateCategory = /*html*/ `
    <div class="inputWithList">
      <div class="inputCategory">
        <input id="categorySelection" class="selection" required placeholder="Select task category" >
        <div id="categorySelectionCircle"></div> 
      </div>
    <div id="categorySelectionLeft"></div>
    <div id="dividerSmall"></div>
    <div id="categorySelectionRight" onclick="handleCategoriesOptionsClick(event)">
      <img src="assets/img/dropdown.svg" class="hover" />
   </div>
  </div>
  <div class="roundedBorder hidden" id="categoryOptions"></div> 
  </div>`;
  return templateCategory;
}

/**
 * this function renders the options for the dropdown menu of categories
 * @param - no parameter
 */
function renderCategoryOptions() {
  document.getElementById("categoryOptions").innerHTML = "";
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i]["name"];
    const colorCode = categories[i]["colorCode"];
    document.getElementById("categoryOptions").innerHTML +=
      templateCategoryOptionsFurther(category, i, colorCode);
  }
  document.getElementById("categoryOptions").innerHTML +=
    templateCategoryOptionsFirst();
}

/**
 * this function returns the first line for new category
 * @param {string} category - first item from the JSON categories and set to 'New Category'
 * * @param {number} i - index of the JSON categories, in this case set to 0
 */
function templateCategoryOptionsFirst() {
  let templateCategoryOptionsFirst = /*html*/ `  
    <div id="category0" class="option" onclick="renderAddNewCategory()">
    <div>Add New Category</div></div>
  </div>`;
  return templateCategoryOptionsFirst;
}

/**
 * this function returns the template for further lines of category option
 * @param {string} category - i. category from the JSON categories
 * @param {number} i - index of the JSON categories
 * @param {string} colorCode - i. hexcode of the JSON categories
 */
function templateCategoryOptionsFurther(category, i, colorCode) {
  let templateCategoryOptionsFurther = /*html*/ `
    <div class="option">
      <div id="category${i}" class="categoryLine" onclick="selectCategory(${i})">
        <div>${category}</div>
        <div class="circle" style="background-color: ${colorCode}"></div>
      </div>
      <img src="assets/img/delete.png" class="hover" onclick="askBeforeDeleteCategory('${category}', '${i}')"/>
    </div>`;
  return templateCategoryOptionsFurther;
}

/**
 * this function ensures the onlick-Funktion of closing the options isn't carried out
 * @param {event} - no parameter
 */
function handleCategoriesOptionsClick(event) {
  event.stopPropagation();
  if (document.getElementById("addCategory")) {
    checkIfNewCategoryReady();
  } else {
    toggleOptions("categoryOptions");
  }
}

/**
 * this function toggles the dropdown menu of categories and contacts
 * @param {string} id - id of either categories or contacts
 */
function toggleOptions(id) {
  const optionsDiv = document.getElementById(`${id}`);
  optionsDiv.classList.toggle("hidden");
}

/**
 * this function ensures the onlick Funktion is not forwarded to others
 * @param {event} - on click
 */
function closeOptionsOnClick(event, mode) {
  closeOptions(mode);
  event.stopPropagation();
}

/**
 * this function closes the dropdown menu of categories and contacts
 * @param {string} id - id of either categories or contacts
 */
function closeOptions(mode) {
  if (mode == "Add") {
    document.getElementById("categoryOptions").classList.add("hidden");
  }
  document.getElementById(`contactsOptions${mode}`).classList.add("hidden");
}

/**
 * this function selects the clicked-on category, writes it into the input field and adds the respective color dot
 * @param {number} i - index of the JSON categories
 */
function selectCategory(i) {
  const category = categories[i]["name"];
  const colorCode = categories[i]["colorCode"];
  assignedCategory = category;
  document.getElementById("categorySelection").value = category;
  document.getElementById("categorySelectionCircle").innerHTML = /*html*/ `
    <div class="circle" style="background-color: ${colorCode}"></div>`;
  toggleOptions("categoryOptions");
}

/**
 * this function resets NewCategories and respective color code to empty
 * @param - no parameter
 */
function resetCategories() {
  newCategoryName = "";
  newCategoryColor = "";
}

/**
 * this function renders the line for adding a New Category and adds the color dots to choose from
 * @param - no parameter
 */
function renderAddNewCategory() {
  document.getElementById("categorySelection").value = "";
  document
    .getElementById("categorySelection")
    .setAttribute("placeholder", "New category Name");
  document
    .getElementById("categorySelection")
    .setAttribute("onkeyup", "checkIfNewCategoryReady()");
  document.getElementById("categorySelectionCircle").innerHTML = "";
  document.getElementById("categorySelectionLeft").innerHTML =
    templateCategorySelectionLeft();
  document.getElementById("dividerSmall").innerHTML = templatedividerSmall();
  document.getElementById("categorySelectionRight").innerHTML =
    templateCategorySelectionRight();
  document.getElementById(
    "newCategoryDotsContainer"
  ).innerHTML = `<div id="newCategoryDots"></div>`;
  for (let i = 0; i < freeColors.length; i++) {
    document.getElementById("newCategoryDots").innerHTML +=
      templateNewCategoryDots(i);
  }
  toggleOptions("categoryOptions");
}

/**
 * this function returns the HTML code for the cancel button in the adding New Category line
 * @param - no parameter
 */
function templateCategorySelectionLeft() {
  let templateCategorySelectionLeft = `
    <img src="assets/img/cancel.png" class="hover" onclick="renderCategories()"/>`;
  return templateCategorySelectionLeft;
}

/**
 * this function returns the HTML code for the small divider in the adding New Category line
 * @param - no parameter
 */
function templatedividerSmall() {
  let templatedividerSmall = `<div class="dividerSmall"></div>`;
  return templatedividerSmall;
}

/**
 * this function returns the HTML code for the checkmark in the adding New Category line
 * @param - no parameter
 */
function templateCategorySelectionRight() {
  let templateCategorySelectionRight = `
    <img src="assets/img/done.png" class="iconsNewCategory" id="addCategory"/>`;
  return templateCategorySelectionRight;
}

/**
 * this function returns the HTML code for the color dots to choose from beneath the New Category line
 * @param {number} i - index of the array freeColors
 */
function templateNewCategoryDots(i) {
  let colorCode = freeColors[i];
  let templateNewCategoryDots = /*html*/ `
      <div class="circle hover" id="newCategoryDot${i}" style="background-color: ${colorCode}" onclick="addColor(${i})"></div>`;
  return templateNewCategoryDots;
}

/**
 * this function checks if a category name has been entered plus a color code selected and then enables the click function addCategory
 * @param - no parameter
 */
function checkIfNewCategoryReady() {
  newCategoryName = document.getElementById("categorySelection").value;
  let categoryExists = checkIfNewcategoryExists(newCategoryName);
  const addCategoryButton = document.getElementById("addCategory");
  addCategoryButton.removeEventListener("click", addCategory);
  if (newCategoryName !== "" && newCategoryColor == "") {
    addCategoryButton.addEventListener("click", alertNewColor);
    addCategoryButton.classList.add("hover");
  }
  if (
    newCategoryName !== "" &&
    newCategoryColor !== "" &&
    categoryExists === false
  ) {
    addCategoryButton.addEventListener("click", addCategory);
    addCategoryButton.classList.add("hover");
  }
}

/**
 * this function writes an alert if no new color has been chosen
 * @param - no parameter
 */
function alertNewColor() {
  document.getElementById("categoryAlert").innerHTML =
    "Please choose a color before saving";
}

/**
 * this function checks if a new category name already exists and gives an alert if yes
 * @param {string} newCategoryName - is the entered name for a potential new category
 */
function checkIfNewcategoryExists(newCategoryName) {
  if (
    categories.find(
      (element) => element.name.toUpperCase() == newCategoryName.toUpperCase()
    )
  ) {
    document.getElementById("categoryAlert").innerHTML =
      "This category already exists, please choose from Dropdown Menu";
    return true;
  }
  return false;
}

/**
 * this function saves 6 random colorCodes to choose from of them in the array freeColors
 * @param - no parameter
 */
function createFreecolors() {
  freeColors = [];
  for (let i = 0; i < 5; i++) {
    let freeColorCode = getRandomColor();
    freeColors.push(freeColorCode);
  }
}

/**
 * this function creates random colors in hexcode
 * @param - no parameter
 */
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * this function highlights the selected free color and checks if the button to add can bei disabled
 * @param {number} i - index of the array freeColors
 */
function addColor(i) {
  newCategoryColor = freeColors[i];
  for (let j = 0; j < freeColors.length; j++) {
    document.getElementById(`newCategoryDot${j}`).classList.remove("selected");
  }
  document.getElementById(`newCategoryDot${i}`).classList.add("selected");
  checkIfNewCategoryReady();
}

/**
 * this function adds the new category with its respective color to the JSON categories and removes the selected color from the array freeColors
 * @param - no parameter
 */
function addCategory() {
  const newCategoryObject = {
    name: newCategoryName,
    colorCode: newCategoryColor,
  };
  categories.push(newCategoryObject);
  let lastItem = categories.length - 1;
  const indexToRemove = freeColors.indexOf(newCategoryColor);
  if (indexToRemove !== -1) {
    freeColors.splice(indexToRemove, 1);
  }
  renderCategories();
  selectCategory(lastItem);
  toggleOptions("categoryOptions");
  saveOnlyCategories();
}

/**
 * this function checks if an entered category name is part of the list
 * @param - no parameter
 */
function pickExistingCategory(event) {
  const disallowedKeys = ["Backspace", "Delete"];
  if (!disallowedKeys.includes(event.key)) {
    let enteredCategoryName =
      document.getElementById("categorySelection").value;
    for (let i = 0; i < categories.length; i++) {
      let existingCategory = categories[i]["name"];
      existingCategory = existingCategory.slice(0, -1);
      if (enteredCategoryName === existingCategory) {
        document.getElementById("categorySelection").value = "";
        writeExistingCategory(i);
      }
    }
  }
}

/**
 * this function adds the respective color dot to  the written-in, existing category; due to onkeydown a letter needs to be sliced
 * @param {number} i - index of the JSON categories
 */
function writeExistingCategory(i) {
  const category = categories[i]["name"];
  const colorCode = categories[i]["colorCode"];
  const writeCategory = category.slice(0, -1);
  assignedCategory = category;
  document.getElementById("categorySelection").value = writeCategory;
  document.getElementById("categorySelectionCircle").innerHTML = /*html*/ `
    <div class="circle" style="background-color: ${colorCode}"></div>`;
}
