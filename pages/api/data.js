const GIST_ID = process.env.GIST_ID
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

export default async function handler(req, res) {
  const auth = req.cookies?.jsg_auth
  if (auth !== 'jsg_ok_1511') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    const r = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, 'User-Agent': 'jsg-app' }
    })
    const gist = await r.json()
    const content = gist.files['jsg_data.json'].content
    return res.status(200).json(JSON.parse(content))
  }

  if (req.method === 'POST') {
    const data = req.body
    await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'jsg-app'
      },
      body: JSON.stringify({
        files: { 'jsg_data.json': { content: JSON.stringify(data) } }
      })
    })
    return res.status(200).json({ ok: true })
  }

  res.status(405).end()
}
