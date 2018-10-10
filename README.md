# GitHub organisation site for GDS

This is the GitHub organisation site for GDS.

It uses Jekyll to build static HTML pages from Markdown-formatted source files,
which are then hosted using GitHub Pages.

[View this site on GitHub Pages](https://alphagov.github.io/).

## Local testing

The site can be built locally for testing using `bundle exec jekyll serve`, which
will also serve it on port 4000.

The site is built into the `_site` directory, which is ignored by git.

**NOTE**
The repository lists will not work when the site is built locally as Jekyll does
not have access to custom variables which are made available by GitHub Pages.

## Maven repository

This site also acts as a repository for Maven plugins that are used for
Scala development on Licensing.
