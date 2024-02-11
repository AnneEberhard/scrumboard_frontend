//Not used



async function deleteContact(contactNameToDelete) {
  await loadToDelete();
   for (let i = 0; i < contacts.length; i++) {
     const contactToDelete = contacts[i];
     const nameOfContact = contactToDelete["user_name"];
     if (contactNameToDelete === nameOfContact) {
      contacts.splice(i, 1);
     }
   }
   await setItem("contacts", JSON.stringify(contacts));
 }



 //changed

 /**
 * searching function, to show task who hast the searched word in title
 * @param {}  - no param
 */
function searchTasksOnBoard() {
  let searchedTask = document.getElementById("board_input").value.toUpperCase();
  let searchingElements = document.getElementsByClassName(
    "board_task_container_title"
  );

  for (let p = 0; p < searchingElements.length; p++) {
    let title = searchingElements[p];
    searchValue = title.textContent || title.innerText;
    if (searchValue.toUpperCase().indexOf(searchedTask) > -1) {
      searchingElements[
        p
      ].parentElement.parentElement.parentElement.style.display = "flex";
    } else {
      searchingElements[
        p
      ].parentElement.parentElement.parentElement.style.display = "none";
    }
  }
}

/**
 * searching function for the mobile version, to show task who hast the searched word in title
 * @param {}  - no param
 */
function searchTasksOnBoardMobile() {
  let searchedTask = document
    .getElementById("board_input_mobile")
    .value.toUpperCase();
  let searchingElements = document.getElementsByClassName(
    "board_task_container_title"
  );

  for (let p = 0; p < searchingElements.length; p++) {
    let title = searchingElements[p];
    searchValue = title.textContent || title.innerText;
    if (searchValue.toUpperCase().indexOf(searchedTask) > -1) {
      searchingElements[
        p
      ].parentElement.parentElement.parentElement.style.display = "flex";
    } else {
      searchingElements[
        p
      ].parentElement.parentElement.parentElement.style.display = "none";
    }
  }
}

 /**
 * renders the move buttons for mobile version
 * @param {string} cats - current category of the card
 * @param {string} id - id of the card
 */
function renderMoveBtns(cats, id) {
  console.log(cats, id);
  document.getElementById(`${id}`).innerHTML += /*html*/ `
            <div class="lastCategory" onclick="moveToLastCat(${cats}, ${id}); stopPropagation(event)"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 14l5-5 5 5H7z"/></svg></div>
            <div class="nextCategory" onclick="moveToNextCat(${cats}, ${id}); stopPropagation(event)"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 10l5 5 5-5H7z"/></svg></div>
        `;
  if (cats == "board_container_bottom_todo") {
    let lastCat = document.getElementById(`${id}`).getElementsByClassName("lastCategory");
    lastCat[0].classList.add("d-none");
  }

  if (cats == "board_container_bottom_done") {
    let lastCat = document.getElementById(`${id}`).getElementsByClassName("nextCategory");
    lastCat[0].classList.add("d-none");
  }
}


 /**
 * clears the contact container
 * @param {}  - no parameter
 */
function clearContactsContainer() {
  contactsContainer.innerHTML = "";
}

/**
 * CHECK THIS
 * Function divived into subfunctions now
 * This function renders the contact list.
 */
function renderContactList2() {
  const contactsContainer = document.getElementById("contacts_container");
  contactsContainer.innerHTML = "";
  console.log(contacts);

  const groupedContacts = {};

  // Group contacts by their acronym
  for (const contact of contacts) {
    const firstLetter = contact.acronym.charAt(0).toUpperCase();
    if (!groupedContacts[firstLetter]) {
      groupedContacts[firstLetter] = [];
    }
    groupedContacts[firstLetter].push(contact);
  }

  // Sort the keys (letters) of the groupedContacts object
  const sortedLetters = Object.keys(groupedContacts).sort();

  // Render the headers, contacts, and dividers
  for (const letter of sortedLetters) {
    const letterContainer = document.createElement("div");
    letterContainer.id = `beginn_${letter.toLowerCase()}`;
    letterContainer.className = "contact_list_letter_container";

    const letterHeader = document.createElement("div");
    letterHeader.className = "letter";
    letterHeader.textContent = letter;
    letterContainer.appendChild(letterHeader);

    const strokeDiv = document.createElement("div");
    strokeDiv.className = "contact_list_stroke";
    letterContainer.appendChild(strokeDiv);

    for (const contact of groupedContacts[letter]) {
      const contactContainer = document.createElement("div");
      contactContainer.className = "contact_list_name_container";

      const contactInnerContainer = document.createElement("div");
      contactInnerContainer.className = "contact_list_name_container_inner";
      contactInnerContainer.addEventListener("click", function () {
        let container = document.getElementById("contact_container");
        container.style.display = "flex";
        if (currentHighlightedDiv !== null) {
          currentHighlightedDiv.classList.remove("highlighted"); // Remove highlighting
        }
        contactContainer.classList.toggle("highlighted");
        currentHighlightedDiv = contactContainer;
        renderContact(contact.user_name);
      });

      const acronymDiv = document.createElement("div");
      acronymDiv.className = "contact_list_name_icon";
      acronymDiv.textContent = contact.acronym;
      acronymDiv.style.backgroundColor = contact.color;

      const nameMailContainer = document.createElement("div");
      nameMailContainer.className = "contact_list_name_mail";

      const nameDiv = document.createElement("div");
      nameDiv.className = "contact_list_name";
      nameDiv.textContent = contact.user_name;

      const mailDiv = document.createElement("div");
      mailDiv.className = "contact_list_mail";
      mailDiv.textContent = contact.email;

      nameMailContainer.appendChild(nameDiv);
      nameMailContainer.appendChild(mailDiv);

      contactInnerContainer.appendChild(acronymDiv);
      contactInnerContainer.appendChild(nameMailContainer);

      contactContainer.appendChild(contactInnerContainer);
      letterContainer.appendChild(contactContainer);
    }

    contactsContainer.appendChild(letterContainer);
  }
}
