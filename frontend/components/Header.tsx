'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

type SubItem = {
  label: string;
  href: string;
};

type MenuItem = {
  label: string;
  href?: string;
  sub?: SubItem[];
  requiresAuth?: boolean;
};

const menu: MenuItem[] = [
  {
    label: 'Accueil',
    href: '/',
    sub: [
      { label: 'Essai gratuit', href: '/reservation/calendrier?mode=essai' },
      { label: 'L’équipe', href: '/accueil/equipe' },
      { label: 'Heures d’ouverture', href: '/accueil/heures' },
      { label: 'Adresse', href: '/accueil/adresse' },
      { label: 'Contacts', href: '/accueil/contacts' }
    ]
  },
  { label: 'Horaire', href: '/reservation/calendrier' },
  { label: 'Programme', href: '/mon-compte/programme', requiresAuth: true },
  {
    label: 'Services',
    sub: [
      { label: 'Groupe', href: '/services/groupe' },
      { label: 'Privé', href: '/services/prive' },
      { label: 'Spinning', href: '/services/spinning' },
      { label: 'Corporatif', href: '/services/corporatif' }
    ]
  },
  { label: 'Tarifs', href: '/abonnements' },
  { label: 'Contact', href: '/contact' }
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M10.5 4a6.5 6.5 0 1 0 4.03 11.6l4.43 4.43 1.41-1.41-4.43-4.43A6.5 6.5 0 0 0 10.5 4Zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4v-2H6V6h4V4Zm5.59 4.59L14.17 10H9v2h5.17l1.42 1.41L17 12l-3-3-1.41 1.41Z"
        fill="currentColor"
      />
      <path
        d="M13 7h2l4 5-4 5h-2l4-5-4-5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function getAccountHref(isAuthenticated: boolean) {
  return isAuthenticated ? '/mon-compte/abonnement' : '/login';
}

export default function Header() {
  const { user, isAuthenticated, token, loading, logout, refreshMe } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSectionOpen, setMobileSectionOpen] = useState<string | null>(null);
  const [desktopSectionOpen, setDesktopSectionOpen] = useState<string | null>(null);

  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!headerRef.current) return;
      if (!headerRef.current.contains(event.target as Node)) {
        setDesktopSectionOpen(null);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const closeAll = () => {
    setMobileOpen(false);
    setMobileSectionOpen(null);
    setDesktopSectionOpen(null);
  };

  const handleLogout = async () => {
    closeAll();
    logout();
    await refreshMe();
    window.location.href = '/';
  };

  const toggleMobileSection = (label: string) => {
    setMobileSectionOpen((prev) => (prev === label ? null : label));
  };

  const toggleDesktopSection = (label: string) => {
    setDesktopSectionOpen((prev) => (prev === label ? null : label));
  };

  const accountHref = getAccountHref(isAuthenticated);

  const visibleMenu = menu.filter((item) => {
    if (item.requiresAuth && !isAuthenticated) return false;
    return true;
  });

  return (
    <>
      <header style={styles.header}>
        <div className="container" style={styles.headerInner} ref={headerRef}>
          <Link href="/" style={styles.logoWrap} onClick={closeAll}>
            <img src="/nova-logo.svg" alt="Nova Athlétique" className="logo-full" />
          </Link>

          <nav style={styles.desktopNav} aria-label="Navigation principale">
            {visibleMenu.map((item) => (
              <div key={item.label} style={styles.navItem}>
                {item.sub ? (
                  <>
                    <button
                      type="button"
                      style={styles.navButton}
                      className="menu-item"
                      onClick={() => toggleDesktopSection(item.label)}
                      aria-expanded={desktopSectionOpen === item.label}
                    >
                      {item.label}
                    </button>

                    {desktopSectionOpen === item.label && (
                      <div style={styles.dropdown}>
                        {item.href && (
                          <Link
                            href={item.href}
                            style={styles.dropdownLink}
                            className="dropdown-link"
                            onClick={closeAll}
                          >
                            Voir la section
                          </Link>
                        )}

                        {item.sub.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            style={styles.dropdownLink}
                            className="dropdown-link"
                            onClick={closeAll}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    style={styles.navLink}
                    className="menu-item"
                    onClick={closeAll}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div style={styles.rightActions}>
            {!loading && isAuthenticated && user && (
              <span style={styles.userLabel}>
                Bonjour {user.fullName}
              </span>
            )}

            <Link href="/recherche" style={styles.iconButton} aria-label="Rechercher">
              <SearchIcon />
            </Link>

            <Link href={accountHref} style={styles.iconButton} aria-label="Mon compte">
              <UserIcon />
            </Link>

            {!loading && isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                style={styles.iconButton}
                aria-label="Se déconnecter"
                title="Se déconnecter"
              >
                <LogoutIcon />
              </button>
            )}

            <button
              type="button"
              aria-label="Ouvrir le menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
              style={styles.hamburger}
            >
              <span style={styles.bar} />
              <span style={styles.bar} />
              <span style={styles.bar} />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div style={styles.mobilePanel}>
          <div className="container">
            <div style={styles.mobileInner}>
              <div style={styles.mobileTopActions}>
                <Link href="/recherche" style={styles.mobileActionLink} onClick={closeAll}>
                  Rechercher
                </Link>

                <Link href={accountHref} style={styles.mobileActionLink} onClick={closeAll}>
                  {isAuthenticated ? 'Mon compte' : 'Connexion'}
                </Link>

                {!loading && isAuthenticated && (
                  <button
                    type="button"
                    style={styles.mobileActionButton}
                    onClick={handleLogout}
                  >
                    Déconnexion
                  </button>
                )}
              </div>

              {visibleMenu.map((item) => (
                <div key={item.label} style={styles.mobileGroup}>
                  {item.sub ? (
                    <>
                      <button
                        type="button"
                        onClick={() => toggleMobileSection(item.label)}
                        style={styles.mobileSectionButton}
                        className="mobile-top-link"
                        aria-expanded={mobileSectionOpen === item.label}
                      >
                        <span>{item.label}</span>
                        <span style={styles.mobileSectionIcon}>
                          {mobileSectionOpen === item.label ? '−' : '+'}
                        </span>
                      </button>

                      {mobileSectionOpen === item.label && (
                        <div style={styles.mobileSub}>
                          {item.href && (
                            <Link
                              href={item.href}
                              style={styles.mobileSubLink}
                              className="mobile-sub-link"
                              onClick={closeAll}
                            >
                              Voir la section
                            </Link>
                          )}

                          {item.sub.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              style={styles.mobileSubLink}
                              className="mobile-sub-link"
                              onClick={closeAll}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href!}
                      style={styles.mobileTopLink}
                      className="mobile-top-link"
                      onClick={closeAll}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const menuTextStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 52,
  padding: '0 16px',
  color: 'var(--text)',
  fontWeight: 700,
  fontSize: '23px',
  lineHeight: '1.4em',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  whiteSpace: 'nowrap'
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 40,
    minHeight: 'var(--header-height)',
    background: 'rgba(5,7,8,0.94)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)'
  },
  headerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 'var(--header-height)',
    gap: 20
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0
  },
  desktopNav: {
    display: 'flex',
    gap: 6,
    alignItems: 'center'
  },
  navItem: {
    position: 'relative'
  },
  navLink: {
    ...menuTextStyle
  },
  navButton: {
    ...menuTextStyle
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    minWidth: 260,
    background: 'var(--surface)',
    border: 'solid 1px rgba(159,223,224,0.18)',
    borderRadius: 18,
    padding: 10,
    boxShadow: 'var(--shadow)',
    zIndex: 50
  },
  dropdownLink: {
    display: 'block',
    padding: '10px 12px',
    borderRadius: 12,
    color: 'var(--muted)',
    fontWeight: 700,
    fontSize: '23px',
    lineHeight: '1.4em',
    textTransform: 'uppercase',
    letterSpacing: '0.06em'
  },
  rightActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  userLabel: {
    color: 'var(--muted)',
    fontWeight: 700,
    fontSize: '18px',
    lineHeight: '1.4em',
    whiteSpace: 'nowrap'
  },
  iconButton: {
    width: 46,
    height: 46,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    border: '1px solid rgba(159,223,224,0.18)',
    color: 'var(--text)',
    background: 'transparent'
  },
  hamburger: {
    display: 'none',
    width: 50,
    height: 50,
    borderRadius: 999,
    border: '1px solid rgba(159,223,224,0.18)',
    background: 'transparent',
    padding: 10,
    cursor: 'pointer'
  },
  bar: {
    display: 'block',
    width: '100%',
    height: 2,
    background: 'var(--accent)',
    margin: '5px 0'
  },
  mobilePanel: {
    position: 'fixed',
    top: 'var(--header-height)',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 35,
    background: 'rgba(4,5,6,0.98)',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch'
  },
  mobileInner: {
    display: 'grid',
    gap: 0,
    padding: '0.5rem 0 2rem'
  },
  mobileTopActions: {
    display: 'flex',
    gap: 12,
    padding: '0.75rem 0 1rem',
    flexWrap: 'wrap'
  },
  mobileActionLink: {
    padding: '0.5rem 0.9rem',
    borderRadius: 999,
    border: '1px solid rgba(159,223,224,0.18)',
    color: 'var(--text)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  mobileActionButton: {
    padding: '0.5rem 0.9rem',
    borderRadius: 999,
    border: '1px solid rgba(159,223,224,0.18)',
    color: 'var(--text)',
    background: 'transparent',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    cursor: 'pointer'
  },
  mobileGroup: {
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    padding: '0.85rem 0'
  },
  mobileTopLink: {
    display: 'block',
    color: 'var(--text)',
    fontWeight: 700,
    fontSize: '23px',
    lineHeight: '1.4em',
    textTransform: 'uppercase',
    letterSpacing: '0.06em'
  },
  mobileSectionButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'transparent',
    border: 'none',
    color: 'var(--text)',
    padding: 0,
    cursor: 'pointer',
    textAlign: 'left',
    fontWeight: 700,
    fontSize: '23px',
    lineHeight: '1.4em',
    textTransform: 'uppercase',
    letterSpacing: '0.06em'
  },
  mobileSectionIcon: {
    color: 'var(--accent)',
    fontSize: '28px',
    lineHeight: 1
  },
  mobileSub: {
    display: 'grid',
    gap: 10,
    paddingTop: 14,
    paddingLeft: 10
  },
  mobileSubLink: {
    color: 'var(--muted)',
    fontWeight: 700,
    fontSize: '23px',
    lineHeight: '1.4em',
    textTransform: 'uppercase',
    letterSpacing: '0.06em'
  }
};