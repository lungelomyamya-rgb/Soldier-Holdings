/**
 * Utility and Advanced Types
 * 
 * Utility types, advanced TypeScript patterns, and helper types
 */

// Basic utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Advanced utility types
export type NonNullable<T> = T extends null | undefined ? never : T;
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// Array utility types
export type ArrayElement<T> = T extends (infer U)[] ? U : never;
export type ArrayLength<T extends readonly unknown[]> = T['length'];
export type FirstElement<T extends readonly unknown[]> = T[0];
export type LastElement<T extends readonly unknown[]> = T[number];

// Function utility types
export type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
export type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
export type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (...args: any) => Promise<infer R> ? R : never;

// Object utility types
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type ValuesOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? T[K] : never;
}[keyof T];

export type PickByType<T, U> = Pick<T, KeysOfType<T, U>>;

// Conditional types
export type IsNever<T> = [T] extends [never] ? true : false;
export type IsAny<T> = 0 extends 1 & T ? true : false;
export type IsUnknown<T> = IsAny<T> extends true ? false : unknown extends T ? true : false;

// String manipulation types
export type Capitalize<T extends string> = T extends `${infer F}${infer R}` 
  ? `${Uppercase<F>}${R}` 
  : T;

export type Uncapitalize<T extends string> = T extends `${infer F}${infer R}` 
  ? `${Lowercase<F>}${R}` 
  : T;

// Event handler types
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// Promise utility types
export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
export type PromiseFulfilledResult<T> = {
  status: 'fulfilled';
  value: T;
};
export type PromiseRejectedResult = {
  status: 'rejected';
  reason: unknown;
};
export type PromiseSettledResult<T> = PromiseFulfilledResult<T> | PromiseRejectedResult;

// Constructor types
export type Constructor<T = {}> = new (...args: any[]) => T;
export type AbstractConstructor<T = {}> = abstract new (...args: any[]) => T;

// Brand types for type safety
export type Brand<T, B> = T & { __brand: B };
export type BrandedString<B> = Brand<string, B>;
export type BrandedNumber<B> = Brand<number, B>;

// Example branded types
export type UserID = BrandedString<'UserID'>;
export type TransactionID = BrandedNumber<'TransactionID'>;

// Validation types
export type Validator<T> = (value: unknown) => value is T;
export type Schema<T> = {
  [K in keyof T]: Validator<T[K]>;
};

// Performance monitoring types
export type PerformanceMetric = {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percentage';
  timestamp: number;
};

// Debounce and throttle types
export type DebouncedFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  cancel(): void;
  flush(): ReturnType<T> | undefined;
};

export type ThrottledFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  cancel(): void;
};
