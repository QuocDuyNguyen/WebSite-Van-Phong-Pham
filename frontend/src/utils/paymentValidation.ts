export const EXPIRY_REGEX = /^(0[1-9]|1[0-2])\/\d{2}$/;

export const isCardExpired = (expiryDate: string) => {
  const normalizedExpiryDate = expiryDate.trim();
  if (!EXPIRY_REGEX.test(normalizedExpiryDate)) return true;

  const [monthText, yearText] = normalizedExpiryDate.split('/');
  const month = Number(monthText);
  const year = 2000 + Number(yearText);

  // JavaScript month index is 0-based. Passing `month` here gives the first day
  // of the month AFTER the expiry month, so the card is valid until the end of
  // the expiry month.
  const firstDayAfterExpiryMonth = new Date(year, month, 1);
  const today = new Date();

  return firstDayAfterExpiryMonth <= today;
};

export const validatePayment = (expiryDate: string) => {
  const normalizedExpiryDate = expiryDate.trim();

  if (!EXPIRY_REGEX.test(normalizedExpiryDate)) {
    return 'Expiry date must use MM/YY format, for example 08/27.';
  }

  if (isCardExpired(normalizedExpiryDate)) {
    return 'This card has expired. Please use a card with a future expiry date.';
  }

  return '';
};

export const maskCardNumber = (cardNumber: string) => {
  const digitsOnly = cardNumber.replace(/\D/g, '');
  const lastFour = digitsOnly.slice(-4) || '0000';
  return `Card ending in ${lastFour}`;
};
