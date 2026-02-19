# State Management Migration Guide

## 🏗️ New Architecture Overview

The monolithic store has been split into **focused stores** that follow the Single Responsibility Principle:

### 📦 Store Structure

```
src/store/
├── uiStore.ts      # UI state only
├── dataStore.ts    # Data state and business logic
├── appStore.ts     # App-wide state (loading, errors, notifications)
└── index.ts        # Exports all stores
```

### 🎯 Store Responsibilities

#### UI Store (`useUIStore`)
- Navigation state (`activeNav`)
- Mobile UI state (`mobileMenuOpen`)
- Filter state (`filter`)
- Theme preferences
- **No data logic, no loading states**

#### Data Store (`useDataStore`)
- Transactions array
- Computed totals (`fiatTotal`, `cryptoTotal`)
- Data operations (add, update, remove)
- Computed selectors (get by type, get by ID)
- **No UI state, no loading states**

#### App Store (`useAppStore`)
- Global loading state
- Error handling
- Notifications system
- Online/offline status
- Global settings
- **No business logic, no UI state**

## 🔄 Migration Steps

### Step 1: Update Imports

**Before:**
```typescript
import useStore from './store/index';
```

**After:**
```typescript
import { useUIStore } from './store/uiStore';
import { useDataStore } from './store/dataStore';
import { useAppStore } from './store/appStore';
```

### Step 2: Refactor Components

**Before (Prop Drilling):**
```typescript
const OverviewPage = ({ transactions, filter, onFilterChange, fiatTotal, cryptoTotal }) => {
  // Component logic
};
```

**After (Direct Store Access):**
```typescript
const OverviewPage = () => {
  const { transactions, fiatTotal, cryptoTotal } = useDataStore();
  const { filter, setFilter } = useUIStore();
  
  // Component logic
};
```

### Step 3: Replace Data Fetching Logic

**Before (Manual Sync):**
```typescript
const result = useRealTimeData(dataService, 3000, setTransactions) as any;
const { loading: hookLoading, error: hookError } = result;

React.useEffect(() => {
    setLoading(hookLoading);
    setError(hookError);
}, [hookLoading, hookError, setLoading, setError]);
```

**After (Integrated Hook):**
```typescript
const { loading, error, refetch } = useDataService({
  autoRefresh: true,
  interval: 3000,
  enabled: true
});
```

### Step 4: Update App.tsx

Replace the complex state management with clean, focused store usage:

```typescript
const App = () => {
  // Each store handles its own domain
  const { activeNav, mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { transactions, fiatTotal, cryptoTotal } = useDataStore();
  const { loading, error } = useAppStore();
  
  // Data fetching is now handled by useDataService hook
  const { refetch } = useDataService();
  
  // Rest of component logic...
};
```

## ✅ Benefits of New Architecture

### 1. **Better Performance**
- Components only re-render when their specific store changes
- No unnecessary re-renders from unrelated state updates

### 2. **Improved Type Safety**
- Each store has focused, well-typed interfaces
- No more `any` types or complex type assertions

### 3. **Easier Testing**
- Each store can be tested independently
- Mock stores are simpler and more focused

### 4. **Better Developer Experience**
- Clear separation of concerns
- Easier to find and modify specific functionality
- Better IntelliSense and autocomplete

### 5. **Scalability**
- Easy to add new stores for new features
- No risk of store becoming too large or complex

### 6. **Eliminated Prop Drilling**
- Components access exactly what they need
- No passing props through multiple component layers

## 🔄 Backward Compatibility

For gradual migration, the old `useStore` is still available:

```typescript
import { useStore } from './store/index';

// Still works, but deprecated for new code
const { activeNav, transactions, loading } = useStore();
```

## 📝 Migration Checklist

- [ ] Replace `useStore` imports with specific store imports
- [ ] Update component props to use direct store access
- [ ] Replace manual data fetching with `useDataService` hook
- [ ] Remove prop drilling from parent components
- [ ] Update tests to use focused stores
- [ ] Remove old store file after migration is complete

## 🚀 Next Steps

1. **Start with App.tsx** - Replace the main component first
2. **Migrate page components** - Update OverviewPage, FiatPage, etc.
3. **Update child components** - Remove prop dependencies
4. **Add new features** - Use the new store pattern for new functionality
5. **Clean up** - Remove old store and unused imports

This new architecture provides a solid foundation for scaling the application while maintaining clean, maintainable code! 🎯
