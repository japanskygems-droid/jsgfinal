const WC_BASE = 'https://japanskygems.com/wp-json/wc/v3'
const WC_KEY = process.env.WC_KEY
const WC_SECRET = process.env.WC_SECRET

// Stone type → WooCommerce category ID
const STONE_CATS = {
  Afganite:233,Agate:226,Amazonite:234,Amethyst:81,Ametrine:38,Apatite:37,
  Aquamarine:139,Aventurine:235,'Beer Quartz':223,Beryl:207,'Blue Opal':236,
  Carnelian:42,Chalcedony:237,'Champagne Quartz':238,Charoite:239,Chrysocolla:240,
  Chrysoprase:241,Citrine:90,'Crystal Quartz':242,Emerald:243,'Ethiopian Opal':244,
  Fluorite:194,Garnet:41,'Green Amethyst':36,Iolite:35,Jasper:245,Kyanite:84,
  Labradorite:195,Larimar:159,Lavender:246,'Lemon Quartz':247,'Lapis Lazuli':256,
  Malachite:248,Moonstone:99,Morganite:208,Obsidian:218,Onyx:249,Opal:232,
  Peridot:202,'Pink Amethyst':250,'Pink Opal':251,Prehnite:252,
  'Rainbow Moonstone':181,Rhodochrosite:253,Rhodonite:206,'Rose Quartz':178,
  Ruby:144,'Rutile Quartz':198,Sapphire:46,'Smoky Quartz':254,Spinel:44,
  'Strawberry Quartz':255,Sunstone:225,Tanzanite:92,Topaz:192,Tourmaline:163,
  Turquoise:47
}

// Alias keywords → stone name (longest match wins)
const ALIASES = [
  ['ethiopian opal','Ethiopian Opal'],['rainbow moonstone','Rainbow Moonstone'],
  ['green amethyst','Green Amethyst'],['green amy','Green Amethyst'],
  ['pink amethyst','Pink Amethyst'],['pink opal','Pink Opal'],
  ['blue opal','Blue Opal'],['rose quartz','Rose Quartz'],
  ['rose quarts','Rose Quartz'],['rose hexagon','Rose Quartz'],
  ['crystal quartz','Crystal Quartz'],['smoky quartz','Smoky Quartz'],
  ['smokey quartz','Smoky Quartz'],['rutile quartz','Rutile Quartz'],
  ['lemon quartz','Lemon Quartz'],['beer quartz','Beer Quartz'],
  ['champagne quartz','Champagne Quartz'],['strawberry quartz','Strawberry Quartz'],
  ['lapis lazuli','Lapis Lazuli'],['champagne','Champagne Quartz'],
  ['champange','Champagne Quartz'],['chempegene','Champagne Quartz'],
  ['cognac','Beer Quartz'],['milky aqua','Aquamarine'],['bio lemon','Lemon Quartz'],
  ['green strawberry','Strawberry Quartz'],['red strawberry','Strawberry Quartz'],
  ['copper rutilite','Rutile Quartz'],['green rutilite','Rutile Quartz'],
  ['black rutilite','Rutile Quartz'],['mix rutilated','Rutile Quartz'],
  ['rabbit hair','Rutile Quartz'],['rutilite','Rutile Quartz'],['rutile','Rutile Quartz'],
  ['american tourquoise','Turquoise'],['tourquoise','Turquoise'],
  ['wonder sapphier','Sapphire'],['montana ','Sapphire'],
  ['neon appetite','Apatite'],['appetite','Apatite'],
  ['blood dragon','Jasper'],['dragon blood','Jasper'],
  ['aura quartz','Crystal Quartz'],['dot quartz','Crystal Quartz'],
  ['solar quartz','Crystal Quartz'],['hydro quartz','Crystal Quartz'],
  ['hydro swiss','Crystal Quartz'],['hydro london','Crystal Quartz'],
  ['white rainbow','Crystal Quartz'],['multy quartz','Crystal Quartz'],
  ['crystal ','Crystal Quartz'],
  ['smokey hexagon','Smoky Quartz'],['smokey fancy','Smoky Quartz'],
  ['smokey leaf','Smoky Quartz'],['smokey flower','Smoky Quartz'],
  ['smoky ','Smoky Quartz'],['smokey ','Smoky Quartz'],
  ['black spinal','Spinel'],['spinal','Spinel'],
  ['rhodocrosite','Rhodochrosite'],['rodocrosite','Rhodochrosite'],
  ['chrisoprase','Chrysoprase'],['chrysocalla','Chrysocolla'],
  ['chrysocola','Chrysocolla'],['chalsedony','Chalcedony'],
  ['chalsydeny','Chalcedony'],['chacedony','Chalcedony'],
  ['choco moon','Moonstone'],['grey moon','Moonstone'],['w moon','Moonstone'],
  ['peach monstone','Moonstone'],['peach moonstone','Moonstone'],
  ['levender','Lavender'],['flourite','Fluorite'],['prinite','Prehnite'],
  ['melakite','Malachite'],['blue lace','Agate'],['tiger ','Agate'],
  ['afganite','Afganite'],['afghanite','Afganite'],['citrin','Citrine'],
  ['lapis ','Lapis Lazuli'],['lapis','Lapis Lazuli'],
  ['ameterine','Ametrine'],['ameterin','Ametrine'],
  ['agate','Agate'],['amazonite','Amazonite'],['amethyst','Amethyst'],
  ['ametrine','Ametrine'],['apatite','Apatite'],['aquamarine','Aquamarine'],
  ['aventurine','Aventurine'],['beryl','Beryl'],['carnelian','Carnelian'],
  ['chalcedony','Chalcedony'],['charoite','Charoite'],['chrysocolla','Chrysocolla'],
  ['chrysoprase','Chrysoprase'],['citrine','Citrine'],['emerald','Emerald'],
  ['fluorite','Fluorite'],['garnet','Garnet'],['iolite','Iolite'],
  ['jasper','Jasper'],['kyanite','Kyanite'],['labradorite','Labradorite'],
  ['larimar','Larimar'],['lavender','Lavender'],['malachite','Malachite'],
  ['moonstone','Moonstone'],['monstone','Moonstone'],['morganite','Morganite'],
  ['obsidian','Obsidian'],['onyx','Onyx'],['opal','Opal'],['peridot','Peridot'],
  ['prehnite','Prehnite'],['rhodochrosite','Rhodochrosite'],['rhodonite','Rhodonite'],
  ['ruby','Ruby'],['sapphire','Sapphire'],['spinel','Spinel'],['sunstone','Sunstone'],
  ['tanzanite','Tanzanite'],['topaz','Topaz'],['tourmaline','Tourmaline'],
  ['turquoise','Turquoise'],['rosequartz','Rose Quartz'],
  ['strawberry','Strawberry Quartz'],['prasiolite','Green Amethyst'],
]
ALIASES.sort((a, b) => b[0].length - a[0].length)

/**
 * Find stone type from product name.
 * Returns { stone, confidence } where confidence is 0-100.
 */
function findStone(name) {
  const lower = name.toLowerCase()
  for (const [alias, stone] of ALIASES) {
    if (lower.includes(alias) && STONE_CATS[stone]) {
      // Longer alias = more specific = higher confidence
      const conf = Math.min(100, 50 + alias.length * 3)
      return { stone, confidence: conf }
    }
  }
  return { stone: null, confidence: 0 }
}

const BEADS_TERMS = ['rondel','rondell','roundelle','roundel','heishi','tumble','sazare','nugget','bead','a-line','a line','strand']
const BRACELET_TERMS = ['bracelet']
const CAT_BEADS = 32, CAT_BRACELET = 33, CAT_GEMSTONE = 34

/**
 * Classify an item into its main WooCommerce category.
 * Returns { catId, label, confidence, signals[] }
 */
function classifyItem(item) {
  const lower = item.name.toLowerCase()
  const prefix = (item.lotNo || '').replace(/[0-9]+$/, '').toUpperCase()
  const signals = []
  let confidence = 0

  if (BRACELET_TERMS.some(t => lower.includes(t))) {
    signals.push('name contains bracelet keyword')
    confidence = 95
    return { catId: CAT_BRACELET, label: 'Bracelet', confidence, signals }
  }
  if (prefix === 'S') {
    signals.push('lot prefix S → Bracelet')
    confidence = 90
    return { catId: CAT_BRACELET, label: 'Bracelet', confidence, signals }
  }
  if (prefix === 'C' || prefix === 'H' || prefix === 'V') {
    signals.push(`lot prefix ${prefix} → Beads`)
    confidence = 90
    // Extra boost if bead keyword also matches
    if (BEADS_TERMS.some(t => lower.includes(t))) { signals.push('name also contains bead keyword'); confidence = 98 }
    return { catId: CAT_BEADS, label: 'Beads', confidence, signals }
  }
  if (BEADS_TERMS.some(t => lower.includes(t))) {
    signals.push('name contains bead keyword')
    confidence = 80
    return { catId: CAT_BEADS, label: 'Beads', confidence, signals }
  }
  if (prefix === 'N') {
    signals.push('lot prefix N → Gemstone')
    confidence = 85
    return { catId: CAT_GEMSTONE, label: 'Gemstone', confidence, signals }
  }

  // Fallback: low confidence
  signals.push('no matching prefix or keyword — defaulting to Gemstone')
  confidence = 40
  return { catId: CAT_GEMSTONE, label: 'Gemstone', confidence, signals }
}

function wcHeaders() {
  const creds = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')
  return { 'Authorization': `Basic ${creds}`, 'Content-Type': 'application/json' }
}

async function wcGet(path) {
  const r = await fetch(`${WC_BASE}${path}`, { headers: wcHeaders() })
  if (!r.ok) throw new Error(`WC GET ${path} → ${r.status}`)
  return r.json()
}

async function wcPost(path, body) {
  const r = await fetch(`${WC_BASE}${path}`, {
    method: 'POST', headers: wcHeaders(), body: JSON.stringify(body)
  })
  if (!r.ok) throw new Error(`WC POST ${path} → ${r.status}`)
  return r.json()
}

/** Fetch all existing WC products keyed by SKU (paginated). */
async function fetchSkuMap() {
  const map = {}
  let page = 1
  while (true) {
    const products = await wcGet(`/products?per_page=100&page=${page}&status=any`)
    if (!Array.isArray(products) || products.length === 0) break
    for (const p of products) { if (p.sku) map[p.sku] = p }
    if (products.length < 100) break
    page++
  }
  return map
}

export default async function handler(req, res) {
  if (req.cookies?.jsg_auth !== 'jsg_ok_1511') return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  const { items } = req.body
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items' })
  if (!WC_KEY || !WC_SECRET) return res.status(500).json({ error: 'WC credentials not set' })

  try {
    const skuMap = await fetchSkuMap()
    const toCreate = [], toUpdate = []
    const lowConfidence = []  // items flagged for manual review

    for (const item of items) {
      const sku = item.lotNo
      if (!sku || !item.name) continue

      // Classifier
      const classification = classifyItem(item)
      const stoneResult = findStone(item.name)

      const cats = [{ id: classification.catId }]
      if (stoneResult.stone) cats.push({ id: STONE_CATS[stoneResult.stone] })

      // Overall confidence = average of category + stone confidence (if stone found)
      const overallConf = stoneResult.stone
        ? Math.round((classification.confidence + stoneResult.confidence) / 2)
        : classification.confidence

      if (overallConf < 60) {
        lowConfidence.push({
          sku,
          name: item.name,
          confidence: overallConf,
          classification: classification.label,
          stone: stoneResult.stone,
          signals: classification.signals
        })
      }

      // Determine publish status:
      // - Draft if item has no image URL (images must be added in WP admin)
      // - Draft if classifier confidence is very low (<40) — flag for manual review
      // - Publish otherwise (qty 0 handled via stock_quantity, WC hides it)
      const hasImage = item.imageUrl && item.imageUrl.trim().length > 0
      const isLowConfidence = overallConf < 40
      const qty = parseInt(item.qty) || 0

      let status = 'publish'
      if (!hasImage) status = 'draft'
      else if (isLowConfidence) status = 'draft'

      const productData = {
        name: item.name,
        sku,
        regular_price: String(item.price || 0),
        manage_stock: true,
        stock_quantity: qty,
        stock_status: qty > 0 ? 'instock' : 'outofstock',
        // Hide 0-stock items from catalog (WC respects this with hide-out-of-stock setting)
        catalog_visibility: qty === 0 ? 'hidden' : 'visible',
        status,
        categories: cats,
        // Store classifier metadata in meta_data for admin reference
        meta_data: [
          { key: '_jsg_synced', value: '1' },
          { key: '_jsg_classifier_confidence', value: String(overallConf) },
          { key: '_jsg_classifier_label', value: classification.label },
          { key: '_jsg_classifier_signals', value: classification.signals.join('; ') },
          { key: '_jsg_synced_at', value: new Date().toISOString() },
        ]
      }

      // Attach image if URL provided
      if (hasImage) {
        productData.images = [{ src: item.imageUrl, alt: item.name }]
      }

      if (skuMap[sku]) {
        // Existing product: update price/stock/status but preserve manually set categories
        // if the product has been manually reviewed (_jsg_manual_cats meta)
        const existing = skuMap[sku]
        const manualMeta = (existing.meta_data || []).find(m => m.key === '_jsg_manual_cats')
        if (manualMeta && manualMeta.value === '1') {
          // Preserve manually set categories
          delete productData.categories
        }
        toUpdate.push({ id: existing.id, ...productData })
      } else {
        toCreate.push(productData)
      }
    }

    const results = { created: 0, updated: 0, errors: [], lowConfidence, drafted: 0 }

    // Batch create (100 at a time)
    for (let i = 0; i < toCreate.length; i += 100) {
      const r = await wcPost('/products/batch', { create: toCreate.slice(i, i + 100) })
      if (r.create) {
        r.create.forEach(p => {
          if (p.error) results.errors.push(p.error.message)
          else {
            results.created++
            if (p.status === 'draft') results.drafted++
          }
        })
      }
    }

    // Batch update (100 at a time)
    for (let i = 0; i < toUpdate.length; i += 100) {
      const r = await wcPost('/products/batch', { update: toUpdate.slice(i, i + 100) })
      if (r.update) {
        r.update.forEach(p => {
          if (p.error) results.errors.push(p.error.message)
          else {
            results.updated++
            if (p.status === 'draft') results.drafted++
          }
        })
      }
    }

    return res.status(200).json(results)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
