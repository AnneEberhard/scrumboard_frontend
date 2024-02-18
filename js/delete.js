/* DELETING TASKS */

/**
 * confirm Container if task should be deleted
 * @param {*} id backend id of task which was clicked 
 */
function askBeforeDelete(id) {
  let confirmDelete = document.getElementById('confirmDeleteTask');
  confirmDelete.classList.remove('d-none');
  confirmDelete.innerHTML += /*html*/`
      <div id="confirmDeleteTaskQuestion">Delete Task?</div>
      <div id="confirmDeleteTaskAnswers">
              <div id="confirmDeleteTaskAnswersYes" onclick="deleteTaskFinally(${id})">Delete</div>
              <div id="confirmDeleteTaskAnswersNo" onclick="closeDeleteRequest()">Back</div>
      </div>`;
}

/**
* carries out final delete 
* @param {*} id backend id of task which was clicked
*/
async function deleteTaskFinally(id) {
  closeDeleteRequest('confirmDeleteTask');
  await deleteTask(id);
  renderBoardCards();
  closeEditTask();
  flushArrays();
}


/**
 * this function deletes the task from backend
 * @param {string} id - backend id of the task to be deleted
 */
async function deleteTask(id) {
  await deleteItem("tasks", id);
}


/**
 * this function closes the alert
 * @param {}  - no parameter
 */
function closeDeleteRequest(idContainer) {
  document.getElementById(idContainer).innerHTML = "";
  document.getElementById(idContainer).classList.add("d-none");
}

/* DELETING CATEGORIES */

/**
 * this function warns before a category is deleted
 * @param {string} categoryToDelete - name of category to be deleted
 */
function askBeforeDeleteCategory(categoryToDelete) {
  let confirmDeleteCategory = document.getElementById("confirmDeleteCategory");
  confirmDeleteCategory.classList.remove("d-none");
  confirmDeleteCategory.innerHTML += /*html*/ `
      <div id="confirmDeleteCategoryQuestion">Delete Category?</div>
      <div id="confirmDeleteCategoryAnswers">
              <div id="confirmDeleteCategoryAnswersYes" onclick="deleteCategory('${categoryToDelete}')">Delete</div>
              <div id="confirmDeleteCategoryAnswersNo" onclick="closeDeleteRequest('confirmDeleteCategory')">Back</div>
      </div>
  `;
}

/**
 * this function deletes a category if it's not in use in the board
 * @param {string} categoryToDelete - name of category to be deleted
 */
async function deleteCategory(categoryToDelete) {
  checkCategoryIfUsed = checkCategoryToDelete(categoryToDelete);
  let id = getCategoryBackendId(categoryToDelete);
  if (checkCategoryIfUsed === false) {
    await deleteItem("savedCategories", id);
    categories = await getItem("savedCategories")
    renderCategories();
  } else {
    document.getElementById("categoryAlert").innerHTML = "Category is in use";
  }
  closeDeleteRequest("confirmDeleteCategory");
}



/**
 * this function checks if the category to delete is not in use in the board.html
 * @param {string} categoryToDelete - name of category to be deleted
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

/**
 * This function deletes the contact from the backend and renders the contactlist
 * @param {string} name - name of category 
 */
function getCategoryBackendId(name) {
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    if (category.name == name) {
      return category.id;
    } 
  }
  return -1;
}


/* DELETING CONTACTS */
/**
 * This function deletes the contact from the backend and renders the contactlist
 * @param {string} name - name of contact to be deleted
 */
function getContactBackendId(name) {
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    if (contact.user_name == name) {
      return contact.id;
    } 
  }
  return -1;
}

/**
 * This function deletes the contact from the backend and renders the contactlist
 * @param {string} contactToDeleteId- backend id of contact to be deleted
 */
function askBeforeDeleteContact(contactToDeleteId) {
 let confirmDeleteContact = document.getElementById("confirmDeleteContact");
 confirmDeleteContact.classList.remove("d-none");
 confirmDeleteContact.innerHTML += /*html*/ `
     <div id="confirmDeleteContactQuestion">Delete Contact?</div>
     <div id="confirmDeleteContactAnswers">
             <div id="confirmDeleteContactAnswersYes" onclick="deleteContact('${contactToDeleteId}')">Delete</div>
             <div id="confirmDeleteContactAnswersNo" onclick="closeDeleteRequest('confirmDeleteContact')">Back</div>
     </div>
 `;
}

/**
 * This function deletes the contact from the backend and renders the contactlist
 */
function askBeforeDeleteContactInModal() {
  let contact_name = document.getElementById("edit_name").value;
  let contactToDeleteId = getContactBackendId(contact_name);
  let confirmDeleteContactContainer = document.getElementById("confirmDeleteContactContainer");
  let confirmDeleteContact = document.getElementById("confirmDeleteContact");
  confirmDeleteContactContainer.classList.remove("d-none");
  confirmDeleteContact.innerHTML += /*html*/ `
      <div id="confirmDeleteContactQuestion">Delete Contact?</div>
      <div id="confirmDeleteContactAnswers">
              <div id="confirmDeleteContactAnswersYes" onclick="deleteContactInModal('${contactToDeleteId}')">Delete</div>
              <div id="confirmDeleteContactAnswersNo" onclick="closeDeleteRequest('confirmDeleteContactContainer')">Back</div>
      </div>
  `;
 }

 
/**
 * This function deletes the contact from the backend and renders the contactlist
 * @param {string} id - backend id of contact to be deleted
 */
async function deleteContact(id) {
  askBeforeDeleteContact
  await deleteItem("contacts", id);
  await loadContacts();
  renderContactList();
  document.getElementById("render").innerHTML = "";
  window.location.href = "contacts.html";
}


/**
 * This function deletes the contact inside of a modal
 * @param {string} id - backend id of contact to be deleted
 */
async function deleteContactInModal(id) {
  if (id !== -1) {
    await deleteItem("contacts", id);
    loadContacts();
    renderContactList();
    closeModal("edit_contact_background");
    document.getElementById("render").innerHTML = "";
  } else {
    alert("Please check the contact name");
  }
}