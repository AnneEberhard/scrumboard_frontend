/**
 * @param {*} task 
 * @param {*} idContainer container to render in
 */
function renderAssignementsInTaskOverview(task, idContainer) {
    let assignedUsers = task['assignedContacts'];
    document.getElementById(`${idContainer}`).innerHTML = "";
    for (let i = 0; i < assignedUsers.length; i++) {
        const assignedUser = assignedUsers[i];
        for (let k = 0; k < contacts.length; k++) {
            const contact = contacts[k];
            renderAssignmentIconsInCard(assignedUser, contact, idContainer);
        }
    }
}

/**
 * compares if assignedUser is an user in contact List --> creates an IconCircle
 * @param {*} assignedUser 
 * @param {*} contact 
 * @param {*} idContainer 
 */
function renderAssignmentIconsInCard(assignedUser, contact, idContainer) {
    if (assignedUser.user_name === contact.user_name) {
        let newContainer = document.createElement('div');
        newContainer.classList.add('editTaskUsername');
        let newCircle = document.createElement('div');
        newCircle.classList.add('editTaskUsernameCircle');
        newCircle.style.backgroundColor = getColor(assignedUser.user_name);
        let newName = document.createElement('div');
        newName.classList.add('editTaskUsernameName');
        let un = document.getElementById(idContainer);
        newContainer.appendChild(newCircle);
        newContainer.appendChild(newName);
        newCircle.innerHTML = assignedUser.acronym;
        newName.innerHTML = assignedUser.user_name;
        un.appendChild(newContainer);
    }
}



/**
 * @param {*} assignedUser User who is working on the task
 * @returns color of the user in contact list
 */
function getColor(assignedUser) {
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      if (contact.user_name === assignedUser) {
        return contact.color;
      }
    }
  }

  /**
 * Subtask Input and Add Button in Overview
 * @param {*} id index of task which was clicked
 */
function renderAddSubtasksInOverview(id) {
    document.getElementById('editTaskContainerSubtasksTasks').innerHTML += /*html*/`
        <div class="subtaskEdit">
            <input id="inputSubtaskEdit" class="inputSubtask" placeholder="Add new subtask" />
            <div class="buttonAddSubTask hover" onclick="addSubTask(${id}, 'Edit')">
                <img src="assets/img/plus.png" />
            </div>
        </div>`
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
 * this function renders the field for adding subtasks
 * @param {*} id index of task which was clicked
 */
async function addSubTaskEdit(id) {
    let subTaskName = document.getElementById("inputSubtaskEdit").value;
    let subTaskDone = 0;
    let subTask = {
        'subTaskName': subTaskName,
        'subTaskDone': subTaskDone
    }
    subTasksArray.push(subTask);
    renderSubtasksInTaskOverview(id);
    await updateTask(id);
    renderBoard();
    document.getElementById("inputSubtaskEdit").value = "";
}


/**
 * closes the delete request container 
 * @param - no parameter
 */
function closeDeleteRequest() {
    document.getElementById('confirmDeleteTask').innerHTML = "";
    document.getElementById('confirmDeleteTask').classList.add('d-none');
}



//muss ersetzt werden durch delete
/**
 * this function saves only the savedCategories to the backend and is used when a category is deleted or added
 * @param {}  - no parameter
 */
async function saveOnlyCategories() {
    await setItem("savedCategories", JSON.stringify(categories));
  }
  

  
/**
 * this function updates 
 * @param {id}  - backend Id of task
 */
async function updateTask(i, taskId) {
    let updatedTask = tasks[i];
    await updateItem("tasks", JSON.stringify(updatedTask), taskId);
  }

  
  async function getSubTaskId(subTask) {
    allSubTasks = await getItem("subTasks");
    for (let i = 0; i< allSubTasks.length; i++) {
      if (allSubTasks[i].subTaskName == subTask.subTaskName) {
        subTasksIdArray.push(allSubTasks[i].id);
      }
    }
  }

    
  function getAllSubTaskIndex(subTaskId) {
    for (let i = 0; i< allSubTasks.length; i++) {
      if (allSubTasks[i].subTaskId == subTaskId) {
        return i;
      }
    }
  }
  
  
  function getSubTaskbyId(subTaskId) {
    for (let i = 0; i< allSubTasks.length; i++) {
      if (allSubTasks[i].subTaskId == subTaskId) {
        return allSubTasks[i];
      }
    }
  }

  
/**
 * function saves data to the backend
 * @param {string} key - key for storage
 * @param {object} value - object to store
 */
async function setItem(key, value) {
  const url = `${STORAGE_URL}${key}/`;
  const payload = { key, value };
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}

/**
 * this function loads users from the backend
 * @param - no parameter
 */
async function loadUsers() {
  try {
    users = JSON.parse(await getItem("users"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

//function loginUser() {
//  let error = document.getElementById("error");
//  loadUsers();
//  if (users[0].email == email.value && users[0].password == password.value) {
//    password.classList.remove("border-red");
//    error.style = "display: none;";
//    window.location.href = "summary.html";
//    localStorage.setItem(`currentUser`, `${users[0].name}`);
//    localStorage.setItem(`loggedIn`, true);
//    cacheData();
//  } else {
//    password.classList.add("border-red");
//    error.style = "display: flex;";
//    password.value = "";
//  }
//}





/**
 * Function loads data from the backend for a specific user with user_id
 * @param {number} userId - user id
 */
async function getUserById(userId) {
  const url = `${STORAGE_URL}user/${userId}/`; 
  return fetch(url, { mode: "cors" })
    .then((res) => res.json())
    .then((user) => {
      if (user) {
        return user;
      }
      throw `Could not find user with ID "${userId}".`;
    });
}



/**
 * Function loads data from the backend for a specific user with user_id
 */
async function getCurrentUser() {
  const authToken = getAuthToken();  
  const url = `${STORAGE_URL}users/me/`;
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${authToken}`, 
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((user) => {
      console.log(user);
      return user;
    })
    .catch((error) => {
      console.error("Error:", error.message);
      throw error;
    });
}



/**
 * send mail
 * @param {} - no parameter
 */
async function sendMail2() {
  const formData = new FormData(document.getElementById('contactForm'));
  disableFields();
  email.classList.remove("border-red");
  error.style = "display:none;";
  if (users[0].email == email.value) {
    return true;
  } else {
    email.classList.add("border-red");
    email.value = "";
    error.style = "display:flex;";
    return false;
  }
}


async function sendMail(emailadress) {
  data = {email: emailadress, 
    info: 'needs password reset'};
  email.classList.remove("border-red");
  error.style = "display:none;";
  try {
    const response = await fetch("https://formspree.io/f/xoqobgbr", {
        method: "POST",
        body: data,
        headers: { 'Accept': 'application/json' }
    });
    if (response.ok) {
        alert('Message was sent');
        document.body.classList.add("clicked");
        button.classList.add("clicked");
        await delay(1000);
    } else {
      email.classList.add("border-red");
      email.value = "";
      error.style = "display:flex;";
    }
} catch (error) {
    console.error('Error:', error);
  }
}

/**
 * this delays the following code bei ms milliseconds
 * @param {} - no parameter
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}



/**
 * this function gets the crsf token from the cookies
 * @return csrfToken
 */
async function getCSRFToken() {
  try {
    const response = await fetch('http://localhost:8000/get_csrf_token/', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP-Fehler! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('New token:', data);
    return data.csrfToken;
  } catch (error) {
    console.error('Fehler beim Abrufen des CSRF-Tokens:', error);
    return null;
  }
}



async function getCSRFToken2() {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    .split("=")[1];
    console.log('csrftoken:',cookieValue);
  return cookieValue;
}

/**
 * this function gets the crsf token from the backend
 * @return csrfToken
 */
async function getCSRFToken() {
  try {
    const response = await fetch('http://localhost:8000/get_csrf_token/', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP-Fehler! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('New token:', data.csrfToken);
    return data.csrfToken;
  } catch (error) {
    console.error('Fehler beim Abrufen des CSRF-Tokens:', error);
    return null;
  }
}
