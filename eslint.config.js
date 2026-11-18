// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'coverage/*'],
  },
  {
    rules: {
      // Caja blanca: complejidad ciclomática V(G) máxima de 10 por función.
      // Si una función pasa de 10, divídanla en funciones más pequeñas.
      complexity: ['error', 10],
    },
  },
]);
