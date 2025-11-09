export const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
export const PHONE_RE = /(\+?\d{1,3}[\s\-]?)?(\(?\d{2,4}\)?[\s\-]?)?[\d\s\-]{5,}/;
export const POSTAL_RE = /\b\d{4,6}\b/;

export function regexChecks(inputText = "", email, phone, addressBlob) {
  const email_regex_match = EMAIL_RE.test(inputText) || (!!email && EMAIL_RE.test(email));
  const phone_regex_match = PHONE_RE.test(inputText) || (!!phone && PHONE_RE.test(phone));
  const address_regex_match = !!(
    addressBlob && (POSTAL_RE.test(addressBlob) || POSTAL_RE.test(inputText))
  );
  return { email_regex_match, phone_regex_match, address_regex_match };
}

