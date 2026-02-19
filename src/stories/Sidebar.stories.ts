import type { Meta, StoryObj } from '@storybook/react';
import Sidebar from '../components/Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Sidebar provides main navigation for the application with role-based access and mobile responsiveness.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    activeNav: {
      control: 'select',
      options: ['overview', 'fiat', 'crypto', 'compliance', 'analytics', 'settings'],
      description: 'Currently active navigation item',
    },
    mobileMenuOpen: {
      control: 'boolean',
      description: 'Whether the mobile menu is open',
    },
    onNavChange: {
      action: 'navigationChanged',
      description: 'Callback when navigation item is clicked',
    },
    setMobileMenuOpen: {
      action: 'mobileMenuToggled',
      description: 'Callback to toggle mobile menu state',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default state with overview active
export const Default: Story = {
  args: {
    activeNav: 'overview',
    mobileMenuOpen: false,
    onNavChange: () => {},
    setMobileMenuOpen: () => {},
  },
};

// Fiat navigation active
export const FiatActive: Story = {
  args: {
    activeNav: 'fiat',
    mobileMenuOpen: false,
    onNavChange: () => {},
    setMobileMenuOpen: () => {},
  },
};

// Crypto navigation active
export const CryptoActive: Story = {
  args: {
    activeNav: 'crypto',
    mobileMenuOpen: false,
    onNavChange: () => {},
    setMobileMenuOpen: () => {},
  },
};

// Compliance navigation active
export const ComplianceActive: Story = {
  args: {
    activeNav: 'compliance',
    mobileMenuOpen: false,
    onNavChange: () => {},
    setMobileMenuOpen: () => {},
  },
};

// Mobile menu open
export const MobileMenuOpen: Story = {
  args: {
    activeNav: 'overview',
    mobileMenuOpen: true,
    onNavChange: () => {},
    setMobileMenuOpen: () => {},
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile menu state - typically shown on smaller screens when hamburger menu is clicked.',
      },
    },
  },
};

// Analytics navigation active
export const AnalyticsActive: Story = {
  args: {
    activeNav: 'analytics',
    mobileMenuOpen: false,
    onNavChange: () => {},
    setMobileMenuOpen: () => {},
  },
};

// Settings navigation active
export const SettingsActive: Story = {
  args: {
    activeNav: 'settings',
    mobileMenuOpen: false,
    onNavChange: () => {},
    setMobileMenuOpen: () => {},
  },
};

// Interactive demo
export const Interactive: Story = {
  args: {
    activeNav: 'overview',
    mobileMenuOpen: false,
    onNavChange: () => {},
    setMobileMenuOpen: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive sidebar - click on navigation items to see the onNavChange action triggered.',
      },
    },
  },
};
