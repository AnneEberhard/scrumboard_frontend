let user_name = document.getElementById("name");
let email = document.getElementById("email");
let phone = document.getElementById("phone");

let edit_email = document.getElementById("edit_email");
let edit_name = document.getElementById("edit_name");
let edit_phone = document.getElementById("edit_phone");
let edit_picture = document.getElementById("edit_avatar");

let contacts = [];

let editingContact;

/**
 * This function is used to first load the templates, then it will load the contacts from the backend.
 * After it's loaded from the backend, the contact list is getting rendered.
 * @param {}  - no param
 */
async function initContacts() {
  //checkLogIn();
  await loadContacts();
  renderContactList();
}

/**
 * This function closes the open modal
 * @param {string} - id of the modal
 */
function closeModal(id) {
  let modal = document.getElementById(id);
  modal.classList.remove("slideIn");
  modal.classList.add("slideOut");
}

/**
 * This function opens a chosen modal
 * @param {string} - id of the modal
 */
function openModal(id) {
  let modal = document.getElementById(id);
  modal.style = "display: flex;";
  modal.className = "slideIn";
}

/**
 * This function calls another function that resets the input of the user
 * and closes the Modal with the given ID.
 * @param {string} - id of the modal
 */
function cancelContact(id) {
  resetForm();
  closeModal(id);
}

/**
 * This function creates the Contact.
 * @param {string} - id of the modal
 */
async function createContact(id) {
  let acronym = createAcronym(user_name.value);
  let contact = new Contact(
    user_name.value,
    +phone.value,
    email.value,
    acronym.toUpperCase()
  );
  contacts.push(contact);
  await addItem("contacts", JSON.stringify(contact));
  await loadContacts();
  resetForm();
  closeModal(id);
  renderContactList();
}

/**
 * This function loads contacts from the backend.
 * @param {}  - no parameter
 */
async function loadContacts() {
  try {
    contacts = await getItem("contacts");
    console.log('Kontakte:', contacts);
  } catch (e) {
    contacts = [];
  }
}

/**
 * This help function resets the User Input.
 * @param {}  - no parameter
 */
function resetForm() {
  user_name.value = "";
  email.value = "";
  phone.value = "";
}

/**
 * This function renders the Contact Details in the render element ID.
 * @param {string} - the contact to be rendered
 */
function renderContact(username) {
  let contact = findContactByUserName(username);
  let email = contact.email;
  let phone = contact.phone;
  let name = contact.user_name;
  let acronym = contact.acronym;
  let color = contact.color;
  let id = contact.id;
  content = document.getElementById("render");
  render.innerHTML = htmlUserTemplate(id, email, phone, name, acronym, color);
}

/**
 * This help function finds the wanted contact
 * @param {string} - the contact that to be found
 */
function findContactByUserName(userName) {
  return contacts.find((contact) => contact.user_name === userName);
}

/**

 * This function edits the contact info of the user
 * @param {string} - the contact to be found 
 */
function editContact(user) {
  openModal("edit_contact_background");
  editingContact = findContactByUserName(user);
  edit_name.value = editingContact.user_name;
  edit_email.value = editingContact.email;
  edit_phone.value = editingContact.phone;
  edit_picture.innerHTML = editingContact.acronym;
  edit_picture.style.backgroundColor = editingContact.color;
}

/**
 * This function saves the edited contact in the backend.
 * @param {}  - no parameter
 */
async function saveEditedContact() {
  debugger;
  let acronym = createAcronym(edit_name.value);
  editingContact.user_name = edit_name.value;
  editingContact.email = edit_email.value;
  editingContact.phone = edit_phone.value;
  editingContact.acronym = acronym;
  let id = editingContact.id;
  console.log(editingContact);
  resetEditForm();
  await updateItem("contacts", JSON.stringify(editingContact), id);
  await loadContacts();
  renderContactList();
  closeModal("edit_contact_background");
  renderContact(editingContact.user_name);
}




/**
 * This help function deletes user input inside the edit modal.
 * @param {}  - no parameter
 *
 */
function resetEditForm() {
  edit_name.value = "";
  edit_email.value = "";
  edit_phone.value = "";
}

/**
 * This function is for highlighting the current chosen User
 * @param {}  - no parameter
 *
 */
function changeDisplay() {
  let container = document.getElementById("contact_container");
  container.style.display = "none";
  currentHighlightedDiv.classList.remove("highlighted");
}

/**
 * This function puts a upper case on the first and last name as the user types
 * @param {}  - no parameter
 */

function capitalizeName(modal) {
  let nameOnInput = document.getElementById(modal).value;
  let arr = nameOnInput.split(" ");
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    let fullName = arr.join(" ");
    document.getElementById(modal).value = fullName;
  }
}

/**
 * This help function is used for the HTML Template to render Contact Details.
 * @param {string} - email - email of Contact
 * @param {string} - phone - phone of Contact
 * @param {string} - name - name of Contact
 * @param {string} - acronym - acronym of Contact
 * @param {string} - color - color of Contact
 */

function htmlUserTemplate(id, email, phone, name, acronym, color) {
  return /*html*/ `<div class="user_container">
  <div class="user">
  <div class="user_icon" style="background-color: ${color}">${acronym}</div>
  <div class="user_edit_container">
  <div class="username">${name}</div>
  <div class="edit_user">
  <div id="edit_contact" onclick="editContact('${name}')">
    <img src="assets/img/edit.png">
    <span>Edit</span>
    </div>
    <div id="delete_contact" onclick="askBeforeDeleteContact('${id}')">
    <img src="assets/img/delete.png">
    <span>Delete</span>
    </div>
  </div>
  <div class="dropdown_for_mobile">
    <img src="assets/img/more_vert.png">
    <div class="dropdown-content">
    <div id="edit_contact" onclick="editContact('${name}')">
    <img src="assets/img/edit.png">
    <span>Edit</span>
    </div>
    <div id="delete_contact" onclick="askBeforeDeleteContact('${id}')">
    <img src="assets/img/delete.png">
    <span>Delete</span>
    </div>
</div>
</div>
</div>
</div>
</div>
<div class="contact_information">
    <span class="information">Contact Information</span>
  </div>
  <div class="user_details">
    <div class="details_container">
        <div class="email">
        
            <h3>Email</h3>
            <a href="mailto: ${email}">${email}</a>
            </div>
        
        <div class="phone">
            <h3>Phone</h3>
            <a href="tel: ${phone}">${phone}</a>
        </div>
    </div>
  </div>
</div>`;
}
