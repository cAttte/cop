# 🤝 Contribute

_For actual development help, check out the [Develop][docs/develop] section_. This section of the docs tells you what to do (and how) to contribute directly to cop. Read away!

## Commit messages

cop's development uses a superset of the [Conventional Commits][conventional-commits] specification, similar to Angular's commit message guidelines. The possible types are:

-   **fix:** A bug fix.
-   **feat:** A new feature.
-   **refactor:** A code change that does not add or fix anything.
-   **style:** A code change that only applies to code style (eg, comments).
-   **docs:** A change to the documentation.
-   **chore:** A non-code change, normally done to configuration files or datasets.

Conventional Commits can also include a scope in parentheses, after the type. This scope specifies which part of the codebase the commit applies to.

For example, if you're updating a dependency you could write the commit type as `chore(deps):`, if you're editing this file, `docs(contribute):`, or if you're fixing a bug on the main file, `fix(index):`. If the commit applies to many files, you can use the `(*)` scope.

The actual commit message (after the commit type and scope) must start with lowercase, be in present tense and imperative mood (eg, `change something`, not `changed something` or `changes something`). When in doubt, check cop's [commit history][history]!

Your Pull Request is most likely not going to be rejected because of your commit messages. These are just guidelines, not rules.

<!-- references -->

[docs/develop]: https://github.com/cAttte/cop/blob/master/docs/develop.md
[conventional-commits]: https://www.conventionalcommits.org/en/v1.0.0/
[history]: https://github.com/cAttte/cop/commits/master
