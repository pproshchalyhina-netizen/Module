const calculateDiscount = require('./discount');

describe('calculateDiscount', () => {
    // 1. Тести для vip та regular клієнтів
    test('should apply 20% discount for vip customers', () => {
        expect(calculateDiscount(100, 'vip')).toBe(80);
        expect(calculateDiscount(250, 'vip')).toBe(200);
    });

    test('should apply 5% discount for regular customers', () => {
        expect(calculateDiscount(100, 'regular')).toBe(95);
        expect(calculateDiscount(200, 'regular')).toBe(190);
    });

    // 2. Тест для випадку без знижки (невідомий або відсутній тип клієнта)
    test('should return full price if customer type is unknown or missing', () => {
        expect(calculateDiscount(100, 'guest')).toBe(100);
        expect(calculateDiscount(100)).toBe(100); // undefined
    });

    // 3. Граничний випадок price === 0
    test('should return 0 when price is 0 regardless of customer type', () => {
        expect(calculateDiscount(0, 'vip')).toBe(0);
        expect(calculateDiscount(0, 'regular')).toBe(0);
        expect(calculateDiscount(0, 'unknown')).toBe(0);
    });

    // 4. Викидання помилки при від'ємній ціні
    test('should throw an error if price is negative', () => {
        expect(() => calculateDiscount(-1, 'vip')).toThrow('Invalid price');
        expect(() => calculateDiscount(-100, 'regular')).toThrow('Invalid price');
    });

    // Додаткові граничні випадки, які ШІ часто пропускає (покращення точності тестів)
    test('should handle edge cases with floating point numbers correctly', () => {
        // Тест на роботу з дробовими числами (уникнення класичних багів JS на кшталт 0.1 + 0.2)
        expect(calculateDiscount(10.5, 'vip')).toBeCloseTo(8.4);
    });
});
