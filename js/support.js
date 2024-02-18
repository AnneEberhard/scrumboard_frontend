//only for support pages like help, legal notice and privacy policy
//for includeHTML (initTemplat()) see script_Templates.js

  /**
   * this function closes the window
   * @param - no parameter
   */
function closeTab() {
    window.close();
      if (!newTab || newTab.closed || typeof newTab.closed == "undefined") {
      alert("Link wurde in einem neuen Tab geöffnet. Bitte schließen Sie diesen Tab manuell.");
    }
  }
  