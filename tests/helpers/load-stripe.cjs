const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')

// Run the same server modules outside Next.js, with explicit dependency substitutes.
function load(file, mocks = {}, cache = new Map()) {
  file = path.resolve(file)
  if (cache.has(file)) return cache.get(file)
  const module = { exports: {} }
  cache.set(file, module.exports)
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText
  const localRequire = name => {
    if (name === 'server-only') return {}
    if (Object.hasOwn(mocks, name)) return mocks[name]
    if (name.startsWith('.') || name.startsWith('@/')) {
      return load((name.startsWith('@/') ? path.resolve(name.slice(2)) : path.resolve(path.dirname(file), name)) + '.ts', mocks, cache)
    }
    return require(name)
  }
  vm.runInNewContext(code, { module, exports: module.exports, require: localRequire, process, URL, Buffer, Date, Set, console }, { filename: file })
  cache.set(file, module.exports)
  return module.exports
}
module.exports = { load }
