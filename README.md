# Gust Theme

Gust is a powerful starter theme, designed to give you a head start when building your next Statamic website. It gives you a barebones theme with a seriously powerful build engine to make theme development easier than ever.

It comes with built-in support for custom [TailwindCSS](https://tailwindcss.com) configuration – a simple utility-first framework. It's well documented, easy to customise and is increasingly popular within the Statamic community. And the best bit is all the hard stuff to do with setting up the custom configuration is done for you! The theme is also designed to allow you to add your own styles using SCSS to compile them. Prefer to create components that use BEM-like syntax? That's possible too!

Whatsmore, it makes use of Gulp, SCSS, Webpack and PostCSS to deliver fast, lean and performant style and script files that Goolge will love. Other features include PurgeCSS baked in by default.

Getting up and running is easy!

## Installing

1. Spin up a Statamic site if you haven't already.
2. Download Gust.
3. Drop the theme into the **themes/** folder.

From there, you have two options:

### Code

Go to site/settings/theming.yaml and change the value of theme to `gust`. If the file is blank, simply add `theme: gust` and save. Statamic will do the rest.

### In the CP

Go to Settings -> Theming and select Gust from the dropdown.

## Updating

### 1.1

The only files changed are gulpfile.js and package.json.

Once you've copied these over to your project, run yarn install and it will pull through the necessary packages for BrowserSync.

### 1.1.1
Only package.json & gulpfile.js changed.  

Once you've copied these over to your project, run yarn install and it will pull through the necessary packages for BrowserSync.

Install LibPng for improved image optimization:  
On Mac (use [Homebrew](https://brew.sh)):
- `brew install libpng`
  
On Windows:  
Install [LibPng For Windows](http://gnuwin32.sourceforge.net/packages/libpng.htm)

## Configuration

Before going through these steps, you'll need either Yarn or NPM installed (my preference is Yarn). Once that's done, then follow these steps:

1. Go to **/site/themes/gust** in your terminal.
2. Run `yarn install` or `npm install` depending on your preference.
3. Run `gulp tailwind:init` (This will create your tailwind configuration – **tailwind.config.js** – in the root of the theme.)
4. Run `gulp dev`.

**gulp dev** will run in the background and configure your CSS and JS in the background. You shouldn't need to restart it, unless you accidentally save something that breaks the task. If that happens, fix the issue and then re-run `gulp dev`.

**gulp preflight** will run compile all of your assets, but will also run purgeCSS. This is the task you want to run when you're getting ready to push a site to production. I don't recommend running it as part of a CI as there is a chance that if you haven't whitelisted a class in the purgeCSS configuration, you may find it breaks your site without noticing. 

### BrowserSync [New in 1.1.0]

If you want to make use of BrowserSync, you need to open up gulpfile.js and add the url of your local site to the file. Save and run **gulp dev** and it will initialise BrowserSync for you in a new window.

### [New in 1.1.1]
- Browsersync now accepts an array of browsers you want to sync to. Accepted options are listed here: [BrowserSync Docs](https://browsersync.io/docs/options#option-browser)
- New task to clear Gulp cache
- Running `gulp dev` now generates app.css & app.js files, while `gulp preflight` generates app.min.css & app.min.js files.
- Much improved image optimization, file sizes are now >500%+ smaller than before, with very little quality loss. Guaranteed to make Google Pagespeed happy.

## Folder Structure

The folder structure is based on years of experience building and maintaining complex websites. However, that doesn't mean if you're building a simple site, you won't benefit!

### Assets

Within assets, you'll find three folders:

- /images
- /scripts
- /styles

#### Images
If you want to include images that will be a part of the theme, you can add them here. Then simply run `gulp images` and it will optimise them and spit them out in a folder called **/images**.

###### Image Cache Helper
 - If for some reason you need to re-run the `gulp images` task for all images, you can clear the image cache by running `gulp cache:clear`.  

#### Scripts
This is where you place all your core JS files. Don't put any actual code into the app.js file. Instead, require them in. Store any custom code in the components folder. Webpack will automatically compile them into one file and minify the code. It will then output it into the **/js** folder as a file called `app.min.js`. The theme layout is coded to automatically pick this up.

#### Styles
This is where all your uncompiled SCSS code is stored. Within this folder, there are two folders:

- /components
- /utilties
- _mixins.scss
- app.scss

The `app.scss` file is the main file. If you open it up, you'll see it imports a number of files. Don't edit this file directly unless you want to add a new folder. If you want to call in new components, go into the components folder and open the `_all.scss` file and import it there. Same goes for utilities.

## Support
For any help installing or customising the theme, add an issue on the GitHub Repo.
