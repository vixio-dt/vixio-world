import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Vixio Worldbuilder
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-md">
          Visual asset-driven creative platform for worldbuilding and production
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-600 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 bg-slate-100 text-slate-900 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  )
}
