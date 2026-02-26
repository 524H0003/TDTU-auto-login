import { buildSync } from "esbuild";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import React from "react";
import { renderToString } from "react-dom/server";

import PopupPage from "./src/popup";

const fullHtml = (
  <html>
    <head>
      <meta charSet="utf-8" />
    </head>
    <body>
      <PopupPage />
    </body>
  </html>
);

buildSync({
  entryPoints: ["src/**/*.ts"],
  bundle: false,
  outdir: "./dist",
  format: "cjs",
  target: ["esnext"],
  minify: false,
  sourcemap: false,
});

if (!existsSync("./dist")) mkdirSync("./dist");
writeFileSync("./dist/popup.html", renderToString(fullHtml));
