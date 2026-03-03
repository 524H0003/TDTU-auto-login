import { config } from "dotenv";
import { buildSync } from "esbuild";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import React from "react";
import { renderToString } from "react-dom/server";

const fullHtml = (
  <html>
    <head>
      <meta charSet="utf-8" />
      <link rel="stylesheet" href="index.css" />
    </head>
    <body id="root">
      <script src="index.js"></script>
    </body>
  </html>
);

config({ quiet: true });

buildSync({
  entryPoints: ["src/**/*.ts", "src/index.tsx"],
  bundle: true,
  outdir: "./dist",
  format: "iife",
  minify: process.env.NODE_ENV !== "development",
  sourcemap: false,
  platform: "browser",
  tsconfig: "tsconfig.json",
  conditions: ["style"],
});

if (!existsSync("./dist")) mkdirSync("./dist");
writeFileSync("./dist/popup.html", renderToString(fullHtml));
