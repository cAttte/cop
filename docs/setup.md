# 🔨 Setup

This section will show you how to install cop to your computer. Once you're done with this, head over to the [Configure][docs/configure] section!

-   [If you're _not_ into technical stuff](#if-youre-into-technical-stuff)
    -   [If you're on Windows](#if-youre-on-windows)
    -   [If you're on any other OS](#if-youre-on-any-other-os)
-   [If you're into technical stuff](#if-youre-technical-stuff)

**You will need to install [Node.js][nodejs] to run cop. The `LTS` version should be fine.**

## If you're _not_ into technical stuff

Head over to cop's [Releases][], and click on the `Source code (zip)` button from the latest stable release (or an older one, if you're into that... just don't download a 3 year old release, please?).

_If you're a professional risk-taker and love your software with extra bugs, you can also download the source code from the latest revision. Just click on the green `Code` button on the main page and then on `Download ZIP`._

Once you've acquired this neat ZIP, you can extract it with your [favorite][zip-1] [unzipping][zip-2] [tool][zip-3] into your [favorite folder][folder].

### If you're on Windows

You can double-click on the `setup.bat` file, under the `windows/` folder.

### If you're on any other OS

You'll have to run these two commands from your terminal. Make sure you've browsed into the cop directory (with the `cd` command):

    npm install
    npm run build

## If you're into technical stuff

Clone the repo to your computer with [git][]:

    $ git clone https://github.com/cAttte/cop.git
    $ cd cop

Install the dependencies with [npm][]:

    $ npm install

Build the code to pure JavaScript:

    $ npm run build

<!-- references -->

[docs/configure]: https://github.com/cAttte/cop/blob/master/docs/configure.md
[releases]: https://github.com/cAttte/cop/releases/
[nodejs]: https://nodejs.org/en/
[zip-1]: https://www.7-zip.org/
[zip-2]: https://www.win-rar.com/
[zip-3]: https://theunarchiver.com/
[folder]: https://xkcd.com/981/
[git]: https://git-scm.com/
[npm]: https://www.npmjs.com/
