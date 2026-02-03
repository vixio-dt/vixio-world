import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center">
        <Image
          src="/vixio-logo.svg"
          alt="Vixio"
          width={280}
          height={80}
          className="mx-auto mb-6"
          priority
        />
        <p className="text-lg text-slate-600 mb-8 max-w-md">
          Visual asset-driven creative platform for worldbuilding and production
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-teal-400 text-white rounded-xl font-medium hover:from-cyan-500 hover:to-teal-500 transition-all duration-200 shadow-lg shadow-cyan-500/25"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-8 py-3 bg-white text-slate-900 rounded-xl font-medium hover:bg-cyan-50 transition-all duration-200 border border-cyan-200"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  )
}
