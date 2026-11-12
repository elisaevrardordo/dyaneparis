const assert = require('node:assert/strict')
const test = require('node:test')
const { load } = require('./helpers/load-stripe.cjs')

const { isDeliveryCountry, isDeliveryPostcode, shippingAmount, shippingDescription, shippingDeliveryDescription } =
  load('lib/shipping.ts')

test('shipping charges for France and Monaco use the same strict threshold', () => {
  for (const [country, standard] of [['FR', 1500], ['MC', 2000]]) {
    assert.equal(shippingAmount(19_999, country), standard)
    assert.equal(shippingAmount(20_000, country), standard)
    assert.equal(shippingAmount(20_001, country), 0)
  }
  assert.equal(shippingAmount(20_000), shippingAmount(20_000, 'FR'))
})

test('the delivery area includes metropolitan France and Corsica', () => {
  for (const postcode of ['01000', '75001', '20200', ' 20000 ', '95000']) {
    assert.equal(isDeliveryPostcode('FR', postcode), true, postcode)
  }
  for (const postcode of ['00100', '96000', '97110', '97500', '97600', '98400', '98714', '98800', '98000', '98001']) {
    assert.equal(isDeliveryPostcode('FR', postcode), false, postcode)
  }
})

test('only the standard Monaco postal code is eligible under the Monaco destination', () => {
  assert.equal(isDeliveryPostcode('MC', '98000'), true)
  assert.equal(isDeliveryPostcode('MC', '98001'), false)
  assert.equal(isDeliveryPostcode('MC', '75001'), false)
  assert.equal(isDeliveryPostcode('MC', 'MC-98000'), false)
})

test('unsupported countries and malformed postcodes are rejected', () => {
  for (const country of ['BE', 'CH', 'GP', '', undefined, null]) {
    assert.equal(isDeliveryCountry(country), false)
    assert.equal(isDeliveryPostcode(country, '75001'), false)
  }
  assert.equal(isDeliveryCountry('FR'), true)
  assert.equal(isDeliveryCountry('MC'), true)
  for (const postcode of ['75 001', '7500', '750010', '7500A', '７５００１', '', 75001, undefined]) {
    assert.equal(isDeliveryPostcode('FR', postcode), false)
  }
})

test('delivery copy reflects the destination and distinguishes stock from preorders', () => {
  assert.equal(shippingDescription('fr'), shippingDescription('fr', 'FR'))
  assert.match(shippingDescription('fr', 'FR'), /France métropolitaine à 15\s€.*plus de 200\s€/)
  assert.match(shippingDescription('fr', 'MC'), /Monaco à 20\s€.*plus de 200\s€/)
  assert.match(shippingDescription('en', 'MC'), /Monaco is €20.*over €200/)
  assert.equal(shippingDeliveryDescription('fr', false), 'Livraison sous 5 jours ouvrés.')
  assert.equal(shippingDeliveryDescription('fr', true), 'Livraison prévue début janvier 2027.')
  assert.equal(shippingDeliveryDescription('en', false), 'Delivery within 5 business days.')
  assert.equal(shippingDeliveryDescription('en', true), 'Delivery expected in early January 2027.')
})
