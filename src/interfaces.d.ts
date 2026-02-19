declare global {
  interface Transaction {
    id: number;
    type: string;
    amount: number;
    currency: string;
    from: string;
    status: string;
    statusText: string;
    timestamp: Date;
    riskScore: number;
  }

  interface Change {
    type: string;
    text: string;
  }

  interface Stat {
    label: string;
    value: string;
    change?: Change;
  }

  interface PulseCardProps {
    type: string;
    amount: number;
    stats: Stat[];
    badge: string;
  }

  interface SidebarProps {
    activeNav: string;
    onNavChange: (nav: string) => void;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
  }

  interface TransactionItemProps {
    transaction: Transaction;
  }
}
