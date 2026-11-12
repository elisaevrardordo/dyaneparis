const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')

const registry = JSON.parse(fs.readFileSync('content/imageRightsRegistry.json', 'utf8'))
const exportsObject = {}
const code = ts.transpileModule(fs.readFileSync('lib/imageRights.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText
vm.runInNewContext(code, {
    exports: exportsObject, URL,
    require: name => {
        assert.equal(name, '@/content/imageRightsRegistry.json')
        return registry
    },
})
const { imageRightsFor, imageRightsKey, imageRightsMetadata } = exportsObject

test('all 145 validated identities resolve without changing their human status', () => {
    assert.equal(registry.images.length, 145)
    assert.equal(registry.images.filter(x => x.status === 'CONFIRMED_DYANE').length, 103)
    assert.equal(registry.images.filter(x => x.status === 'CONFIRMED_DYANE_USE').length, 42)
    const keys = registry.images.flatMap(x => x.keys)
    assert.equal(new Set(keys).size, keys.length)
    for (const entry of registry.images) {
        assert.equal(imageRightsFor(entry.url)?.id, entry.id)
        const metadata = imageRightsMetadata(entry.url)
        assert.equal(metadata.copyrightNotice, entry.classification === 'DYANE' ? 'Dyane Paris' : undefined)
        for (const field of ['creator', 'creditText', 'license', 'acquireLicensePage']) {
            assert.equal(field in metadata, false, `${entry.id}: unsupported ${field}`)
        }
    }
})

test('delivery sizes and Next image wrapping resolve the same validated visual', () => {
    const entry = registry.images.find(x => x.url.includes('/image/upload/v'))
    const delivery = entry.url.replace('/upload/v', '/upload/f_auto,c_limit,w_640,q_85/v')
    assert.equal(imageRightsFor(delivery)?.id, entry.id)
    assert.equal(imageRightsFor('/_next/image?url=' + encodeURIComponent(delivery) + '&w=640&q=85')?.id, entry.id)
    const local = registry.images.find(x => x.url.startsWith('https://www.dyaneparis.com/'))
    const path = new URL(local.url).pathname
    assert.equal(imageRightsFor(path)?.id, local.id)
    assert.equal(imageRightsFor('/_next/image?url=' + encodeURIComponent(path) + '&w=640&q=85')?.id, local.id)
})

test('unknown versions, media types, accounts and external URLs never inherit ownership', () => {
    const entry = registry.images.find(x => x.url.includes('/image/upload/v'))
    const changed = [
        entry.url.replace(/\/v\d+\//, '/v1/'),
        entry.url.replace('/dazhkrimv/', '/another-account/'),
        entry.url.replace('/image/', '/video/'),
        entry.url.replace(/\.[^.]+$/, '.unknown'),
        'https://example.com' + new URL(entry.url).pathname,
        'https://example.com/_next/image?url=' + encodeURIComponent(entry.url),
        'javascript:alert(1)',
        'https://www.dyaneparis.com/unknown-image.png',
    ]
    for (const url of changed) {
        assert.equal(imageRightsFor(url), undefined, url)
        assert.equal(Object.keys(imageRightsMetadata(url)).length, 0, url)
    }
    assert.equal(imageRightsKey('https://res.cloudinary.com/dazhkrimv/image/upload/v123/folder/v456/file.png'),
        'cloudinary:dazhkrimv:image:upload:v123:folder/v456/file.png')
})
