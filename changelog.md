# 🕒 Changelog

This section includes all of the changes made to cop since its first pre-release, for easy tracking of updates and breaking changes.

## [v0.1.4][] <sub><sup><sub>19/11/20</sub></sup></sub>

**Bug fixes:**

-   (TextWalls): Fixed module deleting every message.

## [v0.1.3][] <sub><sup><sub>19/11/20</sub></sup></sub>

**Bug fixes:**

-   Used `PunishmentProvider#parsePunishment()` in `punishment` schema type.

## [v0.1.2][] <sub><sup><sub>19/11/20</sub></sup></sub>

**Bugs:**

-   `punishment` schema type depends on `PunishmentAction.parsePunishment()`, which no longer exists.
    -   **Fixed in v0.1.3.**

**Documentation changes:**

-   Added non-technical guide, explaining how to download source code without git.
    -   Added batchfile `setup` and `start` scripts for Windows.
-   Documented `Client`.
-   Documented `PunishmentProvider`.

**Internal changes:**

-   Created `PunishmentProvider` class.
    -   Created `punishment` property on `Client` class.
    -   Moved most of `PunishmentAction` to it, the latter now acts as a wrapper around the former.
    -   Fixed all of the bugs that came with this change.

## [v0.1.1][] <sub><sup><sub>17/11/20</sub></sup></sub>

**Bugs:**

-   (TextWalls): Every message is deleted.
    -   **Fixed in v0.1.4.**

**Documentation changes:**

-   Created [`changelog.md`](https://github.com/cAttte/cop/blob/master/changelog.md)
    -   Linked changelog and license files to Readme.
-   Created [Update](https://github.com/cAttte/cop/blob/master/docs/update.md) and [Backup](https://github.com/cAttte/cop/blob/master/docs/backup.md) documentation sections.
-   Documented a lot of new stuff under the [Develop](https://github.com/cAttte/cop/blob/master/docs/develop.md) section.

**Bug fixes:**

-   Fixed multiple internal bugs.

**Internal changes:**

-   Created [`createMessageMatcher()`](https://github.com/cAttte/cop/blob/master/src/util/createMessageMatcher.ts) utility function.
    -   Used it in all message modules.

## [v0.1.0][] <sub><sup><sub>16/11/20</sub></sup></sub>

-   Initial pre-release

<!-- references -->

[v0.1.4]: https://github.com/cAttte/cop/releases/tag/v0.1.4
[v0.1.3]: https://github.com/cAttte/cop/releases/tag/v0.1.3
[v0.1.2]: https://github.com/cAttte/cop/releases/tag/v0.1.2
[v0.1.1]: https://github.com/cAttte/cop/releases/tag/v0.1.1
[v0.1.0]: https://github.com/cAttte/cop/releases/tag/v0.1.0
