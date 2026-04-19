import { useState } from 'react'
import FishAnalyzeModal from '../components/FishAnalyzeModal'
import WeatherSafetyDecision from '../components/WeatherSafetyDecision'
import ZoneRiskMapModal from '../components/ZoneRiskMapModal'
import type { Language } from '../i18n'
import { translate } from '../i18n'
import heroImage from '../assets/hero.jpg'

type FishingZonesProps = {
  language: Language
  onLanguageChange: (language: Language) => void
}

export default function FishingZones({ language, onLanguageChange }: FishingZonesProps) {
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const [fishAnalyzeOpen, setFishAnalyzeOpen] = useState(false)
  const t = (key: string) => translate(language, key)
  const riskMapApiUrl = import.meta.env.VITE_RISK_MAP_API_URL || '/api/zones-risk-map/'
  const fishAnalyzeApiUrl = import.meta.env.VITE_FISH_ANALYZE_API_URL || '/api/fish-analyze/'

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />

      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .fishing-zones-page {
          font-family: 'Manrope', sans-serif;
          background-color: #fff8f3;
        }
        .fishing-zones-page h1,
        .fishing-zones-page h2,
        .fishing-zones-page h3 {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .fishing-zones-page [dir="rtl"] .navbar-text {
          font-size: 1.125rem;
          letter-spacing: 0.5px;
        }
      `}</style>

      <div className="fishing-zones-page bg-background text-on-background min-h-screen flex flex-col">
        <header className="bg-[#fff8f3] dark:bg-[#0f171a] shadow-[0_4px_30px_rgba(0,96,113,0.04)] sticky top-0 z-50">
          <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
            <div className="flex items-center">
              <img
                alt="Hwita Logo"
                className="h-16 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/ADBb0uguFhSk9yS8tOtJRHLePmLBBOD8iuAZZY0j5jLDuI9TKscs7OAwcHe6bouVCSRF6QUzYd-pLscWPVkUx93PxONYEO-Vul6BVbfueEiNl78X043BvqHnNZnepf0uzwXt3w-lYnRb4pLhtoXE9kO6cVYshBYmbLgu8R9MiNQqjVykNSgvYiu3ODLWdb5IrzigEOuQc1aOR9Z-xIQ_37hQbT3QMmVrYsGBSoX_detifDrBD98vE6LSdSiFC970JyKQWhYGC9_IZwfpXA"
              />
            </div>
            <nav className="hidden md:flex gap-8 items-center">
              <a
                className="text-[#006071] dark:text-[#007B8F] font-bold border-b-2 border-[#007B8F] pb-1 font-['Plus_Jakarta_Sans'] text-lg tracking-tight navbar-text"
                href="/fishing-zones"
              >
                {t('nav.fishingZones')}
              </a>
            </nav>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 border border-[#d8c8b8] hover:bg-white/100 transition-all hover:shadow-md"
                  title={t('language.label')}
                >
                  <span className="material-symbols-outlined text-[#006071]">public</span>
                </button>
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 mt-2 bg-white border border-[#d8c8b8] rounded-lg shadow-lg z-10 min-w-[140px]">
                    {[
                      { code: 'en' as Language, label: t('language.english') },
                      { code: 'fr' as Language, label: t('language.french') },
                      { code: 'ar' as Language, label: t('language.arabic') }
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          onLanguageChange(lang.code)
                          setIsLanguageMenuOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-base transition-colors navbar-text ${
                          language === lang.code
                            ? 'bg-[#007B8F]/10 text-[#006071] font-semibold'
                            : 'text-[#6b7d8a] hover:bg-[#f5e8db]'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <a
                className="material-symbols-outlined text-primary p-2 hover:bg-[#fbf2ea] rounded-full transition-all"
                href="/login"
                aria-label={t('nav.signIn')}
                title={t('nav.signIn')}
              >
                person_add
              </a>
            </div>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center justify-start relative overflow-hidden px-6 py-12 md:py-16">
          <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-10 bg-gradient-to-l from-primary-container to-transparent"></div>
          <div className="absolute bottom-0 left-0 -z-10 w-full h-1/2 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>

          <div className="max-w-screen-2xl w-full text-center space-y-12 relative">
            <div className="relative overflow-hidden rounded-3xl min-h-[320px] md:min-h-[420px] flex items-center justify-center px-6 py-10">
              <img
                alt="Illustration"
                className="absolute inset-0 w-full h-full object-cover"
                src={heroImage}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/16 via-white/20 to-white/24"></div>
              <div className="relative z-10 space-y-6">
                <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container/35 text-secondary font-bold text-xs uppercase tracking-[0.2em] mb-4">
                  {t('fishing.badge')}
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold text-primary tracking-tighter leading-none">
                  {t('fishing.heroTitle')}
                </h1>
                <p className="text-lg md:text-xl text-[#001F26] max-w-2xl mx-auto leading-relaxed font-medium opacity-95">
                  {t('fishing.heroSubtitle')}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-10 w-full">
              <WeatherSafetyDecision language={language} />

              <section aria-label={t('fishing.riskMapTitle')} className="w-full text-left">
                <h2 className="text-xl md:text-2xl font-extrabold text-primary font-['Plus_Jakarta_Sans'] mb-3">
                  {t('fishing.riskMapTitle')}
                </h2>
                <p className="text-on-surface-variant text-sm md:text-base max-w-3xl mb-4 leading-relaxed">
                  {t('fishing.riskMapSubtitle')}
                </p>
                <ZoneRiskMapModal
                  apiUrl={riskMapApiUrl}
                  language={language}
                  open
                  variant="inline"
                  onClose={() => {}}
                />
              </section>

              <div className="flex flex-col items-center gap-5">
                <button
                  type="button"
                  onClick={() => setFishAnalyzeOpen(true)}
                  className="px-10 py-4 md:px-14 md:py-5 min-w-[min(100%,20rem)] rounded-2xl border-2 border-[#007B8F] bg-white text-[#006071] text-xl md:text-2xl font-bold shadow-md hover:bg-[#007B8F]/8 active:scale-[0.99] transition-all duration-300"
                >
                  {t('fishing.fishAnalyzeCta')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
              <div className="bg-surface-container-low p-8 rounded-2xl shadow-sm space-y-4 md:col-span-2 flex flex-col justify-between group hover:bg-surface-container transition-colors duration-500">
                <div className="flex justify-between items-start">
                  <div></div>
                  <div className="h-2 w-2 rounded-full bg-secondary animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-2">{t('fishing.liveMonitoringTitle')}</h3>
                  <p className="text-on-surface-variant/80 text-sm">
                    {t('fishing.liveMonitoringDesc')}
                  </p>
                </div>
              </div>

              <div className="bg-primary p-8 rounded-2xl shadow-lg space-y-4 text-white flex flex-col justify-center">
                <div className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  {t('fishing.aboutCardTitle')}
                </div>
                <div className="text-sm font-medium opacity-90 leading-snug">
                  {t('fishing.stableZonesDesc')}
                </div>
              </div>

              <div className="bg-surface-container-highest p-8 rounded-2xl shadow-sm space-y-4 group hover:bg-surface-dim transition-colors duration-500">
                <h3 className="text-xl font-bold text-on-surface">{t('fishing.criticalAlertsTitle')}</h3>
                <p className="text-on-surface-variant/80 text-sm">
                  {t('fishing.criticalAlertsDesc')}
                </p>
              </div>

              <div className="md:col-span-2 relative rounded-2xl overflow-hidden min-h-[160px] group">
                <img
                  alt={t('fishing.bannerImageAlt')}
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPCvBrOaylq2gw2JqfA4JR8hEsgU5Zf9r5Crh22SVPY_mXy8vT8f97GKHQqkmhkVzRyF8smjpkyyxGdEEC8NtBNdh4YRceWPu86NpZAka_drBuznDvvE2r6QYxAJB_Kuax45sy-b1aYN6SpYrA_P6qwPqelo2pi0qBIBt40q-cTLpaF40D460nTc4X7_uKA-w-l7H3O9KSPWGeSmjom5tL1_1nC142QxpC1ZFbqhQN3L793nGr3C6GIHHptUqnzYbqLjWrtloHmTg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
                <div className="relative p-8 flex flex-col justify-end h-full min-h-[140px]">
                  <div className="text-primary font-bold text-lg uppercase tracking-widest">{t('fishing.coastalLedger')}</div>
                  <p className="text-on-surface/85 text-sm mt-2 max-w-xl leading-relaxed">{t('fishing.coastalBannerSubtitle')}</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-[#fff8f3]/80 dark:bg-[#0f171a]/80 backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-3xl">
          <a
            className="flex flex-col items-center justify-center text-[#006071]/50 dark:text-slate-500 px-4 py-2 hover:text-[#006071] transition-all"
            href="/dashboard"
          >
            <span className="font-['Manrope'] text-[11px] font-semibold uppercase tracking-widest mt-1">{t('nav.dashboard')}</span>
          </a>
          <a
            className="flex flex-col items-center justify-center bg-[#007B8F] text-white rounded-2xl px-6 py-2 shadow-lg scale-105"
            href="/fishing-zones"
          >
            <span className="font-['Manrope'] text-[11px] font-semibold uppercase tracking-widest mt-1">{t('fishing.navZones')}</span>
          </a>
        </nav>

        <div className="h-24 md:hidden"></div>
      </div>

      <FishAnalyzeModal
        apiUrl={fishAnalyzeApiUrl}
        language={language}
        open={fishAnalyzeOpen}
        onClose={() => setFishAnalyzeOpen(false)}
      />
    </>
  );
}
