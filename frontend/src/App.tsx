import { useEffect, useState } from 'react'
import AdminDashboard from './pages/AdminDashboard'
import FishingZones from './pages/FishingZones.tsx'
import Login from './pages/Login.tsx'
import ZoneSafetyRankings from './pages/ZoneSafetyRankings.tsx'
import type { Language } from './i18n'

function App() {
  const path = window.location.pathname.toLowerCase()
  const isAuthenticated = localStorage.getItem('hwita-authenticated') === 'true'
  const isPublicPath = path === '/login' || path === '/fishing-zones'
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('hwita-language')
    if (savedLanguage === 'ar' || savedLanguage === 'en') {
      return savedLanguage
    }
    return 'fr'
  })

  useEffect(() => {
    localStorage.setItem('hwita-language', language)
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  if (!isAuthenticated && !isPublicPath) {
    return <Login language={language} onLanguageChange={setLanguage} />
  }

  if (path === '/' || path === '/dashboard') {
    return <AdminDashboard language={language} onLanguageChange={setLanguage} />
  }

  if (path === '/fishing-zones') {
    return <FishingZones language={language} onLanguageChange={setLanguage} />
  }

  if (path === '/restoration' || path === '/zone-safety-rankings') {
    return <ZoneSafetyRankings language={language} onLanguageChange={setLanguage} />
  }

  if (path === '/login') {
    if (isAuthenticated) {
      return <AdminDashboard language={language} onLanguageChange={setLanguage} />
    }
    return <Login language={language} onLanguageChange={setLanguage} />
  }

  return (
    <main className="min-h-screen bg-[#fff8f3] text-[#1f1b16] flex items-center justify-center p-8">
      <div className="max-w-xl w-full bg-[#fbf2ea] rounded-2xl p-8 shadow-[0_20px_40px_rgba(31,27,22,0.06)]">
        <h1 className="text-3xl font-bold text-[#006071] mb-3">Page Not Found</h1>
        <p className="text-[#3e484b] mb-6">Use one of these paths to view your converted pages:</p>
        <ul className="space-y-2 text-[#006071] font-semibold">
          <li><a href="/dashboard" className="hover:underline">/dashboard</a></li>
          <li><a href="/restoration" className="hover:underline">/restoration</a></li>
          <li><a href="/login" className="hover:underline">/login</a></li>
        </ul>
      </div>
    </main>
  )
}

export default App
