import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Login() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const data = await res.json()
    if (data.ok) {
      router.replace('/api/app')
    } else {
      setError('Incorrect password.')
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Japan Sky Gems · Login</title>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Nunito:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div style={{
        minHeight: '100vh',
        background: '#faf6f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Nunito', system-ui, sans-serif",
      }}>
        <div style={{
          background: '#fff',
          border: '1px solid rgba(155,125,65,0.18)',
          borderRadius: 12,
          padding: '2.4rem 2.8rem',
          width: '100%',
          maxWidth: 360,
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '1.25rem',
            fontWeight: 300,
            letterSpacing: '0.18em',
            color: '#9a7220',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: '0.3rem',
          }}>
            &#128142; Japan Sky Gems
          </div>
          <div style={{
            fontSize: '0.72rem',
            color: '#b0a595',
            textAlign: 'center',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '1.8rem',
          }}>
            Business Hub
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.6rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#b0a595',
                fontWeight: 700,
                marginBottom: '0.35rem',
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                autoFocus
                style={{
                  width: '100%',
                  background: '#faf6f0',
                  border: '1px solid rgba(155,125,65,0.18)',
                  borderRadius: 6,
                  color: '#1e1a10',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '0.9rem',
                  padding: '0.6rem 0.8rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.18s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(155,125,65,0.42)'}
                onBlur={e => e.target.style.borderColor = 'rgba(155,125,65,0.18)'}
              />
            </div>
            {error && (
              <div style={{
                fontSize: '0.75rem',
                color: '#c54a4a',
                marginBottom: '0.8rem',
                textAlign: 'center',
              }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading || !password}
              style={{
                width: '100%',
                background: '#9a7220',
                border: 'none',
                borderRadius: 6,
                color: '#fff',
                fontFamily: "'Nunito', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                padding: '0.68rem 1.2rem',
                cursor: loading || !password ? 'not-allowed' : 'pointer',
                opacity: loading || !password ? 0.6 : 1,
                transition: 'opacity 0.18s',
              }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
