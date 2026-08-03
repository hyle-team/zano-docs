import Link from "@docusaurus/Link";
import styles from "./StartPage.module.css";

const IconBook = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const IconWallet = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="14" rx="3" />
    <path d="M16 12h.01M2 10h20" />
  </svg>
);
const IconCode = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);
const IconChip = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="5" width="14" height="14" rx="2" />
    <rect x="9.5" y="9.5" width="5" height="5" />
    <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
  </svg>
);
const IconCoins = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18M7 6h1v4" />
    <path d="m16.71 13.88.7.71-2.82 2.82" />
  </svg>
);
const IconTerminal = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const sections = [
  {
    title: "Learn",
    Icon: IconBook,
    description: "What Zano is and how the technology works.",
    links: [
      { label: "What is Zano", to: "/docs/learn/what-is-zano" },
      { label: "How Zano Works", to: "/docs/learn/how-zano-works" },
      { label: "FAQ", to: "/docs/learn/frequently-asked-questions" },
    ],
  },
  {
    title: "Use",
    Icon: IconWallet,
    description: "Wallets, dApps, and day-to-day guides.",
    links: [
      { label: "Getting Started", to: "/docs/use/overview" },
      { label: "Wallets", to: "/docs/use/wallets/overview" },
      { label: "Security & Privacy", to: "/docs/use/seed-phrase" },
      { label: "dApps & Bridges", to: "/docs/use/dapps/" },
      { label: "Troubleshooting", to: "/docs/use/troubleshooting/common-issues" },
    ],
  },
  {
    title: "Build",
    Icon: IconCode,
    description: "Integrate Zano into your app, service, or exchange.",
    links: [
      { label: "Build Overview", to: "/docs/build/overview" },
      { label: "RPC API", to: "/docs/build/rpc-api/overview" },
      { label: "Confidential Assets", to: "/docs/build/confidential-assets/overview" },
    ],
  },
  {
    title: "Mine",
    Icon: IconChip,
    description: "Secure the PoW side with ProgPowZ hashpower.",
    links: [{ label: "Mining Overview", to: "/docs/mine/overview" }],
  },
  {
    title: "Stake",
    Icon: IconCoins,
    description: "Earn rewards without revealing your balance.",
    links: [
      { label: "Staking Overview", to: "/docs/stake/overview" },
      { label: "Proof-of-Stake Guide", to: "/docs/stake/getting-started/proof-of-stake-mining" },
    ],
  },
  {
    title: "Code",
    Icon: IconTerminal,
    description: "Inside the C++ core, for contributors.",
    links: [
      { label: "Codebase Overview", to: "/docs/code/overview" },
      { label: "Serialization Types", to: "/docs/code/serialization-types" },
    ],
  },
];

function StartPage() {
  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          Zano <span className={styles.titleAccent}>Documentation</span>
        </h1>
        <p className={styles.subtitle}>
          Zano is a privacy-first layer-1: amounts, addresses, and asset types are
          hidden by default. Learn how it works, use the wallets and dApps, and
          build on the chain.
        </p>
      </section>

      <section className={styles.grid}>
        {sections.map(({ title, Icon, description, links }) => (
          <div className={styles.card} key={title}>
            <div className={styles.cardIcon}>
              <Icon />
            </div>
            <h2 className={styles.cardTitle}>{title}</h2>
            <p className={styles.cardDescription}>{description}</p>
            <ul className={styles.cardLinks}>
              {links.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to}>
                    {label} <span className={styles.arrow}>›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}

export default StartPage;
