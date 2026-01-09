/**
 * Stripe Success Page URL Parameters
 */
export interface StripeSuccessParams {
    /** Checkout Stripe Session ID */
    checkoutId: string | null;
    /** Purchase ID (e.g. for subscriptions or one-time payments) */
    purchaseId: string | null;
    /** Payment type (e.g. "subscription" or "one-time") */
    type: string | null;
    /** Redirect URL after success */
    redirectUrl: string | null;
}

/**
 * Extracts Stripe success page parameters from URL search params
 *
 * Supports both short and long parameter names:
 * - c / checkout_id: Checkout Session ID
 * - p / purchase_id: Purchase ID
 * - t / type: Payment type
 * - r / redirect: Redirect URL
 *
 * @param searchParams - URLSearchParams object to parse
 * @returns Object containing extracted parameters
 *
 * @example
 * ```typescript
 * const url = 'https://pages.doctorina.com/stripe-success?t=subscription&p=019ba22b-e088-7a70-bae3-caeefe9c9aa5&c=%7BCHECKOUT_SESSION_ID%7D&r=https%3A%2F%2Fdoctorina-development.web.app%2F';
 * const params = new URLSearchParams(new URL(url).search);
 * const result = extractStripeSuccessParams(params);
 * // {
 * //   checkoutId: '{CHECKOUT_SESSION_ID}',
 * //   purchaseId: '019ba22b-e088-7a70-bae3-caeefe9c9aa5',
 * //   type: 'subscription',
 * //   redirectUrl: 'https://doctorina-development.web.app/'
 * // }
 * ```
 */
export function extractStripeSuccessParams(searchParams: URLSearchParams): StripeSuccessParams {
    return {
        // Checkout Stripe Session ID
        checkoutId: searchParams.get('c') || searchParams.get('checkout_id'),
        // Purchase ID
        purchaseId: searchParams.get('p') || searchParams.get('purchase_id'),
        // Payment type
        type: searchParams.get('t') || searchParams.get('type'),
        // Redirect URL
        redirectUrl: searchParams.get('r') || searchParams.get('redirect'),
    };
}

/**
 * Formats Stripe success parameters for console logging
 *
 * @param params - Stripe success parameters
 * @returns Formatted string for console output
 */
export function formatStripeSuccessLog(params: StripeSuccessParams): string {
    return `Stripe Success Page\nType: ${params.type || 'N/A'}\nCheckout ID: ${params.checkoutId || 'N/A'}\nPurchase ID: ${params.purchaseId || 'N/A'}`;
}
