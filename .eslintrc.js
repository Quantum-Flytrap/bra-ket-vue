module.exports = {
    root: true,
    env: {
      node: true,
    },
    extends: [
      'plugin:vue/vue3-recommended',
      '@vue/airbnb',
      '@vue/typescript',
      'plugin:vue-scoped-css/vue3-recommended',
    ],
    parserOptions: {
      parser: '@typescript-eslint/parser',
    },
    "rules": {
      'max-len': ["error", { "code": 120 }],
      'no-console': 'off',
      'no-debugger':  'error',
      "class-methods-use-this": 0, // https://github.com/vuejs/vue-cli/issues/1203
      "no-unused-vars": "off", // https://stackoverflow.com/questions/55280555/
      "@typescript-eslint/no-unused-vars": "error", // https://stackoverflow.com/questions/55280555/
    }
  };
