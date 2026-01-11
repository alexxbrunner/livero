import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

