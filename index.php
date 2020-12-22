<?php
  require_once 'php/pages.php';

  // Get the name of the page we want to load,
  // defaulting to the home page
  $pageName = isset($_GET['page']) && _isNotEmpty($_GET['page']) ? strip_tags( $_GET['page']) : 'home';

  // Attempt to load the base page and page fragment
  $basePage = Pages::loadBase($pageName);
  $pageFragment = Pages::load($pageName);

  // If the fragment could not be loaded, load the 404 page
  if (!$pageFragment) {
    $pageFragment = Pages::load('lost');
    $pageName = 'lost';
  }

  // Insert the rendered page into the base document
  $finalPage = str_replace('<!--CONTENT-->', $pageFragment['content'], $basePage);
  echo $finalPage;
