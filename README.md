# statamic-tailwind-starter-theme

Gust is a starter theme that is designed to give you a solid foundation upon which to build your Statamic sites. Much like the default blank theme you can spin up through the Statamic CLI, it provides you with a default layout and template with minimal markup. It also doesn't come with with any partials, though there is a partial folder there to make things easier during setup.

The real magic is in the CSS and JS. Gust is designed to give you a custom TailwindCSS configuration out of the box. It's powered by Gulp, Webpack and PostCSS, but don't worry – you don't need to know how to configure them – it's already set up out of the box.

##Installing

1. Spin up a Statamic site if you haven't already.
2. Download Gust.
3. Drop the theme into the themes folder.

From there, you have two options:

###Code

Go to site/settings/theming.yaml and change the value of theme to `gust`.

###In the CP

Go to Settings -> Theming and select Gust from the dropdown.

##Configuration

Before going through these steps, you'll need either Yarn or NPM installed (my preference is Yarn). Once that's done, then follow these steps:

1. Go to **/site/themes/gust** in your terminal.
2. Run `yarn install` or `npm install` depending on your preference.
3. Run `gulp tailwind:init` (This will create your tailwind configuration – **tailwind.config.js** – in the root of the theme.)
4. Run `gulp dev`.

**gulp dev** will run in the background and configure your CSS and JS in the background. You shouldn't need to restart it, unless you accidentally save something that breaks the task. If that happens, fix the issue and then re-run `gulp dev`.
