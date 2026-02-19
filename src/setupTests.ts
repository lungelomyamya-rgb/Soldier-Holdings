import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder for Jest environment
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
