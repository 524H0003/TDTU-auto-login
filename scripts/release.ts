import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const version = process.argv[2];
if (!version) {
  console.error("❌ Version không được cung cấp!");
  process.exit(1);
}

const manifest = JSON.parse(readFileSync("./manifest.json", "utf-8"));

manifest.version = version;

writeFileSync("./manifest.json", JSON.stringify(manifest, null, 2));

const releaseDir = "release",
  zipName = `tdtu-auto-login-${version}.zip`,
  zipPath = path.join(releaseDir, zipName);

if (!existsSync(releaseDir)) {
  mkdirSync(releaseDir, { recursive: true });
}

console.log(`📦 Đang nén file cho version: ${version}...`);

execSync(`zip -r ${zipPath} dist public manifest.json`, { stdio: "inherit" });

console.log(`✅ Đã tạo file zip: ${zipPath}`);
