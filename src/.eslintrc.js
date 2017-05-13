module.exports = {
  "extends": 'eslint-config-rackt',
  "plugins": [
    "react"
  ],
  'rules': {
    "semi": 2,
    'arrow-parens': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    "no-unused-vars": 0,
    "no-console": 0,
    "valid-jsdoc": 2,
    "react/jsx-uses-react": 1,
    "react/jsx-no-undef": 2,
    "react/jsx-wrap-multilines": 2
  }
}
