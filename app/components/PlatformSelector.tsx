import Link from "next/link";

const PLATFORMS = [
  {
    href: "/meesho-label-cropper",
    name: "Meesho",
    tagline: "Label Cropper",
    description: "Crop shipping labels from Meesho order PDFs. Detects TAX INVOICE boundary automatically.",
    borderActive: "#f43397",
    shadowActive: "rgba(244,51,151,0.18)",
    bgColor: "#fff5fa",
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <rect width="44" height="44" rx="12" fill="#F43397" />
        <path d="M12 32V18L18.5 26L22 21L25.5 26L32 18V32" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/flipkart-label-cropper",
    name: "Flipkart",
    tagline: "Label Cropper",
    description: "Works with standard Flipkart shipping PDFs for batch label printing on A4 paper.",
    borderActive: "#2874F0",
    shadowActive: "rgba(40,116,240,0.18)",
    bgColor: "#f0f7ff",
    badge: "New",
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <rect width="44" height="44" rx="12" fill="#2874F0" />
        <path d="M13 11H31L29 33H15L13 11Z" fill="#FFE11B" />
        <path d="M18 18H26M18 23H24" stroke="#2874F0" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/amazon-label-cropper",
    name: "Amazon",
    tagline: "Label Cropper",
    description: "Process Amazon seller fulfilled shipment labels and arrange them on A4 sheets.",
    borderActive: "#FF9900",
    shadowActive: "rgba(255,153,0,0.18)",
    bgColor: "#fffbf0",
    badge: "New",
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <rect width="44" height="44" rx="12" fill="#232F3E" />
        <path d="M12 28C17.5 32.5 26.5 32.5 32 28" stroke="#FF9900" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M29 26L33 28L31.5 32" stroke="#FF9900" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 22C16 18 18.8 15.5 22 15.5C25.2 15.5 28 18 28 22" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function PlatformSelector() {
  return (
    <div className="ps-wrapper">
      <div className="ps-cards-grid">
        {PLATFORMS.map((plat) => (
          <Link
            key={plat.href}
            href={plat.href}
            className="ps-card ps-card-link"
            style={{
              "--ps-border": plat.borderActive,
              "--ps-shadow": plat.shadowActive,
              "--ps-bg": plat.bgColor,
            } as React.CSSProperties}
          >
            {plat.badge && (
              <span className="ps-new-badge">{plat.badge}</span>
            )}
            <div className="ps-card-icon">{plat.icon}</div>
            <strong className="ps-card-name">{plat.name}</strong>
            <span className="ps-card-tagline">{plat.tagline}</span>
            <p className="ps-card-desc">{plat.description}</p>
            <div className="ps-cta-pill">Open Tool →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
