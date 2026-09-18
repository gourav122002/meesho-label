"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="site-header">
      <div className="container nav">
        {/* Logo */}
        <Link href="/" className="brand">
          <span>Ship Label Tool</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="nav-links" aria-label="Primary navigation">
          {/* Tools Dropdown */}
          <div className="nav-dropdown-wrap" ref={dropdownRef}>
            <button
              className={`nav-dropdown-trigger ${open ? "nav-dropdown-trigger-active" : ""}`}
              aria-haspopup="true"
              aria-expanded={open}
              onClick={() => setOpen((p) => !p)}
              type="button"
            >
              Shipping Label Crop Tool
              <svg
                className={`nav-chevron ${open ? "nav-chevron-up" : ""}`}
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path d="M2 4.5L6 8L10 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {open && (
              <div className="nav-dropdown" role="menu">
                {TOOLS.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="nav-dropdown-item"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    <span className="nav-dropdown-icon">{tool.icon}</span>
                    <span className="nav-dropdown-text">
                      <strong>{tool.name}</strong>
                      <span>{tool.desc}</span>
                    </span>
                    {tool.badge && (
                      <span className="nav-dropdown-badge">{tool.badge}</span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/blog/meesho-label-cropper-a4" className="nav-link">Guides</Link>
          <Link href="/contact" className="nav-link">Contact</Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="nav-hamburger"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((p) => !p)}
          type="button"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="nav-mobile-menu">
          <div className="nav-mobile-header">Tools</div>
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="nav-mobile-item"
              onClick={() => setMobileOpen(false)}
            >
              <span className="nav-dropdown-icon">{tool.icon}</span>
              <span>{tool.name}</span>
              {tool.badge && <span className="nav-dropdown-badge">{tool.badge}</span>}
            </Link>
          ))}
          <div className="nav-mobile-divider" />
          <Link href="/blog/meesho-label-cropper-a4" className="nav-mobile-item" onClick={() => setMobileOpen(false)}>
            📖 Guides
          </Link>
          <Link href="/contact" className="nav-mobile-item" onClick={() => setMobileOpen(false)}>
            ✉️ Contact
          </Link>
        </div>
      )}
    </header>
  );
}
