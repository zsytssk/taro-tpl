const assets = '.less|.svg|.png|.jpg|.svg|.svga|.css|.scss';

module.exports = {
  tabWidth: 2,
  singleQuote: true,
  semi: true,
  'no-prose-wrap': true,
  trailingComma: 'all',
  'comma-dangle': [2, 'always-multiline'],
  importOrderParserPlugins: ['jsx', 'js', 'tsx', 'tsx'],
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    `^@/(.*)(?<!${assets})$`,
    `^[(./|../)](.*)(?<!${assets})$`,
    `${assets}$`,
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: [
    'typescript',
    'classProperties',
    'decorators-legacy',
    'jsx',
  ],
};
