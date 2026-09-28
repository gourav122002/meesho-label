import Link from "next/link";

const PLATFORMS = [
  {
    href: "/meesho-label-cropper",
    name: "Meesho",
    tagline: "Label Cropper",
    description: "Crop shipping labels from Meesho order PDFs. Detects TAX INVOICE boundary automatically.",
    borderActive: "#f43397",
    shadowActive: "rgba(244,51,151,0.22)",
    bgGrad: "linear-gradient(135deg,#fff5fa 0%,#fce7f3 100%)",
    available: true,
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#F43397" />
        <path d="M13 34V20L20.5 29L24 23.5L27.5 29L35 20V34" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/flipkart-label-cropper",
    name: "Flipkart",
    tagline: "Label Cropper",
    description: "Works with standard Flipkart shipping PDFs for batch label printing on A4 paper.",
    borderActive: "#2874F0",
    shadowActive: "rgba(40,116,240,0.22)",
    bgGrad: "linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%)",
    available: true,
    badge: "New",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#2874F0" />
        <path d="M14 12H34L32 36H16L14 12Z" fill="#FFE11B" />
        <path d="M20 20H28M20 26H26" stroke="#2874F0" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/myntra-label-cropper",
    name: "Myntra",
    tagline: "Label Cropper",
    description: "Process Myntra fashion seller shipment labels and arrange them on A4 sheets.",
    borderActive: "#FF3F6C",
    shadowActive: "rgba(255,63,108,0.22)",
    bgGrad: "linear-gradient(135deg,#fff1f4 0%,#ffe4ea 100%)",
    available: true,
    badge: "New",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#FF3F6C" />
        <path d="M12 32 L18 16 L24 26 L30 16 L36 32" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "#",
    name: "Amazon",
    tagline: "Label Cropper",
    description: "Amazon seller fulfilled shipment label cropper — coming very soon.",
    borderActive: "#FF9900",
    shadowActive: "rgba(255,153,0,0.18)",
    bgGrad: "linear-gradient(135deg,#fffbf0 0%,#fef3c7 100%)",
    available: false,
    badge: "Coming Soon",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#232F3E" />
        <path d="M13 31C19.5 36.5 28.5 36.5 35 31" stroke="#FF9900" strokeWidth="3" strokeLinecap="round" />
        <path d="M32 29L36 31L34.5 36" stroke="#FF9900" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 24C18 19.5 20.7 17 24 17C27.3 17 30 19.5 30 24" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function PlatformSelector() {
  return (
    <div className="ps-wrapper">
      <div className="ps-cards-grid ps-cards-grid-4">
        {PLATFORMS.map((plat) => {
          const cardContent = (
            <>
              {plat.badge && (
                <span className={`ps-new-badge ${!plat.available ? "ps-badge-soon" : ""}`}>{plat.badge}</span>
              )}
              <div className="ps-card-icon">{plat.icon}</div>
              <strong className="ps-card-name">{plat.name}</strong>
              <span className="ps-card-tagline">{plat.tagline}</span>
              <p className="ps-card-desc">{plat.description}</p>
              {plat.available ? (
                <div className="ps-cta-pill">Open Tool →</div>
              ) : (
                <div className="ps-cta-pill ps-cta-soon">🔒 Coming Soon</div>
              )}
            </>
          );

          if (!plat.available) {
            return (
              <div
                key={plat.name}
                className="ps-card ps-card-disabled"
                style={{
                  "--ps-border": plat.borderActive,
                  "--ps-shadow": plat.shadowActive,
                  "--ps-bg": plat.bgGrad,
                } as React.CSSProperties}
              >
                {cardContent}
              </div>
            );
          }

          return (
            <Link
              key={plat.href}
              href={plat.href}
              className="ps-card ps-card-link"
              style={{
                "--ps-border": plat.borderActive,
                "--ps-shadow": plat.shadowActive,
                "--ps-bg": plat.bgGrad,
              } as React.CSSProperties}
            >
              {cardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
