// deals with background functions
// for edit functions of board see board_edit.js
// for adding see board_add.js
// for general functions see board.js


/**
  * this function prevents background scroll
*/
function preventBackgroundScroll() {
    document.getElementById('board').style.overflow = 'hidden'; 
}

/**
* this function enables background scroll
*/
function enableBackgroundScroll() {
document.getElementById('board').style.overflow = ''; 
}

/**
* this function disables background scroll
* @param - no param
*/
function disableBackgroundScroll() {
    preventBackgroundScroll();
}
