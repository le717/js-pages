"use strict";
(function() {

  let qNavi = document.querySelector(".navi");

  /**
  * Animate the new page into visibility.
   *
   * @param {string} name - The page name.
   */
  function animatePage(name) {
    /**
     * Handle the page `transitionend` event.
     */
    function _eventHandler() {
      document.querySelector(".page-content.old").remove();
      qNewPage.removeEventListener("transitionend", _eventHandler);
    }

    let qNewPage = document.querySelector(`.page-content.${name}`);
    qNewPage.classList.add("animate");

    // Mark the old page for removal.
    // We only need to do this if there is a previous page present
    // For example, if the initial page load 404s, upon loading the 404 page,
    // this would kill it because no previous page was present
    if (document.querySelectorAll(".page-content").length > 1) {
      document.querySelector(".page-content:first-of-type").classList.add("old");

      // Clean up once the page is visible
      qNewPage.addEventListener("transitionend", _eventHandler);
    }

    // Display the page
    // TODO See if this can be done slightly differently, if possible
    setTimeout(() => {
      qNewPage.classList.remove("animate");
    }, 50);
  }


  function _updatePageTitle(title) {
    // We have a blank title, simply append it
    if (!document.title.includes("|")) {
      document.title += ` | ${title}`;
      return true;
    }

    // A title has already been added, replace it with the new one
    let barLoc = document.title.indexOf("|") + 1;
    document.title = `${document.title.substring(0, barLoc)} ${title}`;
    return true;
  }

  function _updatePageHash(hash) {
    // Do not add the hash if initial page load is to home
    if (document.location.hash === "" && hash === "home") {
      return false;
    }

    document.location.hash = hash;
    return true;
  }

  function _pageToLoad(result) {
    // The page is already visible, no need to reload it
    if (!result) {
      return false;
    }

    // A page has been loaded
    result.then(fm => {
      // Update the browser display
      _updatePageTitle(fm.title);

      // Update the active page indication
      let currentPageNavLink = document.querySelector(".navi li.active");
      if (currentPageNavLink) {
        currentPageNavLink.classList.remove("active");
      }

      let pageNavLink = document.querySelector(`.navi .navi-item[data-page=${fm.name}]`);
      if (pageNavLink) {
        pageNavLink.parentElement.classList.add("active");
      }
      return true;

      // The page did not load, pull up the 404 page
    }).catch((err) => {
      console.error(`Page "${err.page}" could not be loaded!`);
      console.error(err.err);

      // Prevent a recursive loop if the 404 page does not load
      if (err.page !== "lost") {
        _pageToLoad(Pages.load("lost", animatePage));
      }
      return false;
    });
  }

  function _findPageToLoad(page, animate) {
    page = (!page ? "home" : page);

    // The user is navigating to a specific page,
    // extract the name from the page hash
    if (page.charAt(0) === "#") {
      page = window.location.hash.match(/#([a-z]*?)$/i)[1].toLowerCase();
    }

    // Check if the page needs to me animated
    if (animate) {
      animate = animatePage;
    }

    // Load the page
    _pageToLoad(Pages.load(page, animate));
  }

  // The navbar was clicked
  qNavi.addEventListener("click", e => {
    // Ensure we clicked a navigation link
    if (e.target.matches("a.navi-item.link")) {
      // Attempt to load the page
      e.preventDefault();
      _updatePageHash(e.target.dataset.page);
    }
  });

  // The URL hash was manually changed
  window.addEventListener("hashchange", () => {
    _findPageToLoad(window.location.hash, true);
  });

  // Initial page load
  window.onload = () => {
    _findPageToLoad(window.location.hash, false);
  };
}());
