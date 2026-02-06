import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-300 flex-col justify-center items-center p-12">
        <div className="max-w-md text-center">
          <Image
            src="/vixio-logo.svg"
            alt="Vixio"
            width={240}
            height={80}
            className="mx-auto mb-8"
          />
          <p className="text-xl text-white/90">
            Visual asset-driven creative platform for worldbuilding and production
          </p>
        </div>
      </div>
      
      {/* Right side - auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
