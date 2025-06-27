// Utility functions for safe string operations

export const safeString = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
};

export const safeTrim = (value: any): string => {
  return safeString(value).trim();
};

export const safeNumber = (value: any): number => {
  const num = parseFloat(safeString(value));
  return isNaN(num) ? 0 : num;
};

export const isEmpty = (value: any): boolean => {
  return safeTrim(value).length === 0;
};

export const isValidNumber = (value: any): boolean => {
  const num = safeNumber(value);
  return num > 0;
};