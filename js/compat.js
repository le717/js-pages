"use strict";
// Fallback to PHP if Promises are not supported
if (!window.Promise) {
  window.location.href = "index.php?page=" + (!window.location.hash ? "home" : window.location.hash.substr(1));
}
