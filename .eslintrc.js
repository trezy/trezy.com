module.exports = {
  env: { browser: true },
  extends: '@fuelrats/eslint-config-react',
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'max-len': ['off'],
    'new-parens': ['error', 'never'],
    'semi-style': ['off'],

    // jsx-a11y
    'jsx-a11y/control-has-associated-label': ['off'],

    // react-hooks
    'react-hooks/exhaustive-deps': ['off'],

    // import
    'import/order': ['off'],
  },
}
