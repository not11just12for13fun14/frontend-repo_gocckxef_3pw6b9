import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function StarRating({ rating = 4.5 }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < full) return 'full'
    if (i === full && half) return 'half'
    return 'empty'
  })
  return (
    <div className="flex items-center gap-0.5">
      {stars.map((s, idx) => (
        <svg key={idx} className={`w-4 h-4 ${s !== 'empty' ? 'text-yellow-500' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.801 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-xs text-gray-500">{rating.toFixed(1)}</span>
    </div>
  )
}

function Navbar({ cartOpen, setCartOpen, cart }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 grid place-items-center text-white font-black">SB</div>
          <span className="font-semibold tracking-tight text-gray-800">Sneaker Boutique</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/test" className="text-sm text-gray-500 hover:text-gray-700 hidden sm:inline">Status</a>
          <button onClick={() => setCartOpen(!cartOpen)} className="relative inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-black">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span>Cart</span>
            {cart?.items?.length ? (
              <span className="absolute -top-2 -right-2 bg-fuchsia-600 text-white text-xs rounded-full px-2 py-0.5">{cart.items.length}</span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  )
}

function ProductCard({ p, onAdd }) {
  const [size, setSize] = useState(p.sizes?.[0] || 9)
  const [loading, setLoading] = useState(false)

  const add = async () => {
    setLoading(true)
    try {
      await onAdd(p, size)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        <div className="absolute bottom-3 left-3 text-white text-xs px-2 py-1 rounded bg-black/40 backdrop-blur">
          {p.brand}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-gray-800 leading-snug">{p.name}</h3>
            <StarRating rating={p.rating || 4.5} />
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">${p.price.toFixed(2)}</div>
            <div className="text-xs text-gray-500">{p.colorway}</div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{p.description}</p>
        <div className="mt-3 flex items-center gap-2">
          <select value={size} onChange={e => setSize(Number(e.target.value))} className="border border-gray-200 text-sm rounded-lg px-2 py-1">
            {p.sizes?.map(s => <option key={s} value={s}>US {s}</option>)}
          </select>
          <button onClick={add} disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-2 rounded-lg disabled:opacity-60">
            {loading ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

function CartDrawer({ open, setOpen, data }) {
  const items = data?.items || []
  return (
    <div className={`fixed inset-0 z-40 ${open ? '' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/30 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)} />
      <aside className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-16 px-6 border-b flex items-center justify-between">
          <h3 className="font-semibold">Your Cart</h3>
          <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">Close</button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto h-[calc(100%-8rem)]">
          {items.length === 0 ? (
            <p className="text-gray-500">Your cart is empty. Add some heat!</p>
          ) : (
            items.map((it, idx) => (
              <div key={idx} className="flex gap-4">
                <img src={it.image} alt={it.name} className="w-20 h-20 rounded-lg object-cover border" />
                <div className="flex-1">
                  <div className="font-medium text-gray-800 leading-tight">{it.name}</div>
                  <div className="text-xs text-gray-500">{it.brand} • US {it.size}</div>
                  <div className="text-sm mt-1">Qty {it.quantity}</div>
                </div>
                <div className="font-semibold">${(it.price * it.quantity).toFixed(2)}</div>
              </div>
            ))
          )}
        </div>
        <div className="h-16 px-6 border-t flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Subtotal</div>
            <div className="font-semibold">${(data?.subtotal || 0).toFixed(2)}</div>
          </div>
          <a href="#" className="bg-gray-900 text-white px-4 py-2 rounded-lg">Checkout</a>
        </div>
      </aside>
    </div>
  )
}

export default function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const boot = async () => {
      try {
        // Seed once, ignore failures
        await fetch(`${API_BASE}/seed`, { method: 'POST' })
      } catch (_) {}
      try {
        const res = await fetch(`${API_BASE}/products`)
        if (!res.ok) throw new Error('Failed to load products')
        const data = await res.json()
        setProducts(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    boot()
  }, [])

  const addToCart = async (p, size) => {
    const res = await fetch(`${API_BASE}/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: p.id || p._id || p.id, quantity: 1, size })
    })
    if (!res.ok) {
      alert('Failed to add to cart')
      return
    }
    const data = await res.json()
    setCart(data.cart)
    setCartOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <Navbar cartOpen={cartOpen} setCartOpen={setCartOpen} cart={cart} />

      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-fuchsia-700 bg-fuchsia-100 px-3 py-1 rounded-full">NEW DROP</div>
              <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">Find Your Next Pair of Heat</h1>
              <p className="mt-4 text-gray-600">Discover iconic silhouettes and modern classics from Nike, adidas, New Balance and more. Curated drops, clean UI, instant vibes.</p>
              <div className="mt-6 flex gap-3">
                <a href="#shop" className="bg-gray-900 text-white px-5 py-3 rounded-xl shadow-sm hover:bg-black">Shop Sneakers</a>
                <a href="/test" className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50">Check Status</a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-10 bg-gradient-to-tr from-fuchsia-300/40 to-indigo-300/40 blur-3xl -z-10" />
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80" alt="Hero Sneaker" className="rounded-3xl shadow-2xl border border-white/60" />
            </div>
          </div>
        </div>
      </section>

      <section id="shop" className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Sneakers</h2>
              <p className="text-gray-500 text-sm">Hand-picked styles and colorways</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <span>API:</span>
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">{API_BASE}</span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 bg-white rounded-2xl border animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id || p._id} p={p} onAdd={addToCart} />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="py-12 border-t bg-white/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Sneaker Boutique • All drops are imaginary</p>
          <div className="text-sm text-gray-500">Built live with vibes</div>
        </div>
      </footer>

      <CartDrawer open={cartOpen} setOpen={setCartOpen} data={cart} />
    </div>
  )
}
