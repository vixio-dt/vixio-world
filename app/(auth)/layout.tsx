import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sky-500 flex-col justify-center items-center p-12">
        <div className="max-w-md text-center text-white">
          <Image
            src="/vixio-logo.svg"
            alt="Vixio"
            width={80}
            height={80}
            className="mx-auto mb-8 invert"
          />
          <h1 className="text-4xl font-bold mb-4">Vixio Worldbuilder</h1>
          <p className="text-xl text-sky-100">
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
