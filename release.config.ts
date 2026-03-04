import type { GlobalConfig } from "semantic-release";

const config: GlobalConfig = {
  tagFormat: "v${version}",
  repositoryUrl: "https://github.com/524H0003/TDTU-auto-login",
  branches: ["main", { name: "dev-*", prerelease: "dev" }],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["@semantic-release/npm", { npmPublish: false }],
    [
      "@semantic-release/exec",
      {
        prepareCmd:
          "pnpm build && node scripts/release.ts ${nextRelease.version}",
      },
    ],
    [
      "@semantic-release/github",
      {
        assets: [
          {
            path: "release.zip",
            name: "TDTU Auto Login v${nextRelease.version}.zip",
          },
        ],
      },
    ]
  ],
};

export default config;
