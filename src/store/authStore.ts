import { create } from 'zustand';

export type UserRole = 'political' | 'regulator' | 'financial' | null;

export interface DemoAccount {
  email: string;
  password: string;
  role: UserRole;
  name: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  userRole: UserRole;
  userName: string | null;
  userEmail: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

// Demo accounts as specified
const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: 'party@demo.za',
    password: 'demo123',
    role: 'political',
    name: 'Political Party User'
  },
  {
    email: 'iec@demo.za',
    password: 'demo123',
    role: 'regulator',
    name: 'IEC Regulatory Body'
  },
  {
    email: 'bank@demo.za',
    password: 'demo123',
    role: 'financial',
    name: 'Financial Institution'
  }
];

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  userRole: null,
  userName: null,
  userEmail: null,
  login: (email: string, password: string) => {
    const account = DEMO_ACCOUNTS.find(
      acc => acc.email === email && acc.password === password
    );

    if (account) {
      set({
        isAuthenticated: true,
        userRole: account.role,
        userName: account.name,
        userEmail: account.email,
      });
      return true;
    }
    return false;
  },
  logout: () => {
    set({
      isAuthenticated: false,
      userRole: null,
      userName: null,
      userEmail: null,
    });
  },
}));
