/**
 * Sidebar Navigation Component
 *
 * Provides main navigation for the application with role-based access
 * Follows WCAG 2.1 AA accessibility standards
 */

import { SidebarProps } from '../types';

const Sidebar = ({ activeNav, onNavChange, mobileMenuOpen, setMobileMenuOpen }: SidebarProps) => {
  interface NavItem {
    id: string;
    icon: string;
    label: string;
  }

  const navItems: NavItem[] = [
    { id: 'overview', icon: 'fas fa-chart-line', label: 'Overview' },
    { id: 'fiat', icon: 'fas fa-university', label: 'Rail Alpha (Fiat)' },
    { id: 'crypto', icon: 'fab fa-bitcoin', label: 'Rail Beta (Crypto)' },
    { id: 'compliance', icon: 'fas fa-shield-alt', label: 'Compliance Vault' },
    { id: 'analytics', icon: 'fas fa-brain', label: 'Risk Intelligence' },
    { id: 'settings', icon: 'fas fa-cog', label: 'Settings / UAC' },
  ];

  const handleNavClick = (navId: string) => {
    onNavChange(navId);
    // Close mobile menu after navigation
    if (setMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <aside
      className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}
      role='navigation'
      aria-label='Main navigation'
    >
      <div className='logo'>
        <h1>SOLDIER HOLDINGS</h1>
        <div className='subtitle'>Political Funding Platform</div>
      </div>
      <nav>
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => handleNavClick(item.id)}
            aria-current={activeNav === item.id ? 'page' : undefined}
          >
            <i className={item.icon} aria-hidden='true' />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

// Attach to window for backward compatibility during transition
// window.Sidebar = Sidebar;

export default Sidebar;
