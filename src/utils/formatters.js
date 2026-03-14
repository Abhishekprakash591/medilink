/**
 * Formats a number as Indian Rupees
 * @param {number} amount
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a 10 digit Indian phone number
 * @param {string} phone 
 * @returns {string} Formatted phone string
 */
export const formatPhone = (phone) => {
  if (!phone || phone.length !== 10) return phone;
  return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
};

/**
 * Formats standard clinic date
 * @param {string} dateString 
 * @returns {string}
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};
