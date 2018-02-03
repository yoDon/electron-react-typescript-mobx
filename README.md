# electron-react-typescript-mobx

<video width="480" height="320" controls="controls">
<source src="/misc/output.mp4?raw=true" type="video/mp4">
</video>

## tl;dr:

```bash
$ git clone https://github.com/yoDon/electron-react-typescript-mobx.git
$ cd electron-react-typescript-mobx
$ npm install
$ npm run start
```

## Why use this boilerplate for Desktop Apps, Web Apps, and Hybrid Apps?

When I started building [Electron](http://electron.atom.io/) apps, there were some specific things I wanted that I couldn't find in any of the existing boilerplates.

**[Typescript]()** was critical for me and presumably for you since you wouldn't be reading this if you didn't want it. When I was getting started with [Electron](http://electron.atom.io/), I found lots of examples of how use Typescript for the front-end renderer process but almost no examples of how to use Typescript in the backend main process and zero guidance on using Typescript in both render and main (to say nothing of examples that were debuggable and buildable to shipping apps). This boilerplate is designed to make full typescript support easy, even though it needs to use quite different methods under the hood to support the two different processes (the renderer can use source-maps and the Typescript debugging built into the Chrome debugger to make debugging easy, but as of this writing the main process requires actual old-school javascript which means under the hood this needs to run the typescript complier tsc to generate old-school *.js files from your *.ts files before launching electron).

**Strongly-typed CSS/SCSS/SASS support** should be a pretty obvious want for anyone that likes using Typescript. Let the tools help you get the CSS right and manage the complexity properly. The libraries I'm using to provide the strongly-typed \*.d.ts descriptor files for the \*.css/\*.scss stylesheets are very convenient but they do require you to do an initial build or pack to generate the \*.d.ts files from the \*.css/\*.scss source. That sounds like an annoyance but I personally haven't found it to be much of an issue in practice.

**[React](https://facebook.github.io/react/)** is my preferred front-end toolkit. If you happen to prefer [Vue.js](http://vuejs.org) or something similar it's probably easy to rip out the React and port this to whatever but you're way out of my personal renderer skillset if you need that.

**Debugging and Hot-Reload** shouldn't be an issue in this day and age but getting them to work with Typescript source code in the Chrome and [VS Code](https://code.visualstudio.com/) debuggers wasn't trivial. I'm currently using the Chrome debugger to debug the front-end renderer process code (which supports Typescript inspection and breakpoints) and the VS Code debugger to debug the back-end main process code. At present on the VS Code/main process side I'm only able to set breakbpoints in the JS code that's auto-generated from the TS code, but given how close the JS and TS code are that's not been a big deal for me and hopefully the Electron team is adding enough Typescript support fast enough that this minor debugging inconvenience will get resolved soon.

**Simultaneous building of Desktop App, Web App, and Hybrid Apps** is huge in my book. Once you start building Electron apps, you realize that >90% of what you're doing is indistinguishable from the work you're doing to build your website and it's crazy to not unify all that shared code in one place. That 10% difference between the Desktop app and the Web app is generally just the Electron back-end main process that exposes the hardware/os capabilities not available to conventional web pages running in a conventional browser. Which brings us to Hybrid Apps where the Desktop app is just a wrapper that pulls the existing pages down from your existing site and then supercharges them by giving them access to hardware/os capabilities so the Desktop app can do more than the browser while still using a common and easily updated codebase. The sample app here shows code sharing between desktop app and web app and shows grabbing a conventional web page from a conventional web server and extending it with additional hybrid capabilities as part of the same app.

**[Security best practices](http://blog.scottlogic.com/2016/03/09/As-It-Stands-Electron-Security.html)** are important when building apps of any sort, and [Electron Hybrid Apps](https://www.blackhat.com/docs/us-17/thursday/us-17-Carettoni-Electronegativity-A-Study-Of-Electron-Security-wp.pdf) in particular because you're potentially connecting untrusted web page content to a process with full trusted access to the user's desktop hardware. Best practices are obviously a practice and process more than a checkbox, but I wanted to do what I could to encourage myself to do the right thing when crafting Electron apps. Electron has a simultaneously simple and complex set of tools for providing interprocess communications between the back-end main process, front-end render process, and any hybrid web app code running electron sandboxed within the browser sandboxed renderer environment. Most of the security-related features in this boilerplate boil down to trying to make it very clear which inter process communication methods are allowed to be exchanged between web view and renderer, and which are allowed between the render and main processes. That's critical because so much of the risk in hybrid electron app coding stems from developers unintentionally exposing main process capabilities to untrusted web app code. 

## What does this boilerplate not do out of the box (yet)?

**Hot reloading of the main process** isn't working yet, only the renderer code hot-reloads (though often this is enough). If you can figure this out, pull requests are always appreciated. See https://github.com/electron-userland/electron-compile if you're trying to get this going.

**Installer customization** is quite straightforward and built into the electron-builder package this boilerplate repo uses but I've not personally dug into it or added it to this repo because for historical reasons I tend to use stand-alone installer builders. If you need this and get it running, pull requests are always appreciated. See https://github.com/electron-userland/electron-builder if you're interested.

**Auto-updater support** is the big reason to use the installer capabilities build into electron-builder. I've not hooked it up yet but keep meaning to. If you get it running, pull requests are always appreciated. See https://www.electron.build/auto-update if you're trying to get this going.
  
## Using this boilerplate
  
You'll need [Node.js (v.8.x)](https://nodejs.org) installed on your computer in order to start or build this app. I personally like to use [VS Code](https://code.visualstudio.com/) as an editor for this sort of thing but that's just a personal preference. If you do use [VS Code](https://code.visualstudio.com/) you'll want to install a couple editor extensions:
[CSS Modules](https://marketplace.visualstudio.com/items?itemName=clinyong.vscode-css-modules),
[Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome),
[TSLint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint).

### Download, install, and launch the boilerplate:

```bash
$ git clone https://github.com/yoDon/electron-react-typescript-mobx.git
$ cd electron-react-typescript-mobx
$ npm install
$ npm run start
```

The above commands will build the source code under ```/src``` into a pair of html files (one for the electron app, the other for the website) and a pair of bundled JS files (same purposes) that end up under ```/dist```, and 

### Additonal npm run script commands available:

| package.json commands | Effect |
| ------- | ------ |
| ```npm run start```  | Build the typescript and launch the app |
| ```npm run pack-dev``` | Use tsc to transcode the ```/src/main``` *.ts files into *.js because the electron main process currently needs pure javascript (the generated *.js files sit next to the source *.ts files), and then calls webpack twice to build both website and renderer versions of the code (```npm run pack-dev``` is called by ```npm run start```|
| ```npm run pack-prod``` | Similar to ```npm run pack-dev``` but uses a different webpack configuration that targets stand-alone electron apps rather than the locally hosted developer-friendly wrappers that ```npm run pack-dev``` targets (```npm run pack-prod``` is called by ```npm run build-win```, ```npm run build-osx```, and ```npm run build-linux```) |
| ```npm run start-server``` | Start the local webpack-dev-server and stay live to watch the file system and perform hot-reloads (called by ```npm run start```) |
| ```npm run start-electron``` | Start the local electron wrapper (called by ```npm run start```) |
| ```npm run build-debug``` | Build just the local platform's electron variant (called by ```npm run build``` which is called by the Visual Studio debug menu item) |
| ```npm run build-win``` | Build a windows executable into ```/electron``` (this command runs on Windows machines)|
| ```npm run build-mac``` | Build an OSX executable into ```/electron``` (this command runs on Macs)|
| ```npm run build-linux``` | Build a linux executable into ```/electron```  (this command runs on Linux machines)|
| ```npm run build``` | Build a debuggable version on the local platform (called by the VS Code debug menu item) |
| ```npm run asarlist``` | Electron applications store resources in a packed asar file. This command lists the filenames contained in the build **windows** asar |

## Debugging

Electron apps are split into two processes, the renderer process and the main process, and the renderer is further split into two pieces if you use a Hybrid App approach to host a conventional website in the app for connection to local operating system resources and hardware.

The renderer process is easy to debug using the Chrome debugger built into the Electron renderer. Launch any form of the app (```npm run start``` will build and launch the fastest and gives you hot reload support, but you can also work with a full built executable via ```npm run build-win``` or similar). Use the "View/Toggle Developer Tools" menu item to show the integrated Chrome debugger for the renderer. When using ```npm run start``` you'll have full Typescript/source map code debugging capabilities in the app. 

If you navigate in the app UI to the Hybrid App page and then into the Counter page within that site, you can use the "Open Inner Dev Tools" button in the app to open a second Chrome debugger panel that provides access to the internal, electron-sandboxed webpage hosted within the app.

Debugging the main process is currently a bit more involved. In the VS Code editor, open one of the *.js files under src/main that were generated from the source *.ts files and set breakpoints as desired. Use the "Debug/Start Debugging" menu item in the VS Code editor to build and launch a debug version of the app (among other things the menu item will execute ```npm run build``` behind the scenes, which is why we have ```npm run build``` set as an alias of ```npm run build-debug```). The app will build and launch and you can hit main breakpoints and inspect values in the VS Code editor. You can also continue to use the integrated Chrome debugger to debug the renderer process as described above.

## Organization

    my-project/
    ├─ dist/ -- html and js bundles built by npm run pack-dev or similar
    ├─ electron/ -- electron executables built by npm run build-win or similar
    ├─ src/
    │  ├─ main/ -- code for the electron main process (the *.ts files are used to make *.js files)
    │  ├─ renderer/ -- code for the electron renderer
    │  ├─ shared/ -- code shared between electron renderer and website
    │  └─ site/ -- code for website
    └─ static/ -- any files needed for the electron app that don't need to be webpacked

## Stores and Inter Process Communications (ipc)

I personally prefer [MobX](https://mobx.js.org/getting-started.html) stores to [Redux](https://redux.js.org/) stores because Redux always makes me feel like I'm typing essentially the same thing in three different places anytime I want to add or change anything. 

I've implemented a pattern here where stores in the renderer process can have a matching storeHandler in the main process. This pairing provides a way of associating renderer<->main api or ipc communications with stores. I've similarly implemented a pattern where renderer stores and Hybrid App hosted stores pair up and keep each other in sync (since in general it's the same code/same files being shared between the electron renderer and the website hosting the page loaded in the Hybrid App). Most of that work gets handled in the base classes for the stores and the store handlers, but there is a bit of store developer responsibility to determin what data to sync and how to sync it. See ```/src/shared/stores/counter.ts``` and ```/src/main/storeHandlers/CounterHandler.ts``` for example.

I'm not sure I like the naming conventions I've setup here for the ipc security model, but fortunately if you want something different it would be pretty easy to change. 

The renderer talks to main by calling ```sendR2m(channelName, data)``` and main talks to the renderer by calling ```replyR2m(channelName, data)```. Either process can initiate calls, the send and reply convention is just meant to make the channels feel bi-directional but distinct. R2m channel names are required to start with "r2m-" to make them easily identifiable when reading the code and R2m replies are required to end with "-reply" to make them easily identifiable and keep the channelName surgery to a minimum when doing automated responses to messages (I viewed appending or removing "-reply" from the end of the channelName as simpler and safer than doing replaces and regexp processing for things like converting the "r2m-" into "m2r-"). All of that is very much personal preferances and easy for you to change if you want something different. In all cases the channelName provided by the caller is the base channelName without the "-reply" on the end (to make the channels look/feel bi-directional and leave the details of the name mangling as a low-level platform responsibility). Processes similarly register to receive ipc messages by calling methods like ```OnR2m(channelName, handler)``` or ```OnR2mReply(channelName, handler)```. In a Hybrid App, the inner WebView talks to the renderer via W2r channels that follow similar rules as the R2m channels. 

The send\* methods and on\* methods whitelist the allowed channel names to make sure they conform to the rules but from a security standpoint it's the responsibility of the receiver using the on call to register a command that's really responsible for caring about and enforcing the restrictions. The whitelisting in the send commands is primarily a convenience to increase the odds that typos in channel names get caught early in the process.

**Enjoy!**