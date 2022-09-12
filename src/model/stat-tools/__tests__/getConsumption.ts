import { getStandardError } from '../getConsumption';

describe('getStandardError', () => {
    it('Should return good standard error in percentage (~5)', () => {
        const values = [12, 14, 14, 16];
        const result = getStandardError(values, 14);
        expect(result).toBe(5.832_118_435_198_042);
    });

    it('Should return good standard error in percentage (0)', () => {
        const values = [14, 14, 14];
        const result = getStandardError(values, 14);
        expect(result).toBe(0);
    });
});
