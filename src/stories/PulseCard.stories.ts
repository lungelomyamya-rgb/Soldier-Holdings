import type { Meta, StoryObj } from '@storybook/react';
import PulseCard from '../components/PulseCard';
import { Stat } from '../types';

const meta: Meta<typeof PulseCard> = {
  title: 'Components/PulseCard',
  component: PulseCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'PulseCard displays key metrics with animated indicators and trend information.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['fiat', 'crypto'],
      description: 'Type of card - determines styling and formatting',
    },
    amount: {
      control: 'number',
      description: 'Monetary amount to display',
    },
    stats: {
      control: 'object',
      description: 'Array of stats to display',
    },
    badge: {
      control: 'text',
      description: 'Badge text to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    testId: {
      control: 'text',
      description: 'Test ID for testing',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockStats: Stat[] = [
  { label: 'Daily Change', value: '+5.2%' },
  { label: 'Volume', value: 'R 2.5M' }
];

// Default story
export const Default: Story = {
  args: {
    type: 'fiat',
    amount: 1500000,
    stats: mockStats,
    badge: 'Active',
  },
};

// Crypto card example
export const Crypto: Story = {
  args: {
    type: 'crypto',
    amount: 0.5,
    stats: mockStats,
    badge: 'High',
  },
};

// Loading state (simulated with empty stats)
export const Loading: Story = {
  args: {
    type: 'fiat',
    amount: 0,
    stats: [],
    badge: 'Loading...',
  },
};

// Large amount
export const LargeAmount: Story = {
  args: {
    type: 'fiat',
    amount: 1500000000,
    stats: mockStats,
    badge: 'Critical',
  },
};

// Small crypto amount
export const SmallCrypto: Story = {
  args: {
    type: 'crypto',
    amount: 0.00012345,
    stats: mockStats,
    badge: 'Low',
  },
};

// Custom styling
export const CustomStyled: Story = {
  args: {
    type: 'fiat',
    amount: 250000,
    stats: mockStats,
    badge: 'Custom',
    className: 'custom-pulse-card',
  },
  parameters: {
    docs: {
      description: {
        story: 'This card has custom CSS class applied for additional styling.',
      },
    },
  },
};
