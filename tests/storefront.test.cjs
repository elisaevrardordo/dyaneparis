const test = require('node:test')
const assert = require('node:assert/strict')
const { existsSync } = require('node:fs')
const { load } = require('./helpers/load-stripe.cjs')
const { featuredWorks, featuredPrice, sculpturePages, storefront } = load('content/storefront.ts')

test('five creations have fixed-size product pages and only confirmed displayed prices', () => {
  assert.equal(featuredWorks.length,5)
  assert.equal(new Set(featuredWorks.map(work => work.id)).size,5)
  assert.equal(new Set(featuredWorks.map(work => work.href)).size,5)
  assert.deepEqual(Array.from(featuredWorks,featuredPrice),[5500,18500,5500,18500,57000])
  assert.equal(sculpturePages.length,4)
  for (const collection of ['no1', 'no2']) {
    const works = featuredWorks.filter(work => work.collection === collection)
    assert.deepEqual(Array.from(works, work => work.format), ['25 cl', '1,5 L'])
    for (const work of works) assert.match(work.href, /^\/sculptures\//)
  }
  for (const work of featuredWorks.filter(work => work.collection === 'no1')) assert.match(work.subtitle, /Inspiré du Pornstar Martini, 24 % vol\./)
  assert.deepEqual(Array.from(featuredWorks.filter(work => work.collection === 'no2'), work => work.sku), ['dyane-no2-25cl', 'dyane-no2-150cl'])
  const teo = featuredWorks.find(work => work.id === 'teo')
  assert.equal(teo.amount,57000)
  assert.equal(teo.sku,undefined, 'An announced price does not invent Stripe configuration or stock')
  assert.match(teo.subtitle,/Cocktail au choix/)
  const { personalizableWorks } = load('lib/personalization/catalog.ts')
  assert.equal(personalizableWorks.length,4)
  assert.ok(!personalizableWorks.some(work => work.sku === teo.enquirySku), 'The Teo artist edition is not available for engraving')
  for(const work of featuredWorks.filter(work => work.collection === 'no2')) {
    assert.equal(personalizableWorks.find(item => item.sku === work.sku).format,work.format)
  }
  assert.deepEqual(Array.from(featuredWorks[0].images, image => image.src.split('/').at(-1)), [
    'dyane-paris-no1-25cl-packshot.webp',
    'dyane-paris-no1-25cl-sculpture-cocktail.webp',
    'dyane-paris-dyane-no1-cocktail-haute-mixologie.webp',
  ])
})
test('editable campaign mapping uses existing local media and no third-party brand assets or placeholders', () => {
  const media = [...storefront.hero.images, ...featuredWorks.flatMap(work => work.images), ...storefront.triptych.images,
    {src:storefront.triptych.video.src},{src:storefront.triptych.video.poster},{src:storefront.film.src},{src:storefront.film.poster}]
  for(const item of media) {
    assert.ok(!/jacquemus|placeholder|louisvuitton|dior/i.test(item.src))
    if(item.src.startsWith('/')) assert.ok(existsSync('public'+item.src),item.src)
  }
  assert.equal(storefront.hero.images.length,2)
  assert.equal(storefront.triptych.images.length,2)
  assert.equal(featuredWorks.flatMap(work => work.variants).length,0,'No verified interchangeable colour variants in current catalogue')
})
