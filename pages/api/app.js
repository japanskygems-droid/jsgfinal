import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const auth = req.cookies?.jsg_auth
  if (auth !== 'jsg_ok_1511') {
    res.writeHead(302, { Location: '/login' })
    return res.end()
  }

  try {
    const htmlPath = path.join(process.cwd(), 'data', 'app.html')
    const html = fs.readFileSync(htmlPath, 'utf8')
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).send(html)
  } catch (e) {
    return res.status(500).send('App file not found.')
  }
}
