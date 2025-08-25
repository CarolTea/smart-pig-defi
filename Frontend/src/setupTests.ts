import '@testing-library/jest-dom';

// Mock IntersectionObserver
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: class {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  },
});

// Mock ResizeObserver
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: class {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  },
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // Deprecated
    removeListener: () => {}, // Deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: () => {},
});

// Mock getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: () => ({
    getPropertyValue: () => '',
  }),
});

// Mock crypto for Stellar SDK
Object.defineProperty(globalThis, 'crypto', {
  value: {
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
    subtle: {
      importKey: () => Promise.resolve({} as CryptoKey),
      exportKey: () => Promise.resolve(new ArrayBuffer(0)),
      sign: () => Promise.resolve(new ArrayBuffer(0)),
      verify: () => Promise.resolve(false),
    },
  },
});

// Mock TextEncoder/TextDecoder - use native implementations if available
if (typeof TextEncoder === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).TextEncoder = class {
    encode(input = '') {
      const bytes = new Uint8Array(input.length);
      for (let i = 0; i < input.length; i++) {
        bytes[i] = input.charCodeAt(i);
      }
      return bytes;
    }
  };
}

if (typeof TextDecoder === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).TextDecoder = class {
    decode(input?: Uint8Array) {
      if (!input) return '';
      return String.fromCharCode(...Array.from(input));
    }
  };
}

// Mock fetch
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).fetch = () => {
  return Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
    json: async () => ({}),
    text: async () => '',
    blob: async () => new Blob(),
    arrayBuffer: async () => new ArrayBuffer(0),
    clone: () => ({}),
  });
};