/**
 * this function deletes the task from the loaded JSON
 * @param {string} id - id of the task to be deleted
 */
async function deleteTask(id) {
  await loadToDelete();  
  tasks.splice(id, 1);   
  await setItem("tasks", JSON.stringify(tasks));
}

/**
 * this function loads the JSON tasks from the backend
 * @param {} - no parameter
 */
async function loadToDelete() {
  try {
  tasks = JSON.parse(await getItem("tasks")); 
  contacts = JSON.parse(await getItem("contacts"));
} catch (e) {
  console.error("Loading error:", e);
}
}

/**
 * this function warns before a category is deleted
 * @param {string} categoryToDelete - this category has been selected to be deleted
 * @param {number} i - index of the JSON categories
 */
function askBeforeDeleteCategory(categoryToDelete, i) {
  let confirmDeleteCategory = document.getElementById('confirmDeleteCategory');
  confirmDeleteCategory.classList.remove('d-none');
  confirmDeleteCategory.innerHTML += /*html*/`
      <div id="confirmDeleteCategoryQuestion">Delete Category?</div>
      <div id="confirmDeleteCategoryAnswers">
              <div id="confirmDeleteCategoryAnswersYes" onclick="deleteCategory('${categoryToDelete}', ${i})">Delete</div>
              <div id="confirmDeleteCategoryAnswersNo" onclick="closeDeleteCategoryRequest()">Back</div>
      </div>
  `
}

/**
 * this function deletes a category if it's not in use in the board
 * @param {string} categoryToDelete - this category has been selected to be deleted
 * @param {number} i - index of the JSON categories
 */
function deleteCategory(categoryToDelete, i) {
  checkCategoryIfUsed = checkCategoryToDelete(categoryToDelete);
  if (checkCategoryIfUsed === false) {
    categories.splice(i, 1);
    document.getElementById("categoryAlert").innerHTML = "";
    renderCategories();
    saveOnlyCategories();
  } else {
    document.getElementById("categoryAlert").innerHTML = "Category is in use";
  }
  closeDeleteCategoryRequest();
}


/**
 * this function closes the alert
 * @param {}  - no parameter
 */
function closeDeleteCategoryRequest() {
  document.getElementById('confirmDeleteCategory').innerHTML = "";
  document.getElementById('confirmDeleteCategory').classList.add('d-none');
}

/**
 * this function checks if the category to delete is not in use in the board.html
 * @param {string} categoryToDelete - this category has been selected to be deleted
 */
function checkCategoryToDelete(categoryToDelete) {
  for (let i = 0; i < tasks.length; i++) {
    const categoryToCheck = tasks[i]["category"];
    if (categoryToDelete === categoryToCheck) {
      return true;
    }
  }
  return false;
}
