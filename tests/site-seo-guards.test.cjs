const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')

function load(file) {
    const exports = {}
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
    vm.runInNewContext(code, { exports, URL })
    return exports
}

test('verification bootstrap hides only an already confirmed session, including storage failure', () => {
    const { AGE_GATE_BOOTSTRAP } = load('lib/ageGate.ts')
    for (const confirmed of [null, 'true']) {
        const document = { documentElement: { dataset: {} } }
        vm.runInNewContext(AGE_GATE_BOOTSTRAP, { document, sessionStorage: { getItem: () => confirmed } })
        assert.equal(document.documentElement.dataset.ageConfirmed, confirmed ? 'true' : undefined)
    }
    const document = { documentElement: { dataset: {} } }
    assert.doesNotThrow(() => vm.runInNewContext(AGE_GATE_BOOTSTRAP, { document, sessionStorage: { getItem: () => { throw Error('blocked') } } }))
    assert.equal(document.documentElement.dataset.ageConfirmed, undefined)
})

test('home film waits behind verification, starts on confirmation and pauses out of view', () => {
    const source = fs.readFileSync('components/home/VerticalCampaignSequence.tsx', 'utf8')
    const hook = source.slice(source.indexOf('function useViewportVideoPlayback()'), source.indexOf('function ClosingHeroVideo'))
    let plays = 0
    let pauses = 0
    let observe
    let cleanup
    const listeners = new Map()
    const video = { play: () => { plays++; return Promise.resolve() }, pause: () => { pauses++ } }
    const document = { documentElement: { dataset: {} }, querySelector: () => ({}) }
    const code = ts.transpileModule(hook + '\nuseViewportVideoPlayback()', { compilerOptions: { target: ts.ScriptTarget.ES2020 } }).outputText
    vm.runInNewContext(code, {
        document,
        useRef: () => ({ current: video }),
        useEffect: callback => { cleanup = callback() },
        IntersectionObserver: class { constructor(callback) { observe = callback } observe() {} disconnect() {} },
        window: { addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: name => listeners.delete(name) },
    })
    observe([{ isIntersecting: true }])
    assert.equal(plays, 0)
    document.documentElement.dataset.ageConfirmed = 'true'
    listeners.get('dyane-age-confirmed')()
    assert.equal(plays, 1)
    observe([{ isIntersecting: false }])
    assert.equal(pauses, 1)
    cleanup()
    assert.equal(listeners.size, 0)
})

test('closed shop has artwork semantics and no commercial data', () => {
    const { getPublicOffer, workIdentity, workDetails } = load('lib/productStructuredData.ts')
    const url = 'https://www.dyaneparis.com/oeuvres/dyane-no1-pornstar-martini'
    assert.equal(getPublicOffer('dyane-no1-pornstar-martini', 'fr'), null)
    assert.equal(workIdentity(url, null)['@type'], 'VisualArtwork')
    assert.equal(workIdentity(url, null)['@id'], `${url}#artwork`)
    assert.equal(workDetails(null, 'fr', 'org').offers, undefined)
})

test('an Offer requires an open shop and complete localized public data', () => {
    const { getPublicOffer, workIdentity, workDetails } = load('lib/productStructuredData.ts')
    // Synthetic fixture only; no price or stock is published by this test.
    const slug = 'dyane-no1-pornstar-martini'
    const offer = { price: '123.45', priceCurrency: 'EUR', availability: 'InStock', url: `https://www.dyaneparis.com/oeuvres/${slug}` }
    const shop = (entry, open = true) => ({ open, offers: { [slug]: { fr: entry } } })
    assert.equal(getPublicOffer(slug, 'fr', shop(offer, false)), null)
    assert.equal(getPublicOffer(slug, 'en', shop(offer)), null)
    for (const change of [{ price: '' }, { price: '0' }, { price: '-1' }, { price: 'NaN' }, { price: '9'.repeat(400) }, { price: '1.234' }, { priceCurrency: 'USD' }, { availability: '' }, { url: 'javascript:alert(1)' }, { url: 'https://example.com/' }, { url: 'https://www.dyaneparis.com/oeuvres/old-70-cl' }, { url: 'https://user:pass@www.dyaneparis.com/' }]) {
        assert.equal(getPublicOffer(slug, 'fr', shop({ ...offer, ...change })), null)
    }
    const accepted = getPublicOffer(slug, 'fr', shop(offer))
    assert.equal(accepted, offer)
    assert.equal(workIdentity(offer.url, accepted)['@type'], 'Product')
    const details = workDetails(accepted, 'fr', 'org')
    assert.equal(details.offers.price, '123.45')
    assert.equal(details.offers.priceCurrency, 'EUR')
    assert.equal(details.offers.url, offer.url)
    assert.equal(details.offers.availability, 'https://schema.org/InStock')
    assert.equal(details.review, undefined)
    assert.equal(details.aggregateRating, undefined)
})
