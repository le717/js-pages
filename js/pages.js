"use strict";
const Pages = (function() {
  /**
   * Perform an AJAX request.
   *
   * @param {string} url - The URL to fetch.
   * @return {Promise} Promise, as returned.
   */
  function _performFetch(url) {
    // TODO Actually cache when released
    return window.fetch(url, { method: "get", cache: "reload" });
  }

  /**
   * Check if the current page is in the DOM.
   *
   * @param {string} name - The page name.
   * @return {boolean} True if page is in the DOM, false otherwise.
   */
  function _isVisible(name) {
    return !!document.querySelector(`.page-content.${name}`);
  }

  /**
   * Insert the page into the DOM.
   *
   * @param {string} page - The compiled HTML to insert.
   */
  function _insertPage(page) {
    document.querySelector(".page-content-wrapper").insertAdjacentHTML("beforeend", page);
  }

  /**
   * Retrieve a page via Fetch.
   *
   * @param {string} name - The page name.
   * @return {Promise} Resolved if the page was retrieved, rejected otherwise.
   */
  function _retrievePage(name) {
    return _performFetch(`_pages/${name}.html`).then(r => {
      console.info("Loaded via fetch");
      return Promise.resolve(r);

      // We could not load the page
    }).catch(err => {
      console.error("Could not load page");
      return Promise.reject(err);
    });
  }

  /**
   * Load a page.
   *
   * @param {string} name - The page name.
   * @param {function} cb - Callback method once the page is loaded
   *                        and inserted into the page.
   */
  function load(name, cb) {
    // Default parameter values
    cb = (!cb ? () => {} : cb);

    // Page is already visible, silently no-op
    if (_isVisible(name)) {
      return false;
    }

    // Retrieve the page and extract the text
    console.info(`Loading page: ${name}`);

    return _retrievePage(name)
    .then(r => {
      return r.text();

      // Now compile and insert the page into the site
    }).then(body => {
      let page = Parser.parse(name, body);
      _insertPage(page.content);
      cb(name);
      return Promise.resolve(page.frontMatter);

      // Catch any errors
    }).catch(err => {
      return Promise.reject({err: err, page: name});
    });
  }

  // Define public API
  return {
    load: load
  };
}());

