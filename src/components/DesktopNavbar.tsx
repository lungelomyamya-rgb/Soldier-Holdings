import React from 'react';
import useUIStore from '../store/uiStore';

const DesktopNavbar: React.FC = () => {
  const { activeNav, setActiveNav } = useUIStore();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'fas fa-chart-line' },
    { id: 'fiat', label: 'Fiat', icon: 'fas fa-dollar-sign' },
    { id: 'crypto', label: 'Crypto', icon: 'fas fa-bitcoin-sign' },
    { id: 'compliance', label: 'Compliance', icon: 'fas fa-shield-alt' },
    { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-bar' },
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog' },
  ];

  return (
    <nav className='desktop-navbar'>
      <div className='navbar-logo'>
        <img
          src='/images/logo.png'
          alt='Soldier Holdings Logo'
          className='navbar-logo-icon'
        />
        <div className='navbar-logo-text'>
          <div className='navbar-logo-title'>SOLDIER HOLDINGS</div>
          <div className='navbar-logo-subtitle'>
            Political Funding Compliance Platform
          </div>
        </div>
      </div>

      <div className='navbar-nav'>
        {navItems.map(item => (
          <a
            key={item.id}
            href='#'
            className={`navbar-nav-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={e => {
              e.preventDefault();
              setActiveNav(item.id);
            }}
          >
            <i className={item.icon}></i>
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default DesktopNavbar;
