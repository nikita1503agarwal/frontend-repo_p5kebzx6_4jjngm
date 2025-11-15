import { useEffect, useMemo, useState } from 'react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function ProductCard({ product }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all">
      <div className="aspect-square w-full overflow-hidden bg-gray-50">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400">No image</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{product.title}</h3>
          <p className="text-sm font-bold text-gray-900">${Number(product.price).toFixed(2)}</p>
        </div>
        {product.description && (
          <p className="mt-2 text-xs text-gray-500 line-clamp-2">{product.description}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
            {product.category}
          </span>
          <button className="rounded-md bg-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-900">Add to cart</button>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onSeed }) {
  return (
    <div className="text-center py-16">
      <h3 className="mt-2 text-lg font-semibold text-gray-900">No products yet</h3>
      <p className="mt-1 text-sm text-gray-500">Add your first items or load sample products to preview the store.</p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button onClick={onSeed} className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900">Load sample products</button>
        <a href="/test" className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-300">Check backend</a>
      </div>
    </div>
  )
}

export default function App() {
  const CATEGORIES = [
    { key: 'Minimal', label: 'Minimal' },
    { key: 'Anime Inspired', label: 'Anime inspired' },
    { key: 'Christian', label: 'Christian' },
  ]
  const [active, setActive] = useState(CATEGORIES[0].key)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [items, setItems] = useState([])
  const backend = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])

  useEffect(() => {
    fetchProducts(active)
  }, [active])

  async function fetchProducts(category) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${backend}/api/products?category=${encodeURIComponent(category)}`)
      if (!res.ok) throw new Error(`Failed to load: ${res.status}`)
      const data = await res.json()
      setItems(Array.isArray(data.items) ? data.items : [])
    } catch (e) {
      setError(e.message)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  async function seedProducts() {
    const samples = [
      {
        title: 'Essential Oversized Tee — Onyx',
        description: 'Premium heavyweight cotton with a relaxed minimal fit.',
        price: 34.0,
        category: 'Minimal',
        image_url: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop',
        tags: ['minimal', 'tee', 'black']
      },
      {
        title: 'Gradient Hoodie — Cloud',
        description: 'Clean lines, subtle branding, ultra-soft fleece.',
        price: 68.0,
        category: 'Minimal',
        image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop',
        tags: ['minimal', 'hoodie']
      },
      {
        title: 'Neon Ronin Tee',
        description: 'Anime inspired samurai graphic with neon accents.',
        price: 39.0,
        category: 'Anime Inspired',
        image_url: 'https://images.unsplash.com/photo-1620799139504-5c1f4f8b2b87?q=80&w=1200&auto=format&fit=crop',
        tags: ['anime', 'samurai']
      },
      {
        title: 'Mecha Dreams Hoodie',
        description: 'Bold mecha back print, cozy midweight fleece.',
        price: 72.0,
        category: 'Anime Inspired',
        image_url: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200&auto=format&fit=crop',
        tags: ['anime', 'mecha']
      },
      {
        title: 'Faith Over Fear Tee',
        description: 'Classic type layout with an uplifting message.',
        price: 32.0,
        category: 'Christian',
        image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop',
        tags: ['christian', 'message']
      },
      {
        title: 'Cross Embroidered Hoodie',
        description: 'Subtle chest embroidery, premium heavyweight.',
        price: 74.0,
        category: 'Christian',
        image_url: 'https://images.unsplash.com/photo-1503341338985-c0477be52513?q=80&w=1200&auto=format&fit=crop',
        tags: ['christian', 'hoodie']
      }
    ]

    try {
      setLoading(true)
      setError('')
      await Promise.all(
        samples.map((p) =>
          fetch(`${backend}/api/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(p)
          }).then((r) => {
            if (!r.ok) throw new Error('Failed to seed')
          })
        )
      )
      await fetchProducts(active)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Nav */}
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-black" />
            <span className="text-lg font-bold tracking-tight">FLAMES STUDIO</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#minimal" className="hover:text-gray-900">Minimal</a>
            <a href="#anime" className="hover:text-gray-900">Anime</a>
            <a href="#christian" className="hover:text-gray-900">Christian</a>
            <a href="/test" className="hover:text-gray-900">System</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid gap-8 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">Wear your story.</h1>
            <p className="mt-4 text-gray-600">Explore three curated worlds – clean Minimal staples, bold Anime inspired art, and meaningful Christian designs.</p>
            <div className="mt-8 flex gap-3">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setActive(c.key)}
                  className={classNames(
                    'rounded-full px-4 py-2 text-sm font-semibold border transition',
                    active === c.key
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-900 border-gray-300 hover:border-gray-500'
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1600&auto=format&fit=crop"
              alt="Hero"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">{active} Collection</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchProducts(active)} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-50">Refresh</button>
            <button onClick={seedProducts} className="rounded-md bg-black px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-900">Load samples</button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse h-64 rounded-xl bg-gray-200" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState onSeed={seedProducts} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Flames Studio. All rights reserved.
      </footer>
    </div>
  )
}
