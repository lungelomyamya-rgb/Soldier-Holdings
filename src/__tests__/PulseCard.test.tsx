import { render, screen } from '@testing-library/react';
import PulseCard from '../components/PulseCard';

describe('PulseCard', () => {
  it('renders fiat pulse card', () => {
    render(<PulseCard type='fiat' amount={1000} stats={[]} badge='Test' />);
    expect(screen.getByText('Fiat Liquidity')).toBeInTheDocument();
    expect(screen.getByText('R 1,000')).toBeInTheDocument();
  });

  it('renders crypto pulse card', () => {
    render(<PulseCard type='crypto' amount={0.5} stats={[]} badge='Test' />);
    expect(screen.getByText('Crypto Velocity')).toBeInTheDocument();
    expect(screen.getByText('0.50000000 BTC')).toBeInTheDocument();
  });
});
