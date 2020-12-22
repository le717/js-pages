<?php
  class Parser {

    /**
    * Compile the page content into the template.
    *
    * @param {array} $fm - The page front matter.
    * @param {string} $content - The page content.
    * @return {string} The compiled page.
    */
    private static function _compilePage($fm, $content) {
      return "<article class=\"page-content {$fm['name']}\">
        <h2 class=\"page-header\">{$fm['pageHeader']}</h2>
        {$content}
      </article>";
    }

    private static function _findFrontMatter($content) {
      // We must have two dividers
      if (substr_count($content, '---') !== 2) {
        throw new Exception('Parser: Invalid page front matter, cannot continue.');
      }

      // Extract the front matter from the page
      preg_match('/---(.+)---/s', $content, $matches);
      return trim($matches[1]);
    }

    private static function _extractFontMatter($fmRaw) {
      $fm = [];
      $fmRaw = preg_split('/[\r\n]/', $fmRaw);

      // Loop through each section, ensuring we have data
      foreach ($fmRaw as $v) {
        if ($v !== "") {
          // Clean up and store the front matter
          $parts = explode(':', $v);
          $parts = array_map('trim', $parts);
          $fm[$parts[0]] = $parts[1];
        }
      }

      return $fm;
    }

    private static function _getFrontMatter($content) {
      return self::_extractFontMatter(self::_findFrontMatter($content));
    }

    private static function _stripFrontMatter($content) {
      $content = str_replace(self::_findFrontMatter($content), '', $content);
      $content = trim(preg_replace('/---/', '', $content));
      return $content;
    }

    public static function parse($name, $content) {
      $fm = self::_getFrontMatter($content);
      $content = self::_stripFrontMatter($content);

      // Add the page name to the front matter data
      $fm['name'] = $name;

      return [
        'frontMatter' => $fm,
        'content' => self::_compilePage($fm, $content)
      ];
    }
  }
