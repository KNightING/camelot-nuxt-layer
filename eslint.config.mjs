// @ts-check
// import withNuxt from './.nuxt/eslint.config.mjs'
import withNuxt from './.playground/.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    ignores: ['**/electron/release/**', '**/electron/build/**', '**/android/**', '**/ios/**'],
  },
  // Your custom configs here
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/block-order': ['error', {
        order: ['template', 'script', 'style'],
      }],
      // Note: you must disable the base rule as it can report incorrect errors
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      }],
      'func-call-spacing': 'off',
      'require-await': 'off',
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@stylistic/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-empty': 'off',
      // 強迫所有花括號換行
      'object-curly-newline': ['error', {
        ObjectExpression: {
          multiline: true,
          consistent: true,
        },
        ObjectPattern: {
          multiline: true,
          minProperties: 2,
        }, // 當解構屬性 >= 2 個時強迫換行
        ImportDeclaration: {
          multiline: true,
          consistent: true,
        },
        ExportDeclaration: {
          multiline: true,
          consistent: true,
        },
      }],
      // 強迫所有屬性換行
      'object-property-newline': ['error', {
        allowAllPropertiesOnSameLine: false, // 禁止所有屬性寫在同一行
      }],
    },
  },
)
