import MockDataService from '../services/MockDataService';

describe('MockDataService', () => {
  it('generates initial transactions', async () => {
    const service = new MockDataService();
    const transactions = await service.getTransactions();
    expect(Array.isArray(transactions)).toBe(true);
    expect(transactions.length).toBeGreaterThan(0);
    transactions.forEach(tx => {
      expect(tx).toHaveProperty('id');
      expect(tx).toHaveProperty('type');
      expect(tx).toHaveProperty('amount');
    });
  });

  it('updates transaction status', async () => {
    const service = new MockDataService();
    const transactions = await service.getTransactions();
    const firstTx = transactions[0];
    const updated = await service.updateTransactionStatus(firstTx.id, 'verified');
    expect(updated?.status).toBe('verified');
    expect(updated?.statusText).toBe('Compliant');
  });
});
