import { describe, it, expect } from 'vitest';
import { extractStripeSuccessParams, formatStripeSuccessLog } from './utils';

describe('extractStripeSuccessParams', () => {
    describe('short parameter names', () => {
        it('should extract all parameters using short names', () => {
            const searchParams = new URLSearchParams('t=subscription&p=019ba22b-e088-7a70-bae3-caeefe9c9aa5&c=sess_123abc&r=https://doctorina.com');
            const result = extractStripeSuccessParams(searchParams);

            expect(result).toEqual({
                type: 'subscription',
                purchaseId: '019ba22b-e088-7a70-bae3-caeefe9c9aa5',
                checkoutId: 'sess_123abc',
                redirectUrl: 'https://doctorina.com',
            });
        });

        it('should extract parameters from real-world encoded URL', () => {
            const url = 'https://pages.doctorina.com/stripe-success?t=subscription&p=019ba22b-e088-7a70-bae3-caeefe9c9aa5&c=%7BCHECKOUT_SESSION_ID%7D&r=https%3A%2F%2Fdoctorina-development.web.app%2F';
            const searchParams = new URLSearchParams(new URL(url).search);
            const result = extractStripeSuccessParams(searchParams);

            expect(result).toEqual({
                type: 'subscription',
                purchaseId: '019ba22b-e088-7a70-bae3-caeefe9c9aa5',
                checkoutId: '{CHECKOUT_SESSION_ID}',
                redirectUrl: 'https://doctorina-development.web.app/',
            });
        });

        it('should handle one-time payment type', () => {
            const searchParams = new URLSearchParams('t=one-time&p=purchase_xyz&c=sess_456def');
            const result = extractStripeSuccessParams(searchParams);

            expect(result.type).toBe('one-time');
        });
    });

    describe('long parameter names', () => {
        it('should extract all parameters using long names', () => {
            const searchParams = new URLSearchParams('type=subscription&purchase_id=019ba22b-e088-7a70-bae3-caeefe9c9aa5&checkout_id=sess_123abc&redirect=https://doctorina.com');
            const result = extractStripeSuccessParams(searchParams);

            expect(result).toEqual({
                type: 'subscription',
                purchaseId: '019ba22b-e088-7a70-bae3-caeefe9c9aa5',
                checkoutId: 'sess_123abc',
                redirectUrl: 'https://doctorina.com',
            });
        });
    });

    describe('mixed parameter names', () => {
        it('should prioritize short names when both present', () => {
            const searchParams = new URLSearchParams('t=subscription&type=one-time&p=purchase_1&purchase_id=purchase_2');
            const result = extractStripeSuccessParams(searchParams);

            expect(result.type).toBe('subscription'); // short name 't' wins
            expect(result.purchaseId).toBe('purchase_1'); // short name 'p' wins
        });

        it('should use long name as fallback when short name missing', () => {
            const searchParams = new URLSearchParams('type=subscription&p=purchase_123&redirect=https://doctorina.com');
            const result = extractStripeSuccessParams(searchParams);

            expect(result.type).toBe('subscription');
            expect(result.purchaseId).toBe('purchase_123');
            expect(result.redirectUrl).toBe('https://doctorina.com');
        });
    });

    describe('missing parameters', () => {
        it('should return null for missing parameters', () => {
            const searchParams = new URLSearchParams('');
            const result = extractStripeSuccessParams(searchParams);

            expect(result).toEqual({
                type: null,
                purchaseId: null,
                checkoutId: null,
                redirectUrl: null,
            });
        });

        it('should return null for individual missing parameters', () => {
            const searchParams = new URLSearchParams('t=subscription&p=purchase_123');
            const result = extractStripeSuccessParams(searchParams);

            expect(result.type).toBe('subscription');
            expect(result.purchaseId).toBe('purchase_123');
            expect(result.checkoutId).toBeNull();
            expect(result.redirectUrl).toBeNull();
        });
    });

    describe('special characters and encoding', () => {
        it('should handle URL-encoded values', () => {
            const searchParams = new URLSearchParams('r=https%3A%2F%2Fdoctorina.com%2Fpath%3Fquery%3Dvalue');
            const result = extractStripeSuccessParams(searchParams);

            expect(result.redirectUrl).toBe('https://doctorina.com/path?query=value');
        });

        it('should handle curly braces in checkout ID', () => {
            const searchParams = new URLSearchParams('c=%7BCHECKOUT_SESSION_ID%7D');
            const result = extractStripeSuccessParams(searchParams);

            expect(result.checkoutId).toBe('{CHECKOUT_SESSION_ID}');
        });

        it('should handle UUIDs in purchase ID', () => {
            const searchParams = new URLSearchParams('p=019ba22b-e088-7a70-bae3-caeefe9c9aa5');
            const result = extractStripeSuccessParams(searchParams);

            expect(result.purchaseId).toBe('019ba22b-e088-7a70-bae3-caeefe9c9aa5');
        });

        it('should handle redirect URL with special characters', () => {
            const encodedUrl = encodeURIComponent('https://doctorina-development.web.app/?session=abc&user=123');
            const searchParams = new URLSearchParams(`r=${encodedUrl}`);
            const result = extractStripeSuccessParams(searchParams);

            expect(result.redirectUrl).toBe('https://doctorina-development.web.app/?session=abc&user=123');
        });
    });

    describe('edge cases', () => {
        it('should handle empty string values as null', () => {
            // Note: URLSearchParams.get() returns empty string for parameters with no value,
            // but our function treats empty strings as missing (null) due to || operator
            const searchParams = new URLSearchParams('t=&p=&c=&r=');
            const result = extractStripeSuccessParams(searchParams);

            // Empty string parameters are treated as null (falsy || fallback behavior)
            expect(result.type).toBeNull();
            expect(result.purchaseId).toBeNull();
            expect(result.checkoutId).toBeNull();
            expect(result.redirectUrl).toBeNull();
        });

        it('should handle parameters with spaces', () => {
            const searchParams = new URLSearchParams('t=one time payment');
            const result = extractStripeSuccessParams(searchParams);

            expect(result.type).toBe('one time payment');
        });

        it('should handle very long parameter values', () => {
            const longId = 'a'.repeat(500);
            const searchParams = new URLSearchParams(`p=${longId}`);
            const result = extractStripeSuccessParams(searchParams);

            expect(result.purchaseId).toBe(longId);
        });
    });
});

describe('formatStripeSuccessLog', () => {
    it('should format all parameters correctly', () => {
        const params = {
            type: 'subscription',
            purchaseId: '019ba22b-e088-7a70-bae3-caeefe9c9aa5',
            checkoutId: 'sess_123abc',
            redirectUrl: 'https://doctorina.com',
        };

        const result = formatStripeSuccessLog(params);

        expect(result).toBe(
            'Stripe Success Page\n' +
            'Type: subscription\n' +
            'Checkout ID: sess_123abc\n' +
            'Purchase ID: 019ba22b-e088-7a70-bae3-caeefe9c9aa5'
        );
    });

    it('should show N/A for null values', () => {
        const params = {
            type: null,
            purchaseId: null,
            checkoutId: null,
            redirectUrl: null,
        };

        const result = formatStripeSuccessLog(params);

        expect(result).toBe(
            'Stripe Success Page\n' +
            'Type: N/A\n' +
            'Checkout ID: N/A\n' +
            'Purchase ID: N/A'
        );
    });

    it('should handle mixed null and valid values', () => {
        const params = {
            type: 'one-time',
            purchaseId: 'purchase_xyz',
            checkoutId: null,
            redirectUrl: null,
        };

        const result = formatStripeSuccessLog(params);

        expect(result).toBe(
            'Stripe Success Page\n' +
            'Type: one-time\n' +
            'Checkout ID: N/A\n' +
            'Purchase ID: purchase_xyz'
        );
    });

    it('should output format compatible with console.log', () => {
        const params = {
            type: 'subscription',
            purchaseId: '019ba22b-e088-7a70-bae3-caeefe9c9aa5',
            checkoutId: '{CHECKOUT_SESSION_ID}',
            redirectUrl: 'https://doctorina-development.web.app/',
        };

        const result = formatStripeSuccessLog(params);

        // Verify that newlines are properly embedded
        expect(result.split('\n')).toHaveLength(4);
        expect(result).toContain('Stripe Success Page');
        expect(result).toContain('Type: subscription');
        expect(result).toContain('Checkout ID: {CHECKOUT_SESSION_ID}');
        expect(result).toContain('Purchase ID: 019ba22b-e088-7a70-bae3-caeefe9c9aa5');
    });
});
