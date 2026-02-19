// src/components/Sidebar.tsx
import React from 'react';
import Box from './ui/Box';
import Flex from './ui/Flex';
import Typography from './ui/Typography';
import { SidebarProps, NavItem } from '../types/index';
import styles from '../styles/Sidebar.module.css';

const Sidebar: React.FC<SidebarProps> = ({ 
  activeNav, 
  onNavChange, 
  mobileMenuOpen, 
  setMobileMenuOpen 
}) => {
  const navItems: NavItem[] = [
    { id: 'overview', icon: 'chart-line', label: 'Overview', path: '/' },
    { id: 'fiat', icon: 'university', label: 'Rail Alpha (Fiat)', path: '/fiat' },
    { id: 'crypto', icon: 'bitcoin', label: 'Rail Beta (Crypto)', path: '/crypto' },
    { id: 'compliance', icon: 'shield-alt', label: 'Compliance Vault', path: '/compliance' },
    { id: 'analytics', icon: 'brain', label: 'Risk Intelligence', path: '/analytics' },
    { id: 'settings', icon: 'cog', label: 'Settings / UAC', path: '/settings' },
  ];

  const handleNavClick = (id: string) => {
    onNavChange(id);
    if (setMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <Box 
      as="aside" 
      className={`${styles.sidebar} ${mobileMenuOpen ? styles.mobileOpen : ''}`}
      aria-label="Main navigation"
      data-sidebar-open={mobileMenuOpen}
    >
      <Box className={styles.logo}>
        <Box className={styles.logoContent}>
          <i className={`fas fa-shield-alt ${styles.logoIcon}`}></i>
          <Typography variant="h6" className={styles.logoText}>
            Soldier Holdings
          </Typography>
        </Box>
      </Box>
      
      <Box as="nav" className={styles.navContainer}>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.id} className={styles.navItem}>
              <a
                href={item.path}
                className={`${styles.navLink} ${activeNav === item.id ? styles.active : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                aria-current={activeNav === item.id ? 'page' : undefined}
              >
                <i className={`fas fa-${item.icon} ${styles.navIcon}`} aria-hidden="true" />
                <Typography variant="body1" component="span">
                  {item.label}
                </Typography>
              </a>
            </li>
          ))}
        </ul>
      </Box>
    </Box>
  );
};

export default React.memo(Sidebar);