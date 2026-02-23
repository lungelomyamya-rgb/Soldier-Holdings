// src/components/Sidebar.tsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Box from './ui/Box';
import Flex from './ui/Flex';
import Typography from './ui/Typography';
import { SidebarProps, NavItem } from '../types/index';
import styles from '../styles/Sidebar.module.css';
import { useAuthStore } from '../store/authStore';

const Sidebar: React.FC<SidebarProps> = ({
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const navItems: NavItem[] = [
    { id: 'home', icon: 'home', label: 'Home', path: '/' },
    { id: 'overview', icon: 'chart-line', label: 'Overview', path: '/dashboard' },
    { id: 'fiat', icon: 'university', label: 'Rail Alpha (Fiat)', path: '/dashboard/fiat' },
    { id: 'crypto', icon: 'bitcoin', label: 'Rail Beta (Crypto)', path: '/dashboard/crypto' },
    { id: 'compliance', icon: 'shield-alt', label: 'Compliance Vault', path: '/dashboard/compliance' },
    { id: 'analytics', icon: 'brain', label: 'Risk Intelligence', path: '/dashboard/analytics' },
    { id: 'settings', icon: 'cog', label: 'Settings / UAC', path: '/dashboard/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box
      as='aside'
      className={`${styles.sidebar} ${mobileMenuOpen ? styles.mobileOpen : ''}`}
      aria-label='Main navigation'
      data-sidebar-open={mobileMenuOpen}
    >
      <button
        className={styles.mobileCloseButton}
        onClick={() => setMobileMenuOpen(false)}
      >
        <i className='fas fa-times'></i>
      </button>

      <Box className={styles.logo}>
        <Box className={styles.logoContent}>
          <img src="/images/logo.png" alt="Soldier Holdings Logo" className={styles.logoIcon} />
          <Typography variant='h6' className={styles.logoText}>
            Soldier Holdings
          </Typography>
        </Box>
      </Box>

      <Box as='nav' className={styles.navContainer}>
        <ul className={styles.navList}>
          {navItems.map(item => (
            <li key={item.id} className={styles.navItem}>
              <Link
                to={item.path}
                className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ''}`}
                onClick={() => {
                  if (setMobileMenuOpen) {
                    setMobileMenuOpen(false);
                  }
                }}
                aria-current={location.pathname === item.path ? 'page' : undefined}
              >
                <i className={`fas fa-${item.icon} ${styles.navIcon}`} aria-hidden='true' />
                <Typography variant='body1' component='span'>
                  {item.label}
                </Typography>
              </Link>
            </li>
          ))}
        </ul>
        <Box className={styles.logoutContainer}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <i className={`fas fa-sign-out-alt ${styles.navIcon}`} aria-hidden='true' />
            <Typography variant='body1' component='span'>
              Logout
            </Typography>
          </button>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(Sidebar);
