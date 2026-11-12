// Remove all-caps presentation while retaining existing sentence case and the House's name.
export function editorialCase(text: string) {
  if (text !== text.toLocaleUpperCase() || text === text.toLocaleLowerCase()) return text
  return text.toLocaleLowerCase()
    .replace(/^([^\p{L}]*)(\p{L})/u, (_, prefix: string, letter: string) => prefix + letter.toLocaleUpperCase())
    .replace(/\bdyane\b/g, 'Dyane')
    .replace(/\bparis\b/g, 'Paris')
    .replace(/\bfrance\b/g, 'France')
    .replace(/^(i{1,3}|iv|v)(?=\s*[·.])/i, numeral => numeral.toUpperCase())
}
