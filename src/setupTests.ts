import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder for Jest environment
import { TextEncoder } from 'util';

// @ts-ignore - TextDecoder polyfill for Jest
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;
