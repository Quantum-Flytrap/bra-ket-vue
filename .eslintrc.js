module.exports = {
    root: true,
    env: {
      node: true,
    },
    extends: [
      'plugin:vue/essential',
      '@vue/airbnb',
      '@vue/typescript',
    ],
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
    parserOptions: {
      parser: '@typescript-eslint/parser',
    },
    "rules": {
      "class-methods-use-this": 0, // https://github.com/vuejs/vue-cli/issues/1203
      "no-unused-vars": "off", // https://stackoverflow.com/questions/55280555/
      "@typescript-eslint/no-unused-vars": "error" // https://stackoverflow.com/questions/55280555/
    }
  };
  