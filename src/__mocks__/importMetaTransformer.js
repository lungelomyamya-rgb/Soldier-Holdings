// Jest transformer to handle import.meta.env
export default {
  process(src, filename) {
    // Replace import.meta.env with a mock object
    const transformed = src.replace(
      /import\.meta\.env/g,
      '({ MODE: \'test\', VITE_REACT_APP_VERSION: \'1.0.0-test\', VITE_REACT_APP_LOGGING_ENDPOINT: \'http://localhost:3000/logs\' })'
    );
    return transformed;
  },
};
