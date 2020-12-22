# js-pages
> A toy website project from 2017

# Background

I wanted to play with the idea of never fully reloading the page when navigating a website,
but instead perform a background request and inject it into the page. However, it had to _feel_ as
if a page navigation had occurred. Further, I wanted to keep all the individual "pages" in their own
HTML file for separation of content and easier editing. So, I wrote this thing.
It performs basic "front matter" parsing (think Jekyll front-matter format),
performing a background request via `fetch` to load a page, and animates it into view.
It even features a non-recursively loading 404 page and working browser back-forward button support.
All in front-end vanilla JavaScript. How's that for progressive?

As a fallback, because this was 2017, there is a supplementary PHP version of the code that
performs actual page navigation but from the same source files. It works too.

# Usage

Don't use it. The same concept is achieved much better using React, Vue, or the like.

If you want to use it, you just need a static file server, such as the one that comes with Python.

```
python -m http.server --bind 127.0.0.1 8080
```

If you want to make use of the PHP fallback, then run it via some PHP-enabled server.
This was probably written using PHP 5.6 and there's no guarantee it'll work on newer versions.


# License

Public domain. Use it however you want.
