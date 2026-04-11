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
  ['lapis lazuli','Lapis Lazuli'],['beer quartz','Beer Quartz'],
  ['champagne','Champagne Quartz'],['champange','Champagne Quartz'],
  ['chempegene','Champagne Quartz'],['cognac','Beer Quartz'],
  ['milky aqua','Aquamarine'],['bio lemon','Lemon Quartz'],
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
  ['chrysocola','Chrysocolla'],
  ['chalsedony','Chalcedony'],['chalsydeny','Chalcedony'],['chacedony','Chalcedony'],
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
// Sort by alias length descending (longest match wins)
ALIASES.sort((a, b) => b[0].length - a[0].length)

function findStone(name) {
  const lower = name.toLowerCase()
  for (const [alias, stone] of ALIASES) {
    if (lower.includes(alias) && STONE_CATS[stone]) return stone
  }
  return null
}

const BEADS_TERMS = ['rondel','rondell','roundelle','roundel','heishi','tumble','sazare','nugget','bead','a-line','a line','strand']
const BRACELET_TERMS = ['bracelet']
const CAT_BEADS = 32, CAT_BRACELET = 33, CAT_GEMSTONE = 34

function mainCatFor(item) {
  const lower = item.name.toLowerCase()
  const prefix = (item.lotNo || '').replace(/[0-9]+$/, '')
  if (BRACELET_TERMS.some(t => lower.includes(t))) return CAT_BRACELET
  if (prefix === 'C' || BEADS_TERMS.some(t => lower.includes(t))) return CAT_BEADS
  return CAT_GEMSTONE
}

function wcHeaders() {
  const creds = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')
  return { 'Authorization': `Basic ${creds}`, 'Content-Type': 'application/json' }
}

async function wcGet(path) {
  const r = await fetch(`${WC_BASE}${path}`, { headers: wcHeaders() })
  return r.json()
}

async function wcPost(path, body) {
  const r = await fetch(`${WC_BASE}${path}`, {
    method: 'POST',
    headers: wcHeaders(),
    body: JSON.stringify(body)
  })
  return r.json()
}

// Fetch all existing products by SKU (paginated)
async function fetchSkuMap() {
  const map = {}
  let page = 1
  while (true) {
    const products = await wcGet(`/products?per_page=100&page=${page}&status=publish`)
    if (!Array.isArray(products) || products.length === 0) break
    for (const p of products) {
      if (p.sku) map[p.sku] = p
    }
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

    for (const item of items) {
      const sku = item.lotNo
      if (!sku || !item.name) continue

      const stone = findStone(item.name)
      const cats = [{ id: mainCatFor(item) }]
      if (stone) cats.push({ id: STONE_CATS[stone] })

      const productData = {
        name: item.name,
        sku,
        regular_price: String(item.price || 0),
        manage_stock: true,
        stock_quantity: item.qty || 0,
        status: 'publish',
        categories: cats
      }

      if (skuMap[sku]) {
        toUpdate.push({ id: skuMap[sku].id, ...productData })
      } else {
        toCreate.push(productData)
      }
    }

    const results = { created: 0, updated: 0, errors: [] }

    // Batch create (100 at a time)
    for (let i = 0; i < toCreate.length; i += 100) {
      const r = await wcPost('/products/batch', { create: toCreate.slice(i, i + 100) })
      results.created += (r.create || []).length
      if (r.create) r.create.forEach(p => { if (p.error) results.errors.push(p.error.message) })
    }

    // Batch update (100 at a time)
    for (let i = 0; i < toUpdate.length; i += 100) {
      const r = await wcPost('/products/batch', { update: toUpdate.slice(i, i + 100) })
      results.updated += (r.update || []).length
      if (r.update) r.update.forEach(p => { if (p.error) results.errors.push(p.error.message) })
    }

    return res.status(200).json(results)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
