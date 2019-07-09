module.exports = {
  env: { browser: true },
  extends: '@fuelrats/eslint-config-react',
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'max-len': ['warn', { ignoreStrings: true }],
  },
}
