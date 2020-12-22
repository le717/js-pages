<?php
  require_once 'php/parser.php';

  /**
   * @private
   * Check if the text is empty. Correctly handles non-breaking spaces.
   *
   * @param  string $text.
   * @return boolean true if not empty, false otherwise.
   */
  function _isNotEmpty($text) {
    $text = trim($text, chr(0xC2).chr(0xA0));
    $text = str_replace('&nbsp;', '', $text);
    return (bool) !preg_match('/^\s*$/', $text);
  }

  class Pages {
    private static function _retrievePage($name) {
      return @file_get_contents("_pages/{$name}.html");
    }

    public static function load($name) {
      $page = self::_retrievePage($name);

      // We could not load the page
      if (!$page) {
        return false;
      }

      // Parse the page
      $page = Parser::parse($name, $page);
      return $page;
    }

    public static function loadBase($pageName) {
      // If we have JS support yet are here, we should go back to the JS version
      $redirect = "
  <script>
    if (window.Promise) {
      window.location.href = \"index.html#{$pageName}\";
    };
  </script>";

      // Load the original HTML page and remove the redirect and JavaScript
      $basePage = file_get_contents('index.html');
      $basePage = preg_replace('/<meta http-equiv="refresh".+?>/s', '', $basePage);
      $basePage = preg_replace('/<[\/]?noscript>/s', '', $basePage);
      $basePage = preg_replace('/<script.+><\/script>/s', $redirect, $basePage);
      return $basePage;
    }
  }
