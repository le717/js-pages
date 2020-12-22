"use strict";
const Parser = (function() {
  function _findFrontMatter(content) {
    let execResult,
        regex   = /^---$/gm,
        indices = [];

    // Get the index of each divider
    while (execResult = regex.exec(content)) {
      indices.push(execResult.index);
    }

    // We must have two dividers
    if (indices.length !== 2) {
      throw new Error("Parser: Invalid page front matter, cannot continue.");
    }

    return content.substring(indices[0] + 5,  indices[1]);
  }

  function _extractFontMatter(fmRaw) {
    let fm = {};
    fmRaw = fmRaw.split(/[\r\n]/g);

    // Loop through each section, ensuring we have data
    fmRaw.forEach(v => {
      if (v !== "") {
        // Clean up and store the front matter
        let parts = v.split(":");
        parts = parts.map(part => part.trim());
        fm[parts[0]] = parts[1];
      }
    });

    return fm;
  }

  function _stripFrontMatter(content) {
    content = content.replace(_findFrontMatter(content), "");
    content = content.replace(/---/g, "").trim();
    return content;
  }

  function _getFrontMatter(content) {
    return _extractFontMatter(_findFrontMatter(content));
  }

  /**
   * Compile the page content into the template.
   *
   * @param {object} fm - The page front matter.
   * @param {string} content - The page content.
   * @return {string} The compiled page.
   */
  function _compilePage(fm, content) {
    return `<article class="page-content ${fm.name}">
      <h2 class="page-header">${fm.pageHeader}</h2>
      ${content}
    </article>`;
  }

  function parse(name, content) {
    let fm = _getFrontMatter(content);
    content = _stripFrontMatter(content);

    // Add the page name to the front matter
    fm.name = name;

    return {
      frontMatter: fm,
      content: _compilePage(fm, content)
    };
  }

  return {
    parse: parse
  };
}());
