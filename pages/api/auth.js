const PASSWORD = '1511'
const COOKIE_NAME = 'jsg_auth'
const COOKIE_VALUE = 'jsg_ok_1511'

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { password } = req.body
    if (password === PASSWORD) {
      res.setHeader(
        'Set-Cookie',
        `${COOKIE_NAME}=${COOKIE_VALUE}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 30}`
      )
      return res.status(200).json({ ok: true })
    }
    return res.status(401).json({ ok: false })
  }

  if (req.method === 'DELETE') {
    res.setHeader(
      'Set-Cookie',
      `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
    )
    return res.status(200).json({ ok: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
