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
