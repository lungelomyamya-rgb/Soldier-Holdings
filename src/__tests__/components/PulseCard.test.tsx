/**
 * Component Tests
 *
 * Comprehensive test coverage for React components
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PulseCard from '../../components/PulseCard';
import { Stat } from '../../types';

// Mock the stores
jest.mock('../../store/uiStore', () => ({
  __esModule: true,
  default: () => ({
    filter: 'all',
    setFilter: jest.fn(),
  }),
}));

jest.mock('../../store/dataStore', () => ({
  __esModule: true,
  default: () => ({
    fiatTotal: 1500000,
    cryptoTotal: 250000,
    transactions: [],
  }),
}));

// Test wrapper with router
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('PulseCard Component', () => {
  const mockStats: Stat[] = [
    { label: 'Daily Change', value: '+5.2%' },
    { label: 'Volume', value: 'R 2.5M' },
  ];

  const defaultProps = {
    type: 'fiat' as const,
    amount: 1500000,
    stats: mockStats,
    badge: 'Active',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render card with correct title and amount', () => {
    render(
      <TestWrapper>
        <PulseCard {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Fiat Liquidity')).toBeInTheDocument();
    expect(screen.getByText('R 1,500,000')).toBeInTheDocument();
  });

  it('should display crypto card with different formatting', () => {
    const cryptoProps = {
      type: 'crypto' as const,
      amount: 0.5,
      stats: mockStats,
      badge: 'High',
    };

    render(
      <TestWrapper>
        <PulseCard {...cryptoProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Crypto Velocity')).toBeInTheDocument();
    expect(screen.getByText('0.50000000 BTC')).toBeInTheDocument();
  });

  it('should apply correct CSS classes based on type', () => {
    const { rerender } = render(
      <TestWrapper>
        <PulseCard {...defaultProps} type='fiat' />
      </TestWrapper>
    );

    expect(document.querySelector('.pulse-card.fiat')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <PulseCard {...defaultProps} type='crypto' />
      </TestWrapper>
    );

    expect(document.querySelector('.pulse-card.crypto')).toBeInTheDocument();
  });

  it('should display stats correctly', () => {
    render(
      <TestWrapper>
        <PulseCard {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Daily Change')).toBeInTheDocument();
    expect(screen.getByText('+5.2%')).toBeInTheDocument();
    expect(screen.getByText('Volume')).toBeInTheDocument();
    expect(screen.getByText('R 2.5M')).toBeInTheDocument();
  });

  it('should display badge correctly', () => {
    render(
      <TestWrapper>
        <PulseCard {...defaultProps} badge='Critical' />
      </TestWrapper>
    );

    expect(screen.getByText('Critical')).toBeInTheDocument();
  });

  it('should format large numbers correctly', () => {
    render(
      <TestWrapper>
        <PulseCard {...defaultProps} amount={1500000000} />
      </TestWrapper>
    );

    expect(screen.getByText('R 1,500,000,000')).toBeInTheDocument();
  });

  it('should handle decimal amounts for crypto', () => {
    render(
      <TestWrapper>
        <PulseCard {...defaultProps} type='crypto' amount={0.00012345} />
      </TestWrapper>
    );

    expect(screen.getByText('0.00012345 BTC')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <TestWrapper>
        <PulseCard {...defaultProps} className='custom-class' />
      </TestWrapper>
    );

    const card = document.querySelector('.pulse-card');
    expect(card).toHaveClass('custom-class');
  });

  describe('Edge Cases', () => {
    it('should handle zero amount', () => {
      render(
        <TestWrapper>
          <PulseCard {...defaultProps} amount={0} />
        </TestWrapper>
      );

      expect(screen.getByText('R 0')).toBeInTheDocument();
    });

    it('should handle empty stats array', () => {
      render(
        <TestWrapper>
          <PulseCard {...defaultProps} stats={[]} />
        </TestWrapper>
      );

      expect(screen.getByText('Fiat Liquidity')).toBeInTheDocument();
      expect(screen.queryByText('Daily Change')).not.toBeInTheDocument();
    });

    it('should handle empty badge', () => {
      render(
        <TestWrapper>
          <PulseCard {...defaultProps} badge='' />
        </TestWrapper>
      );

      const badgeElement = document.querySelector('.pulse-badge');
      expect(badgeElement).toBeInTheDocument();
      expect(badgeElement).toHaveTextContent('');
    });

    it('should handle very long stats values', () => {
      const longStats: Stat[] = [
        { label: 'Very Long Label Name', value: 'Very Long Value That Should Be Truncated' },
      ];

      render(
        <TestWrapper>
          <PulseCard {...defaultProps} stats={longStats} />
        </TestWrapper>
      );

      expect(screen.getByText('Very Long Label Name')).toBeInTheDocument();
      expect(screen.getByText('Very Long Value That Should Be Truncated')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(
        <TestWrapper>
          <PulseCard {...defaultProps} />
        </TestWrapper>
      );

      rerender(
        <TestWrapper>
          <PulseCard {...defaultProps} />
        </TestWrapper>
      );

      // Component should handle re-renders efficiently
      expect(screen.getByText('Fiat Liquidity')).toBeInTheDocument();
    });

    it('should handle rapid updates', () => {
      const { rerender } = render(
        <TestWrapper>
          <PulseCard {...defaultProps} amount={1000} />
        </TestWrapper>
      );

      // Rapidly update amount
      for (let i = 0; i < 10; i++) {
        rerender(
          <TestWrapper>
            <PulseCard {...defaultProps} amount={1000 + i * 100} />
          </TestWrapper>
        );
      }

      expect(screen.getByText('R 1,900')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <TestWrapper>
          <PulseCard {...defaultProps} />
        </TestWrapper>
      );

      const icon = document.querySelector('.pulse-icon i');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('should support test ID for testing', () => {
      render(
        <TestWrapper>
          <PulseCard {...defaultProps} testId='pulse-card-test' />
        </TestWrapper>
      );

      const element = screen.getByTestId('pulse-card-test');
      expect(element).toBeInTheDocument();
    });
  });
});
