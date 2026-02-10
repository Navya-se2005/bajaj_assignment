export const generateFibonacci = (n: any): number[] => {
  if (typeof n !== 'number' || !Number.isInteger(n) || n < 0) {
    throw new Error("Invalid input for fibonacci: must be a non-negative integer.");
  }
  if (n === 0) return [];
  if (n === 1) return [0];
  
  const result = [0, 1];
  for (let i = 2; i < n; i++) {
    result.push(result[i - 1] + result[i - 2]);
  }
  return result;
};

const isPrime = (num: number): boolean => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
};

export const filterPrimes = (arr: any): number[] => {
  if (!Array.isArray(arr) || !arr.every(n => typeof n === 'number' && Number.isInteger(n))) {
    throw new Error("Invalid input for prime: must be an array of integers.");
  }
  return arr.filter(isPrime);
};

const gcd = (a: number, b: number): number => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

const lcm = (a: number, b: number): number => {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a * b) / gcd(a, b));
};

export const calculateLcm = (arr: any): number => {
  if (!Array.isArray(arr) || arr.length === 0 || !arr.every(n => typeof n === 'number' && Number.isInteger(n))) {
    throw new Error("Invalid input for lcm: must be a non-empty array of integers.");
  }
  return arr.reduce((acc, val) => lcm(acc, val));
};

export const calculateHcf = (arr: any): number => {
  if (!Array.isArray(arr) || arr.length === 0 || !arr.every(n => typeof n === 'number' && Number.isInteger(n))) {
    throw new Error("Invalid input for hcf: must be a non-empty array of integers.");
  }
  return arr.reduce((acc, val) => gcd(acc, val));
};
