/**
 * Utility to mask sensitive information in text strings.
 * Used to enforce premium gating by redacting contact info and links in user-generated descriptions.
 */

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}/g;

// Improved phone regex to catch (XX) XXXXXXXXX, (XX)XXXXXXXX, XX XXXXXXXX, and XXXXXXXXX formats
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,3}\)?[-.\s]?)?\d{4,5}[-.\s]?\d{4,5}/g;

// Improved URL regex
const URL_REGEX = /(https?:\/\/[^\s/$.?#].[^\s]*)/gi;

// Instagram and other social handles
const HANDLE_REGEX = /@([a-zA-Z0-9._]+)/g;

/**
 * Masks emails, phone numbers, and external links in a given text.
 * @param text The source text to mask
 * @param isPremium Whether to bypass masking (if true, returns original text)
 * @returns Masked text
 */
export const maskSensitiveInfo = (text: string, isPremium: boolean = false): string => {
    if (!text || isPremium) return text;

    let maskedText = text;

    // Mask Emails
    maskedText = maskedText.replace(EMAIL_REGEX, '*******@*******.***');

    // Mask Phones
    maskedText = maskedText.replace(PHONE_REGEX, ' (**) *****-**** ');

    // Mask handles (@instagram)
    maskedText = maskedText.replace(HANDLE_REGEX, '@*********');

    // Mask external links
    maskedText = maskedText.replace(URL_REGEX, '[LINK PROTEGIDO]');

    return maskedText;
};
