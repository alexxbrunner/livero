import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LanguageBanner from '@/components/LanguageBanner'

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <LanguageBanner />
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

