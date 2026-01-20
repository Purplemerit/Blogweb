// List of common disposable email domains
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com',
  'throwaway.email',
  'guerrillamail.com',
  'mailinator.com',
  '10minutemail.com',
  'trashmail.com',
  'temp-mail.org',
  'getnada.com',
  'maildrop.cc',
  'yopmail.com',
  'daikoa.com',
  'sharklasers.com',
  'guerrillamail.info',
  'grr.la',
  'guerrillamail.biz',
  'guerrillamail.de',
  'spam4.me',
  'tempmail.net',
  'emailondeck.com',
  'fakeinbox.com',
  'mailnesia.com',
  'mytemp.email',
  'temp-mail.io',
  'mohmal.com',
  'emailfake.com',
  'throwawaymail.com',
  'dispostable.com',
  'mintemail.com',
  'anonbox.net',
  'e4ward.com',
  'tmails.net',
  'trbvm.com',
  'jourrapide.com',
  'rhyta.com',
  'teleworm.us',
  'cuvox.de',
  'einrot.com',
  'fleckens.hu',
  'gustr.com',
  'dayrep.com',
  'armyspy.com',
  'superrito.com',
  'privacy.net',
  'guerrillamailblock.com',
  'naprb.com',
  'civvic.com',
  'bbitj.com',
  'dpptd.com',
  'huisaf.com',
  'iffmh.com',
  'jollyfree.com',
  'klzlk.com',
  'laafd.com',
  'midiharmonica.com',
  'nctuoc.com',
  'ohaaa.de',
  'psnator.com',
  'qvap.ru',
  'rqoiy.com',
  'smap.4nmv.ru',
  'tafmail.com',
  'ufgqq.com',
  'vixletdev.com',
  'wegwerfmail.de',
  'xojxe.com',
  'yomail.info',
  'zeroe.ml',
  'temp.mvrht.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'pokemail.net',
  'spam.la',
  'tempinbox.com',
  'throwawayemailaddress.com',
  '20minutemail.com',
  'mailcatch.com',
  'mailexpire.com',
  'mailforspam.com',
  'mailfreeonline.com',
  'mailimate.com',
  'mailin8r.com',
  'mailmoat.com',
  'mailscrap.com',
  'mailshell.com',
  'mailsiphon.com',
  'mailtemp.info',
  'mailtothis.com',
  'mailzilla.com',
  'mytrashmail.com',
  'netmails.com',
  'nepwk.com',
  'nospam.ze.tc',
  'nospamfor.us',
  'nowmymail.com',
  'spambog.com',
  'spambox.us',
  'spamfree24.org',
  'spamgourmet.com',
  'spaml.de',
  'deadaddress.com',
  'despam.it',
  'discardmail.com',
  'disposableemailaddresses.com',
]

// List of trusted email providers
const TRUSTED_EMAIL_PROVIDERS = [
  // Google
  'gmail.com',
  'googlemail.com',

  // Microsoft
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'outlook.in',
  'hotmail.co.uk',
  'live.co.uk',

  // Apple
  'icloud.com',
  'me.com',
  'mac.com',

  // Yahoo
  'yahoo.com',
  'yahoo.co.uk',
  'yahoo.in',
  'ymail.com',
  'rocketmail.com',

  // Privacy-focused
  'protonmail.com',
  'proton.me',
  'pm.me',
  'tutanota.com',
  'tuta.io',

  // Business/Professional
  'zoho.com',
  'mail.com',
  'gmx.com',
  'gmx.net',
  'fastmail.com',
  'fastmail.fm',
  'hushmail.com',

  // Other popular providers
  'aol.com',
  'yandex.com',
  'yandex.ru',
  'mail.ru',
  'rediffmail.com',
  'inbox.com',
  'mailfence.com',
  'runbox.com',
  'posteo.de',
  'startmail.com',
  'tutamail.com',
  'kolabnow.com',
]

/**
 * Check if an email is from a disposable/temporary email provider
 */
export function isDisposableEmail(email: string): boolean {
  const domain = email.toLowerCase().split('@')[1]
  if (!domain) return true

  return DISPOSABLE_EMAIL_DOMAINS.includes(domain)
}

/**
 * Check if an email is from a trusted provider
 */
export function isTrustedEmail(email: string): boolean {
  const domain = email.toLowerCase().split('@')[1]
  if (!domain) return false

  return TRUSTED_EMAIL_PROVIDERS.includes(domain)
}

/**
 * Validate email format and check if it's from a trusted provider
 */
export function validateEmail(email: string): { valid: boolean; message?: string } {
  // Basic format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Invalid email format' }
  }

  // Check if it's a disposable email
  if (isDisposableEmail(email)) {
    return {
      valid: false,
      message: 'Temporary or disposable email addresses are not allowed. Please use a permanent email address.',
    }
  }

  // Enforce only trusted providers for maximum security
  if (!isTrustedEmail(email)) {
    return {
      valid: false,
      message: 'Please use a trusted email provider (Gmail, Outlook, Yahoo, Hotmail, iCloud, ProtonMail, Zoho, etc.)',
    }
  }

  return { valid: true }
}

/**
 * Check if email domain exists (basic DNS check simulation)
 * Note: This is a basic check. For production, you might want to use a proper email verification service
 */
export function hasValidDomain(email: string): boolean {
  const domain = email.toLowerCase().split('@')[1]
  if (!domain) return false

  // Check for common issues
  if (domain.includes('..') || domain.startsWith('.') || domain.endsWith('.')) {
    return false
  }

  // Must have at least one dot
  if (!domain.includes('.')) {
    return false
  }

  return true
}
