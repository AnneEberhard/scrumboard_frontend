/**
 * renders the move buttons for mobile version
 * @param {string} cats - current category of the card
 * @param {string} id - id of the card
 */
function renderMoveBtns(cats, id) {
    document.getElementById(`${id}`).innerHTML += /*html*/ `
              <div class="lastCategory" onclick="moveToLastCat(${cats}, ${id}); stopPropagation(event)"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 14l5-5 5 5H7z"/></svg></div>
              <div class="nextCategory" onclick="moveToNextCat(${cats}, ${id}); stopPropagation(event)"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 10l5 5 5-5H7z"/></svg></div>
          `;
    if (cats == "board_container_bottom_todo") {
      endCategoriesButtons(id,"lastCategory");
    }
    if (cats == "board_container_bottom_done") {
      endCategoriesButtons(id,"nextCategory");
    }
  }

/**
 * hides the move buttons for mobile version at the respective end categories done and todo
 * @param {string} id - id of the card
 * @param {string} categoryClassName - either lastCategory or nextCategory
*/
function endCategoriesButtons(id, categoryClassName) {
    let lastCat = document.getElementById(`${id}`).getElementsByClassName(`${categoryClassName}`);
    lastCat[0].classList.add("d-none");
  }
  
/**
 * searching function for the mobile version, to show task who hast the searched word in title
 */
function searchTasksOnBoardMobile() {
    let searchedTask = document.getElementById("board_input_mobile").value.toUpperCase();
    let searchingElements = document.getElementsByClassName("board_task_container_title");
    searchTask(searchedTask,searchingElements);
  }

/**
 * @returns breakpoint, when screen is in mobile Modus
 */
function isMobileDevice() {
    return window.innerWidth < 900;
  }

  
/**
 * Eventlistner to render board if screen changes between desktop and MobileMode
 */
window.addEventListener("resize", handleScreenResize);

/**
 * to handle screen resizing
 */
function handleScreenResize() {
  if (window.innerWidth < 900 && window.location.pathname === "/board.html") {
    renderBoard();
  } else if (window.innerWidth >= 900 && window.location.pathname === "/board.html") {
    renderBoard();
  }
}