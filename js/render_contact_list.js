let currentHighlightedDiv = null;
let groupedContacts = {};
let contactsContainer; //not to be confused with contactContainer
let sortedLetters;

/**
 * starts the rendering process of contact list in the div "contact_container"
 * @param {}  - no param
 */
function renderContactList() {
  contactsContainer = document.getElementById("contacts_container");
  clearContactsContainer();
  groupedContacts = groupContactsByAcronym();
  sortedLetters = sortLetters();
  renderHeaderContactsDivider();
}

 /**
 * clears the contact container
 * @param {}  - no parameter
 */
 function clearContactsContainer() {
  contactsContainer.innerHTML = "";
  groupedContacts = {};
}


/**
 * groups the contacts by the first letter of the first name into the global JSON array groupedContacts 
 * the respective first letter becomes the index of the group
 * @param {}  - no parameter
 */
function groupContactsByAcronym() {
  for (const contact of contacts) {
    const firstLetter = contact.acronym.charAt(0).toUpperCase();
    if (!groupedContacts[firstLetter]) {
      groupedContacts[firstLetter] = [];
    }
    groupedContacts[firstLetter].push(contact);
  }
  return groupedContacts;
}

/**
 * returns the alphabetically sorted indices of grouped contacts 
 * and thereby the alphabetically sorted existing first letters
 * @param {}  - no parameter
 */
function sortLetters() {
  return Object.keys(groupedContacts).sort();
}

/**
 * renders the basic outlay with a letterContainer for each group of contacts
 * including index = first letter as well as a divider 
 * @param {}  - no parameter
 */
function renderHeaderContactsDivider() {
  for (const letter of sortedLetters) {
    const letterContainer = createLetterContainer(letter);
    const letterHeader = createLetterHeader(letter);
    letterContainer.appendChild(letterHeader);
    const strokeDiv = createStrokeDiv();
    letterContainer.appendChild(strokeDiv);
    renderSingleContact(letter, letterContainer);
    contactsContainer.appendChild(letterContainer);
  }
}


/**
 * creates the div for the grouped contacts of the respective letter
 * @param {string} letter - element of sortedLetters that is currently active in the for-loop
 */
function createLetterContainer(letter) {
  let letterContainer = document.createElement("div");
  letterContainer.id = `beginn_${letter.toLowerCase()}`;
  letterContainer.className = "contact_list_letter_container";
  return letterContainer;
}

/**
 * creates the div for the letter in each header of the div for the grouped contacts 
 * @param {string} letter - element of sortedLetters that is currently active in the for-loop
 */
function createLetterHeader(letter) {
  const letterHeader = document.createElement("div");
  letterHeader.className = "letter";
  letterHeader.textContent = letter;
  return letterHeader;
}

/**
 * creates the divider below each header in the div for the grouped contacts 
 * @param {}  - no parameter
 */
function createStrokeDiv() {
  const strokeDiv = document.createElement("div");
  strokeDiv.className = "contact_list_stroke";
  return strokeDiv;
}

/**
 * renders the single contacts into the respective div of grouped contacts 
 * @param {string} letter - element of sortedLetters that is currently active in the for-loop
 * @param {object} letterContainer - div of the respective group of contacts
 */
function renderSingleContact(letter, letterContainer) {
  for (const contact of groupedContacts[letter]) {
    let contactContainer = createContactContainer();
    let contactInnerContainer = createContactInnerContainer(contact, contactContainer);
    let acronymDiv = createAcronymDiv(contact);
    let nameMailContainer = createNameMailContainer();
    let nameDiv = createNameDiv(contact);
    let mailDiv = createMailDiv(contact);
    appendElements(contactContainer, contactInnerContainer, acronymDiv, nameMailContainer, nameDiv, mailDiv);
    letterContainer.appendChild(contactContainer);
  }

}

/**
 * creates a overall div for a single contact
 * @param {}  - no parameter
 */
function createContactContainer() {
  const contactContainer = document.createElement("div");
  contactContainer.className = "contact_list_name_container";
  return contactContainer;
}

/**
 * creates an inner div for a single contact with its functionalities
 * @param {object} contact - contact that is currently active in the for-loop
 * @param {object} contactContainer - overall div for the single contact
 */
function createContactInnerContainer(contact, contactContainer) {
  const contactInnerContainer = document.createElement("div");
  contactInnerContainer.className = "contact_list_name_container_inner";
  contactInnerContainer.addEventListener("click", function () {
    openContactOfContactList(contact, contactContainer)
  });
  return contactInnerContainer;
}

/**
 * opens the contact if clicked on and highlights it
 * @param {object} contact - contact that is currently active 
 * @param {object} contactContainer - overall div for the single contact to highlight
 * the function renderContacts(parameter) can be found in contacts.js
 */
function openContactOfContactList(contact, contactContainer) {
  let container = document.getElementById("contact_container");
  container.style.display = "flex";
  if (currentHighlightedDiv !== null) {
    currentHighlightedDiv.classList.remove("highlighted");
  }
  contactContainer.classList.toggle("highlighted");
  currentHighlightedDiv = contactContainer;
  renderContact(contact.user_name);
}


/**
 * creates circle div for the acronym for the respective contact
 * @param {object} contact - contact that is currently active
 */
function createAcronymDiv(contact) {
  const acronymDiv = document.createElement("div");
  acronymDiv.className = "contact_list_name_icon";
  acronymDiv.textContent = contact.acronym;
  acronymDiv.style.backgroundColor = contact.color;
  return acronymDiv;
}

/**
 * creates an overall div for name and mail
 * @param {}  - no parameter
 */
function createNameMailContainer() {
  const nameMailContainer = document.createElement("div");
  nameMailContainer.className = "contact_list_name_mail";
  return nameMailContainer;
}

/**
 * creates a div with the name of the contact
 * @param {object} contact - contact that is currently active
 */
function createNameDiv(contact) {
  const nameDiv = document.createElement("div");
  nameDiv.className = "contact_list_name";
  nameDiv.textContent = contact.user_name;
  return nameDiv;
}

/**
 * creates a div with the mail address of the contact
 * @param {object} contact - contact that is currently active
 */
function createMailDiv(contact) {
  const mailDiv = document.createElement("div");
  mailDiv.className = "contact_list_mail";
  mailDiv.textContent = contact.email;
  return mailDiv;
}

/**
 * appends the created elements in the respective order
 * @param {object} contactContaciner - overall div for a single contact
 * @param {object} contactInnerContainer - inner div for a single contact with its functionalities
 * @param {object} acronymDiv - circle div for the acronym
 * @param {object} nameMailContainer - overall div for name and mail
 * @param {object} nameDiv - div with the name of the contact
 * @param {object} mailDiv - div with the mail address of the contact
 * to nameMailContainer: first nameDiv, then mailDiv
 * to contactInnerContainer first acronymDiv, then nameMailContainer
 * to contactContainer at last contactInnerContainer
 */
function appendElements(contactContainer, contactInnerContainer, acronymDiv, nameMailContainer, nameDiv, mailDiv) {
  nameMailContainer.appendChild(nameDiv);
  nameMailContainer.appendChild(mailDiv);
  contactInnerContainer.appendChild(acronymDiv);
  contactInnerContainer.appendChild(nameMailContainer);
  contactContainer.appendChild(contactInnerContainer);
}




