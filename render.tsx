import { buildSync } from "esbuild";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import React from "react";
import { renderToString } from "react-dom/server";

const fullHtml = (
  <html>
    <head>
      <meta charSet="utf-8" />
    </head>
    <body>
      <div id="root"></div>
      <script src="index.js"></script>
    </body>
  </html>
);

buildSync({
  entryPoints: ["src/**/*.ts*"],
  bundle: true,
  outdir: "./dist",
  format: "cjs",
  minify: false,
  sourcemap: false,
  platform: "browser",
});

if (!existsSync("./dist")) mkdirSync("./dist");
writeFileSync("./dist/popup.html", renderToString(fullHtml));
