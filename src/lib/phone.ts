import { parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js';

const PHONE_REGEX = /\+?\d[\d\s().-]{6,}/g;

export function extractPhonesWithContext(
  text: string,
  defaultCountry: CountryCode = 'US'
) {
  const results: { raw: string; e164?: string; index: number }[] = [];
  const seen = new Set<string>();

  PHONE_REGEX.lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = PHONE_REGEX.exec(text)) !== null) {
    const raw = m[0].trim();
    const parsed = parsePhoneNumberFromString(raw, { defaultCountry });
    const e164 = parsed?.isPossible() ? parsed.number : undefined;
    const key = e164 ?? raw;
    if (seen.has(key)) continue;
    seen.add(key);
    results.push({ raw, e164, index: m.index ?? 0 });
  }

  return results;
}
