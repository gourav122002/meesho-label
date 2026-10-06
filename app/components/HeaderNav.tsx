"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const CALCULATORS = [
  {
    href: "/meesho-profit-calculator",
    name: "Meesho Profit Calculator",
    desc: "0% commission + shipping fee calculator",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect width="20" height="20" rx="5" fill="#F43397" />
        <text x="4" y="14" fill="white" fontSize="10" fontWeight="800">₹</text>
      </svg>
    ),
    badge: "Free",
  },
  {
    href: "/amazon-profit-calculator",
    name: "Amazon Profit Calculator",
    desc: "Referral fee, FBA & Easy Ship",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect width="20" height="20" rx="5" fill="#232F3E" />
        <text x="4" y="14" fill="#FF9900" fontSize="10" fontWeight="800">₹</text>
      </svg>
    ),
  },
  {
    href: "/flipkart-profit-calculator",
    name: "Flipkart Profit Calculator",
    desc: "Commission, collection & fixed fee",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect width="20" height="20" rx="5" fill="#2874F0" />
        <text x="4" y="14" fill="#FFE11B" fontSize="10" fontWeight="800">₹</text>
      </svg>
    ),
  },
  {
    href: "/myntra-profit-calculator",
    name: "Myntra Profit Calculator",
    desc: "Fashion & lifestyle seller margins",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect width="20" height="20" rx="5" fill="#FF3F6C" />
        <text x="4" y="14" fill="white" fontSize="10" fontWeight="800">₹</text>
      </svg>
    ),
  },
  {
    href: "/meesho-payment-analyzer",
    name: "Payment Sheet Analyzer",
    desc: "Upload Excel → P&L + return insights",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect width="20" height="20" rx="5" fill="#7c3aed" />
        <text x="3" y="14" fill="white" fontSize="8" fontWeight="800">P&L</text>
      </svg>
    ),
    badge: "New",
  },
  {
    href: "/bulk-profit-calculator",
    name: "Bulk Profit Calculator",
    desc: "Upload CSV/XLSX for 100s of SKUs",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect width="20" height="20" rx="5" fill="#0891b2" />
        <text x="2" y="14" fill="white" fontSize="7" fontWeight="800">BULK</text>
      </svg>
    ),
  },
  {
    href: "/amazon-vs-meesho",
    name: "Amazon vs Meesho",
    desc: "Side-by-side profit comparison",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect width="20" height="20" rx="5" fill="#16a34a" />
        <text x="4" y="14" fill="white" fontSize="8" fontWeight="800">VS</text>
      </svg>
    ),
  },
];

const TOOLS = [
  {
    href: "/meesho-label-cropper",
    name: "Meesho Label Cropper",
    desc: "Auto-crop Meesho shipping labels",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect width="20" height="20" rx="5" fill="#F43397" />
        <path d="M5 14V8.5L7.8 12L10 9L12.2 12L15 8.5V14" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/meesho-label-with-invoice",
    name: "Meesho + Invoice Cropper",
    desc: "Crop label above TAX INVOICE",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect width="20" height="20" rx="5" fill="#F43397" />
        <path d="M5 14V8.5L7.8 12L10 9L12.2 12L15 8.5V14" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="5" y1="15.5" x2="15" y2="15.5" stroke="white" strokeWidth="1.2" strokeDasharray="1.5 1" />
      </svg>
    ),
    badge: "Popular",
  },
  {
    href: "/flipkart-label-cropper",
    name: "Flipkart Label Cropper",
    desc: "Crop Flipkart shipping label PDFs",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect width="20" height="20" rx="5" fill="#2874F0" />
        <path d="M5.5 4.5H14.5L13.5 15.5H6.5L5.5 4.5Z" fill="#FFE11B" />
        <path d="M7.5 7.5H12.5M7.5 9.5H11" stroke="#2874F0" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/myntra-label-cropper",
    name: "Myntra Label Cropper",
    desc: "Crop Myntra fashion label PDFs",
    badge: "New",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect width="20" height="20" rx="5" fill="#FF3F6C" />
        <path d="M4 14L7 6L10 11L13 6L16 14" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/amazon-label-cropper",
    name: "Amazon Label Cropper",
    desc: "Crop Amazon seller label PDFs",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect width="20" height="20" rx="5" fill="#232F3E" />
        <path d="M4.5 12C7 14 13 14 15.5 12" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M13.5 11L15.8 12L15 14" stroke="#FF9900" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 9.5C6.5 7.5 8 6.5 10 6.5C12 6.5 13.5 7.5 13.5 9.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/a4-meesho-labels",
    name: "A4 Multi-Label Arranger",
    desc: "4, 6 or 8 labels per A4 page",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect width="20" height="20" rx="5" fill="#2563eb" />
        <rect x="4" y="4" width="5" height="5" rx="1" fill="white" fillOpacity="0.7" />
        <rect x="11" y="4" width="5" height="5" rx="1" fill="white" fillOpacity="0.7" />
        <rect x="4" y="11" width="5" height="5" rx="1" fill="white" fillOpacity="0.7" />
        <rect x="11" y="11" width="5" height="5" rx="1" fill="white" fillOpacity="0.7" />
      </svg>
    ),
  },
];

export default function HeaderNav() {
  const [open, setOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const calcDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
      if (calcDropdownRef.current && !calcDropdownRef.current.contains(e.target as Node)) {
        setCalcOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="container header-inner">
        {/* Logo */}
        <Link href="/" className="logo-link" aria-label="ShipLabelTool Homepage">
          <Image
            src="/logo.png"
            alt="ShipLabelTool Logo"
            width={38}
            height={38}
            priority
            className="header-logo-image"
          />
          <Image
            src="/logo-name.png"
            alt="ShipLabelTool"
            width={140}
            height={24}
            priority
            className="header-logo-name-image"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav-links">
          {/* Calculators dropdown */}
          <div className="nav-dropdown-wrap" ref={calcDropdownRef}>
            <button
              type="button"
              className={`nav-dropdown-btn ${calcOpen ? "active" : ""}`}
              onClick={() => {
                setCalcOpen(!calcOpen);
                setOpen(false);
              }}
              aria-expanded={calcOpen}
            >
              <span>Profit Calculators</span>
              <svg className={`dropdown-chevron ${calcOpen ? "open" : ""}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {calcOpen && (
              <div className="nav-dropdown-menu">
                <div className="dropdown-section-title">Marketplace Calculators</div>
                {CALCULATORS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="nav-dropdown-item"
                    onClick={() => setCalcOpen(false)}
                  >
                    <div className="dropdown-item-icon">{item.icon}</div>
                    <div className="dropdown-item-text">
                      <div className="dropdown-item-name">
                        {item.name}
                        {item.badge && <span className="dropdown-item-badge">{item.badge}</span>}
                      </div>
                      <div className="dropdown-item-desc">{item.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Label Tools dropdown */}
          <div className="nav-dropdown-wrap" ref={dropdownRef}>
            <button
              type="button"
              className={`nav-dropdown-btn ${open ? "active" : ""}`}
              onClick={() => {
                setOpen(!open);
                setCalcOpen(false);
              }}
              aria-expanded={open}
            >
              <span>Label Tools</span>
              <svg className={`dropdown-chevron ${open ? "open" : ""}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {open && (
              <div className="nav-dropdown-menu">
                <div className="dropdown-section-title">Label Cropper Tools</div>
                {TOOLS.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="nav-dropdown-item"
                    onClick={() => setOpen(false)}
                  >
                    <div className="dropdown-item-icon">{tool.icon}</div>
                    <div className="dropdown-item-text">
                      <div className="dropdown-item-name">
                        {tool.name}
                        {tool.badge && <span className="dropdown-item-badge">{tool.badge}</span>}
                      </div>
                      <div className="dropdown-item-desc">{tool.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/meesho-payment-analyzer" className="nav-highlight-link">
            <span className="highlight-pill">New</span>
            <span>Payment Analyzer</span>
          </Link>

          <Link href="/blog" className="nav-text-link">
            Guides
          </Link>
        </nav>

        {/* Mobile menu trigger */}
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-nav-section">
            <div className="mobile-section-heading">Profit Calculators & Analyzer</div>
            {CALCULATORS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="mobile-nav-item"
                onClick={() => setMobileOpen(false)}
              >
                <div className="dropdown-item-icon">{item.icon}</div>
                <div>
                  <div className="dropdown-item-name">{item.name}</div>
                  <div className="dropdown-item-desc">{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mobile-nav-section">
            <div className="mobile-section-heading">Label Cropper Tools</div>
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="mobile-nav-item"
                onClick={() => setMobileOpen(false)}
              >
                <div className="dropdown-item-icon">{tool.icon}</div>
                <div>
                  <div className="dropdown-item-name">{tool.name}</div>
                  <div className="dropdown-item-desc">{tool.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
