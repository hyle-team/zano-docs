import {themes as prismThemes} from 'prism-react-renderer';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const config = {
  title: "Zano Docs",
  titleDelimiter: "·",
  tagline: "Blockchain privacy for mass adoption",
  favicon: "img/favicon.ico",

  url: "https://docs.zano.org",
  baseUrl: "/",

  onBrokenLinks: "throw",

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: './sidebars.js',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          // the RPC reference is served by the versioned "api" instance below
          exclude: [
            "**/_*.{js,jsx,ts,tsx,md,mdx}",
            "**/_*/**",
            "build/rpc-api/**",
          ],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  plugins: [
    [
      // Versioned RPC API reference: own instance, same folder, same URLs.
      // lastVersion "current" + path "" keeps the working folder (mainnet)
      // at the clean base path even once snapshots exist — do not remove.
      "@docusaurus/plugin-content-docs",
      {
        id: "api",
        // content lives OUTSIDE docs/ — nesting it there makes both instances'
        // webpack mdx rules chain and double-compile every page (spike finding).
        // The route below still serves the original URLs unchanged.
        // docs/build/rpc-api (if recreated by the build bot) stays excluded in
        // the default instance and acts as staging input only.
        path: "api-reference",
        routeBasePath: "docs/build/rpc-api",
        sidebarPath: "./sidebarsApi.js",
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
        lastVersion: "current",
        versions: {
          current: {
            label: "Mainnet (2.2.1.502)",
            path: "",
          },
          testnet: {
            label: "Testnet (2.2.1.502)",
            path: "testnet",
            banner: "unreleased",
          },
        },
      },
    ],
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          // Phase 3 IA restructure (2026-08): pages merged or moved between tabs
          { from: "/docs/learn/zano-features/overview", to: "/docs/learn/how-zano-works" },
          { from: "/docs/learn/specifications", to: "/docs/learn/emission" },
          { from: "/docs/learn/whitepaper", to: "/docs/learn/research" },
          { from: "/docs/learn/reviews", to: "/docs/learn/research" },
          { from: "/docs/learn/password-specs", to: "/docs/build/password-specs" },
          // pre-restructure slug fix debt: old .md-suffixed URL
          { from: "/docs/use/zano-passwords.md", to: "/docs/use/zano-passwords" },
          // deeplinks page lives in the Build tab but had a /use/ slug
          { from: "/docs/use/deeplinks", to: "/docs/build/deeplinks" },
        ],
      },
    ],
  ],

  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
  ],

  themeConfig: {
    image: "img/zano_dev_meta.png",
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Zano Docs",
      logo: {
        alt: "Zano Logo",
        src: "img/logo_zano.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "learnSidebar",
          position: "left",
          label: "Learn",
        },
        {
          type: "docSidebar",
          sidebarId: "useSidebar",
          position: "left",
          label: "Use",
        },
        {
          // plain link with activeBaseRegex so the Build tab also highlights
          // on the versioned API instance's pages (same /docs/build/ prefix)
          to: "/docs/build/overview",
          activeBaseRegex: "^/docs/build/",
          position: "left",
          label: "Build",
        },
        {
          type: "docSidebar",
          sidebarId: "mineSidebar",
          position: "left",
          label: "Mine",
        },
        {
          type: "docSidebar",
          sidebarId: "stakeSidebar",
          position: "left",
          label: "Stake",
        },
        {
          type: "docSidebar",
          sidebarId: "codeSidebar",
          position: "left",
          label: "Code",
        },
        {
          type: "custom-apiVersionDropdown",
          position: "right",
        },
        {
          href: "https://github.com/hyle-team/zano",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Learn",
              to: "/docs/learn/what-is-zano",
            },
            {
              label: "Use",
              to: "/docs/use/overview",
            },
            {
              label: "Build",
              to: "/docs/build/overview",
            },
            {
              label: "Mine",
              to: "/docs/mine/overview",
            },
            {
              label: "Stake",
              to: "/docs/stake/overview",
            },
            {
              label: "Code",
              to: "/docs/code/overview",
            },
          ],
        },
        {
          title: "Zano",
          items: [
            {
              label: "Homepage",
              to: "https://zano.org",
            },
            {
              label: "Downloads",
              to: "https://zano.org/downloads",
            },
            {
              label: "Blog",
              to: "https://blog.zano.org",
            },
            {
              label: "Wrapped Zano",
              to: "https://wrapped.zano.org",
            },
            {
              label: "Support",
              to: "https://zano.org/support",
            },
          ],
        },
        {
          title: "Resources",
          items: [
            {
              label: "Explorer",
              to: "https://explorer.zano.org",
            },
            {
              label: "Github",
              to: "https://github.com/hyle-team/zano",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Forum",
              to: "https://forum.zano.org",
            },
            {
              label: "Discord",
              to: "https://discord.gg/wE3rmYY",
            },
            {
              label: "Twitter",
              to: "https://twitter.com/zano_project",
            },
            {
              label: "Telegram",
              to: "https://t.me/zanocoin",
            },
            {
              label: "Youtube",
              to: "https://www.youtube.com/@zanoproject",
            },
            {
              label: "Reddit",
              to: "https://www.reddit.com/r/Zano",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Zano.org`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "json", "diff"],
    },
    algolia: {
      appId: 'GZR5BV1JNU',
      apiKey: 'aa52f5e09870e3882638cccd64c79ad0',
      indexName: 'zano',
    }
  },
};

export default config;
