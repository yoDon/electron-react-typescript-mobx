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