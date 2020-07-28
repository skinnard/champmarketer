/* eslint-disable */
const autoprefixer = require("gulp-autoprefixer"),
  browserSync = require("browser-sync"),
  cleanCSS = require("gulp-clean-css"),
  copyDepsYaml = "./copydeps.yml",
  cssImporter = require("node-sass-css-importer")({
    import_paths: ["./scss"],
  }),
  del = require("del"),
  eslint = require("gulp-eslint"),
  gulp = require("gulp"),
  log = require("fancy-log"),
  newer = require("gulp-newer"),
  path = require("path"),
  reload = browserSync.reload,
  rename = require("gulp-rename"),
  rollup = require("rollup"),
  rollupBabel = require("rollup-plugin-babel"),
  rollupCommonjs = require("rollup-plugin-commonjs"),
  rollupResolve = require("rollup-plugin-node-resolve"),
  rollupUglify = require("rollup-plugin-uglify").uglify,
  sass = require("gulp-sass"),
  sourcemaps = require("gulp-sourcemaps"),
  themeYaml = "./theme.yml",
  year = new Date().getFullYear(),
  yaml = require("yamljs"),
  data = require("gulp-data"),
  {src, task}= require('gulp');
  ghPages = require("gulp-gh-pages"),
  nunjucksRender = require("gulp-nunjucks-render");

let copyDeps = yaml.load(copyDepsYaml);
let theme = yaml.load(themeYaml);

const babelConfig = {
  presets: [
    [
      "@babel/env",
      {
        loose: true,
        modules: false,
        exclude: ["transform-typeof-symbol"],
      },
    ],
  ],
  plugins: ["@babel/plugin-proposal-object-rest-spread"],
  env: {
    test: {
      plugins: ["istanbul"],
    },
  },
  exclude: "node_modules/**", // Only transpile our source code
  externalHelpersWhitelist: [
    // Include only required helpers
    "defineProperties",
    "createClass",
    "inheritsLoose",
    "defineProperty",
    "objectSpread2",
  ],
};

getPaths = () => {
  return {
    here: "./",
    pages: {
      folder: "pages",
      all: ["pages/**/*"],
      html: "pages/*.html",
      liquid: "pages/**/*.liquid",
      liquidRoot: "pages/",
      includes: "pages/include/",
      layouts: "pages/layouts",
    },
    js: {
      all: "js/**/*",
      bootstrap: {
        all: [
          "./js/bootstrap/util.js",
          "./js/bootstrap/alert.js",
          "./js/bootstrap/button.js",
          "./js/bootstrap/carousel.js",
          "./js/bootstrap/collapse.js",
          "./js/bootstrap/dropdown.js",
          "./js/bootstrap/modal.js",
          "./js/bootstrap/tooltip.js",
          "./js/bootstrap/popover.js",
          "./js/bootstrap/scrollspy.js",
          "./js/bootstrap/toast.js",
          "./js/bootstrap/tab.js",
        ],
        index: "./js/bootstrap/index.js",
      },
      mrare: {
        all: "js/mrare/**/*.js",
        index: "js/mrare/index.js",
      },
    },
    scss: {
      folder: "scss",
      all: "scss/**/*",
      root: "scss/*.scss",
      themeScss: [
        "scss/theme.scss",
        "!scss/user.scss",
        "!scss/user-variables.scss",
      ],
    },
    assets: {
      all: "templates/pages/assets/**/*",
      folder: "templates/pages/assets",
      allFolders: [
        "templates/pages/assets/css",
        "templates/pages/assets/img",
        "templates/pages/assets/fonts",
        "templates/pages/assets/video",
      ],
    },
    css: {
      folder: "assets/css",
    },
    fonts: {
      folder: "assets/fonts",
      all: "assets/fonts/*.*",
    },
    images: {
      folder: "assets/img",
      all: "assets/img/*.*",
    },
    videos: {
      folder: "assets/video",
      all: "assets/video/*.*",
    },
    dist: {
      packageFolder: "",
      folder: "dist",
      pages: "dist/pages",
      all: "dist/**/*",
      assets: "dist/assets",
      img: "dist/assets/img",
      css: "dist/assets/css",
      scssSources: "dist/scss",
      js: "dist/assets/js",
      jsSources: "dist/js",
      fonts: "dist/assets/fonts",
      video: "dist/assets/video",
      documentation: "dist/documentation",
      exclude: ["!**/desktop.ini", "!**/.DS_store"],
    },
    copyDependencies: copyDeps,
  };
};

let paths = getPaths();

// DEFINE TASKS

gulp.task("clean:dist", function (done) {
  del.sync(paths.dist.all, {
    force: true,
  });
  done();
});

// Add in nunjucks templating language
gulp.task("nunjucks", function () {
  // Gets .html and .nunjucks files in pages
  return (
    gulp
      .src("./templates/pages/**/*.+(html|nunjucks|njk)")
      // Renders template with nunjucks
      // Adding data to Nunjucks
      .pipe(
        data(function () {
          return require("./data.json");
        })
      )
      .pipe(
        nunjucksRender({
          path: [
            "./templates/layouts/",
            "./templates/partials/",
            "./templates/pages/",
            "./templates/partials/home-page/",
          ],
        })
      )
      // output files in app folder
      .pipe(gulp.dest(paths.dist.folder))
      .pipe(newer(paths.dist.folder))
      .pipe(
        reload({
          stream: true,
        })
      )
  );
});

// Copy html files to dist
// gulp.task('html', function () {
//   return gulp.src(paths.pages.all, {
//       base: paths.pages.folder
//     })
//     .pipe(newer(paths.dist.folder))
//     .pipe(gulp.dest(paths.dist.folder))
//     .pipe(reload({
//       stream: true
//     }));
// });

gulp.task("sass", function () {
  return gulp
    .src(paths.scss.themeScss)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        importer: [cssImporter],
      }).on("error", sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(
      browserSync.stream({
        match: "**/theme*.css",
      })
    );
});

gulp.task("sass-min", function () {
  return gulp
    .src(paths.scss.themeScss)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        importer: [cssImporter],
      }).on("error", sass.logError)
    )
    .pipe(
      cleanCSS({
        compatibility: "ie9",
      })
    )
    .pipe(autoprefixer())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(
      browserSync.stream({
        match: "**/theme*.css",
      })
    );
});

gulp.task("bootstrapjs", async (done) => {
  let fileDest = "bootstrap.js";
  const banner = `/*!
  * Bootstrap v${theme.bootstrap_version}
  * Copyright 2011-${year} The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
  */`;
  const external = ["jquery", "popper.js"];
  const plugins = [
    rollupBabel(babelConfig),
    rollupUglify({
      output: {
        comments: "/^!/",
      },
    }),
  ];
  const globals = {
    jquery: "jQuery", // Ensure we use jQuery which is always available even in noConflict mode
    "popper.js": "Popper",
  };

  const bundle = await rollup.rollup({
    input: paths.js.bootstrap.index,
    external,
    plugins,
  });

  await bundle.write({
    file: path.resolve(__dirname, `./${paths.dist.js}${path.sep}${fileDest}`),
    banner,
    globals,
    format: "umd",
    name: "bootstrap",
    sourcemap: true,
  });
  // Reload Browsersync clients
  reload();
  done();
});

gulp.task("mrarejs", async (done) => {
  gulp.src(paths.js.mrare.all).pipe(eslint()).pipe(eslint.format());

  let fileDest = "theme.js";
  const banner = `/*!
  * ${theme.name}
  * Copyright 2018-${year} Medium Rare (${theme.purchase_link})
  */`;
  const external = [...theme.scripts.external];
  const plugins = [
    rollupCommonjs(),
    rollupResolve({
      browser: true,
    }),
    rollupBabel(babelConfig),
    theme.minify_scripts === true
      ? rollupUglify({
          output: {
            comments: "/^!/",
          },
        })
      : null,
  ];
  const globals = theme.scripts.globals;

  const bundle = await rollup.rollup({
    input: paths.js.mrare.index,
    external,
    plugins,
    onwarn: function (warning) {
      // Skip certain warnings
      if (warning.code === "THIS_IS_UNDEFINED") {
        return;
      }
      // console.warn everything else
      console.warn(warning.message);
    },
  });

  await bundle.write({
    file: path.resolve(__dirname, `./${paths.dist.js}${path.sep}${fileDest}`),
    banner,
    globals,
    format: "umd",
    name: "theme",
    sourcemap: true,
    sourcemapFile: path.resolve(
      __dirname,
      `./${paths.dist.js}${path.sep}${fileDest}.map`
    ),
  });
  // Reload Browsersync clients
  reload();
  done();
});

// Assets
gulp.task("copy-assets", function () {
  return gulp
    .src(paths.assets.all, {
      base: paths.assets.folder,
    })
    .pipe(newer(paths.dist.assets))
    .pipe(gulp.dest(paths.dist.assets))
    .pipe(
      reload({
        stream: true,
      })
    );
});

gulp.task("deps", async (done) => {
  await paths.copyDependencies.forEach(function (filesObj) {
    let files;
    if (typeof filesObj.files == "object") {
      files = filesObj.files.map((file) => {
        return `${filesObj.from}/${file}`;
      });
    } else {
      files = `${filesObj.from}/${filesObj.files}`;
    }

    gulp.src(files).pipe(gulp.dest(filesObj.to, { overwrite: true }));
  });
  done();
});

// watch files for changes and reload
gulp.task("serve", function (done) {
  browserSync({
    server: {
      baseDir: "./dist",
      index: "index.html",
    },
  });
  done();
});

gulp.task("watch", function (done) {
  // PAGES
  // Watch .nunjucks pages as they can be recompiled individually
  gulp.watch(
    [
      "templates/layouts/**/*",
      "templates/partials/**/*",
      "templates/pages/**/*",
      "templates/pages/home-page/**/*",
    ],
    {
      cwd: "./",
    },
    gulp.series("nunjucks", function reloadPage(done) {
      reload();
      done();
    })
  );

  // Watch regular pages and compile to dist
  // gulp.watch(['pages/**/*'], {
  //   cwd: './'
  // }, gulp.series('html', function reloadPage(done) {
  //   reload();
  //   done();
  // }));

  // SCSS
  // Any .scss file change will trigger a sass rebuild
  gulp.watch(
    [paths.scss.all],
    {
      cwd: "./",
    },
    gulp.series("sass")
  );

  // JS
  // Rebuild bootstrap js if files change
  gulp.watch(
    [...paths.js.bootstrap.all],
    {
      cwd: "./",
    },
    gulp.series("bootstrapjs")
  );

  // Rebuild mrare js if files change
  gulp.watch(
    [paths.js.mrare.all],
    {
      cwd: "./",
    },
    gulp.series("mrarejs")
  );

  // Rebuild mrare js if files change
  const assetsWatcher = gulp.watch(
    [paths.assets.all, ...paths.assets.allFolders],
    {
      cwd: "./",
    },
    gulp.series("copy-assets")
  );

  assetsWatcher.on("change", function (path) {
    console.log("File " + path + " was changed");
  });

  assetsWatcher.on("unlink", function (path) {
    const changedDistFile = path.resolve(
      paths.dist.assets,
      path.relative(path.resolve(paths.assets.folder), event.path)
    );
    console.log("File " + path + " was removed");
    del.sync(path);
  });

  done();
  // End watch task
});

task("deploy", () => src("./dist/**/*").pipe(ghPages()));

gulp.task(
  "default",
  gulp.series(
    "clean:dist",
    "copy-assets",
    gulp.series("nunjucks", "sass", "sass-min", "bootstrapjs", "mrarejs"),
    gulp.series("serve", "watch")
  )
);

gulp.task(
  "build",
  gulp.series(
    "clean:dist",
    "copy-assets",
    gulp.series("nunjucks", "sass", "sass-min", "bootstrapjs", "mrarejs")
  )
);
