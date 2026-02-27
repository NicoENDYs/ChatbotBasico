const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = [
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        console: "readonly",
        process: "readonly",
        module: "readonly",
        require: "readonly",
        __dirname: "readonly"
        // ... otras globales de Node si son necesarias
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off", // Permitir console.log en un bot básico
      "no-undef": "error",
      "prettier/prettier": "error",
    },
  }
];
