# electron-react-typescript-mobx

### Why use this boilerplate for Desktop Apps, Web Apps, and Hybrid Apps?

When I started building [Electron](http://electron.atom.io/) apps, there were some specific things I wanted that I couldn't find in any of the existing boilerplates.

**[Typescript]()** was critical for me and presumably for you since you wouldn't be reading this if you didn't want it. When I was getting started with [Electron](http://electron.atom.io/), I found lots of examples of how use Typescript for the front-end renderer  but almost no examples of Typescript in the backend main process and zero guidance on using Typescript in both render and main (to say nothing of examples that were debuggable and buildable to shipping apps). This boilerplate is set up to make full typescript support easy, even though it needs to use quite different methods under the hood to support the two different processes.

**[React](https://facebook.github.io/react/)** is my preferred front-end toolkit. If you happen to prefer [Vue.js](http://vuejs.org) or something similar it's probably easy to rip out the React and port this to whatever but you're way out of my personal renderer skillset if you need that.

**Debugging and Hot-Reload** shouldn't be an issue in this day and age but getting them to work with Typescript source code in the Chrome and [VS Code](https://code.visualstudio.com/) debuggers wasn't trivial. I'm currently using the Chrome debugger to debug the front-end renderer process code (which supports Typescript inspection and breakpoints) and the VS Code debugger to debug the back-end main process code. At present on the VS Code/main process side I'm only able to set breakbpoints in the JS code that's auto-generated from the TS code, but given how close the JS and TS code are that's not been a big deal for me and hopefully the Electron team is adding enough Typescript support fast enough that this minor debugging inconvenience will get resolved soon.

**Simultaneous building of Desktop App, Web App, and Hybrid Apps** is huge in my book. Once you start building Electron apps, you realize that >90% of what you're doing is indistinguishable from the work you're doing to build your website and it's crazy to not unify all that shared code in one place. That 10% difference between the Desktop app and the Web app is generally just the Electron back-end main process that exposes the hardware/os capabilities not available to conventional web pages running in a conventional browser. Which brings us to Hybrid Apps where the Desktop app is just a wrapper that pulls the existing pages down from your existing site and then supercharges them by giving them access to hardware/os capabilities so the Desktop app can do more than the browser while still using a common and easily updated codebase. The sample app here shows code sharing between desktop app and web app and shows grabbing a conventional web page from a conventional web server and extending it with additional hybrid capabilities as part of the same app.

**[Security best practices](http://blog.scottlogic.com/2016/03/09/As-It-Stands-Electron-Security.html)** are important when building apps of any sort, and [Electron Hybrid Apps](https://www.blackhat.com/docs/us-17/thursday/us-17-Carettoni-Electronegativity-A-Study-Of-Electron-Security-wp.pdf) in particular because you're potentially connecting untrusted web page content to a process with full trusted access to the user's desktop hardware. Best practices are obviously a practice and process more than a checkbox, but I wanted to do what I could to encourage myself to do the right thing when crafting Electron apps. Electron has a simultaneously simple and complex set of tools for providing interprocess communications between the back-end main process, front-end render process, and any hybrid web app code running electron sandboxed within the browser sandboxed renderer environment. Most of the security-related features in this boilerplate boil down to trying to make it very clear which inter process communication methods are allowed to be exchanged between web view and renderer, and which are allowed between the render and main processes. That's critical because so much of the risk in hybrid electron app coding stems from developers unintentionally exposing main process capabilities to untrusted web app code.

## What does this boilerplate not do out of the box (yet)?

**Hot reloading of the main process** isn't working yet, only the renderer code hot-reloads (though often this is enough). If you can figure this out, pull requests are always appreciated. See https://github.com/electron-userland/electron-compile if you're trying to get this going.

**Installer customization** is quite straightforward and built into the electron-builder package this boilerplate repo uses but I've not personally dug into it or added it to this repo because for historical reasons I tend to use stand-alone installer builders. If you need this and get it running, pull requests are always appreciated. See https://github.com/electron-userland/electron-builder if you're interested.

**Auto-updater support** is the big reason to use the installer capabilities build into electron-builder. I've not hooked it up yet but keep meaning to. If you get it running, pull requests are always appreciated. See https://www.electron.build/auto-update if you're trying to get this going.
  
## Using
  
You'll need [Node.js (v.8.x)](https://nodejs.org) installed on your computer in order to start or build this app. I personally like to use VS Code when working but that's just a personal preference.

-----TODO HERE----

.....Mention strongly-typed support for sass/scss in benefits section above 

.....turn VS Code above into a link....
.....list the recommended VS Code extensions....

First download and install:

```bash
$ git clone https://github.com/yoDon/electron-react-typescript-mobx.git
$ cd electron-react-typescript-mobx
$ npm install
$ npm run start
```





Then use ```npm start``` to build the React/Typescript "client-side" code from src/renderer into wwwroot, build the C# code into an Electron app, and start the neccessary development servers to run the app, or use one of the more specific commands listed below to perform just a part of the process.

AND REMEMBER, don't forget to manually copy the ```./Assets``` folder as described in the previous section and then re-run ```npm start``` to run the complete build of the app

| Command | Effect |
| ------- | ------ |
| ```npm start```  | build the javascript, then the C#, then launch the app |
| ```npm run js``` | build the javascript |
| ```npm run cs``` | build the C#, then launch the app |
| ```npm run cs-build``` | build the C# without launching the app |
| ```npm run js-watch``` | build the javascript and then watch the filesystem for changes |

## Debugging

.... mention npm run start when debugging front-end, and slower debug menu item when debugging main process also (debug menu item invokes npm run build) .....

When the app is running in development mode, you can use the View menu to open the Chrome developer tools and inspect the renderer contents as you would with a normal webpage. If you're on a page with an embedded WebView component, you can use the "Open Inner Dev Tools" button to open a separate copy of Chrome developer tools for the embedded page.

To debug the C# in Visual Studio, just attach to your running application instance by opening the Debug Menu, clicking on "Attach to Process...", and selecting "SampleApp.exe" from the list of processes.

## Organization

The electron webpack expects a specific project structure. That layout can be changed by updating config files but this project is currently set to use the standard electron layout as discussed in https://webpack.electron.build/project-structure

my-project/
├─ src/
│  ├─ main/ -- code for the electron main process
│  │  └─ index.ts
│  ├─ renderer/ -- code for the electron renderer
│  │  └─ index.ts
│  ├─ common/ -- code shared between render and main
│  │
│  ├─ shared/ -- (not part of standard) code shared between electron renderer and website
│  │
│  └─ site/ -- (not part of standard) code for website
│  
└─ static/ -- files needed for project that don't need to be webpacked


The ```src/shared``` folder contains Typescript files shared between ```src/site``` and ```src/renderer```.

The ```src/site``` folder contains the Typescript source of an optional external website to be loaded into the Electron app as a Hybrid Web App.

The ```src/renderer``` folder contains the Typescript source of the Electron app's render content.

```npm run js``` builds ```src/site``` into wwwsite and ```src/renderer``` into wwwroot.

## Notes

This sample is modeled on a static React frontend approach, connecting the frontend HTML to the backend server via Electron's built-in interprocess communication (ipc) calls. That said, the server-side dotnet code actually runs a full ASPNET MVC server, so if you prefer you can easily modify it to use ASPNET views to generate the HTML. In support of this, I left the Home View and Controller in place, and currently just have the Home View redirect the renderer from / to /index.html (which can be found in wwwroot after running ```npm start``` or ```npm run js``` and which contains the generated React code).

I've tried to keep this sample simple so there isn't a lot of extra stuff not everyone needs, but I did include a React WebView wrapper component because it's so common to want to use WebViews in Electron and they're tricky in React and trickier still when using React with Typescript, and I included an example of 
how a WebView can be used to make a Hybrid Web App that loads an existing web page and grants it native
client functionality when the web page is running inside the electron app.

**Enjoy!**