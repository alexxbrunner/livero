'use client'

import { Toaster } from 'react-hot-toast'
import { I18nProvider } from '@/contexts/I18nContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      {children}
      <Toaster position="top-right" />
    </I18nProvider>
  )
}

