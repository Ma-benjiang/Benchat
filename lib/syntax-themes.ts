// 自定义语法高亮主题
// 基于 Tokyo Night 主题

export const tokyoNightDark = {
  'code[class*="language-"]': {
    color: '#9ABDF5',
    fontFamily: 'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    fontSize: '0.9em',
    tabSize: 4,
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    color: '#9ABDF5',
    fontFamily: 'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    tabSize: 4,
    hyphens: 'none',
    padding: '1em',
    margin: '0',
    overflow: 'auto',
    background: 'transparent',
  },
  ':not(pre) > code[class*="language-"]': {
    background: '#1a1b26',
    padding: '0.1em 0.3em',
    borderRadius: '0.3em',
    whiteSpace: 'normal',
  },
  comment: {
    color: '#565f89',
    fontStyle: 'italic',
  },
  prolog: {
    color: '#565f89',
  },
  doctype: {
    color: '#565f89',
  },
  cdata: {
    color: '#565f89',
  },
  punctuation: {
    color: '#9abdf5',
  },
  property: {
    color: '#f7768e',
  },
  tag: {
    color: '#f7768e',
  },
  boolean: {
    color: '#ff9e64',
  },
  number: {
    color: '#ff9e64',
  },
  constant: {
    color: '#f7768e',
  },
  symbol: {
    color: '#f7768e',
  },
  deleted: {
    color: '#f7768e',
  },
  selector: {
    color: '#9ece6a',
  },
  'attr-name': {
    color: '#ff9e64',
  },
  string: {
    color: '#9ece6a',
  },
  char: {
    color: '#9ece6a',
  },
  builtin: {
    color: '#bb9af7',
  },
  inserted: {
    color: '#9ece6a',
  },
  operator: {
    color: '#89ddff',
  },
  entity: {
    color: '#89ddff',
    cursor: 'help',
  },
  url: {
    color: '#89ddff',
  },
  '.language-css .token.string': {
    color: '#89ddff',
  },
  '.style .token.string': {
    color: '#89ddff',
  },
  variable: {
    color: '#c0caf5',
  },
  atrule: {
    color: '#7dcfff',
  },
  'attr-value': {
    color: '#7dcfff',
  },
  keyword: {
    color: '#7dcfff',
  },
  function: {
    color: '#bb9af7',
  },
  'class-name': {
    color: '#bb9af7',
  },
  regex: {
    color: '#ff9e64',
  },
  important: {
    color: '#ff9e64',
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
};

export const tokyoNightLight = {
  'code[class*="language-"]': {
    color: '#343b58',
    fontFamily: 'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    fontSize: '0.9em',
    tabSize: 4,
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    color: '#343b58',
    fontFamily: 'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    tabSize: 4,
    hyphens: 'none',
    padding: '1em',
    margin: '0',
    overflow: 'auto',
    background: 'transparent',
  },
  ':not(pre) > code[class*="language-"]': {
    background: '#f0f0f0',
    padding: '0.1em 0.3em',
    borderRadius: '0.3em',
    whiteSpace: 'normal',
  },
  comment: {
    color: '#8a9199',
    fontStyle: 'italic',
  },
  prolog: {
    color: '#8a9199',
  },
  doctype: {
    color: '#8a9199',
  },
  cdata: {
    color: '#8a9199',
  },
  punctuation: {
    color: '#33374c',
  },
  property: {
    color: '#f52a65',
  },
  tag: {
    color: '#f52a65',
  },
  boolean: {
    color: '#b15c00',
  },
  number: {
    color: '#b15c00',
  },
  constant: {
    color: '#f52a65',
  },
  symbol: {
    color: '#f52a65',
  },
  deleted: {
    color: '#f52a65',
  },
  selector: {
    color: '#587539',
  },
  'attr-name': {
    color: '#b15c00',
  },
  string: {
    color: '#587539',
  },
  char: {
    color: '#587539',
  },
  builtin: {
    color: '#7847bd',
  },
  inserted: {
    color: '#587539',
  },
  operator: {
    color: '#2e7de9',
  },
  entity: {
    color: '#2e7de9',
    cursor: 'help',
  },
  url: {
    color: '#2e7de9',
  },
  '.language-css .token.string': {
    color: '#2e7de9',
  },
  '.style .token.string': {
    color: '#2e7de9',
  },
  variable: {
    color: '#33374c',
  },
  atrule: {
    color: '#07879d',
  },
  'attr-value': {
    color: '#07879d',
  },
  keyword: {
    color: '#07879d',
  },
  function: {
    color: '#7847bd',
  },
  'class-name': {
    color: '#7847bd',
  },
  regex: {
    color: '#b15c00',
  },
  important: {
    color: '#b15c00',
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
};
