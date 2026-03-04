
describe('validateBudget', () => {
  it('should reject negative', () => { expect(validators.validateBudget?.(-1) ?? null).not.toBeNull(); });
});
