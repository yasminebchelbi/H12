import { useState } from 'react'
import type { Language } from '../i18n'
import { translate } from '../i18n'

type AdminDashboardProps = {
  language: Language
  onLanguageChange: (language: Language) => void
}

export default function AdminDashboard({ language, onLanguageChange }: AdminDashboardProps) {
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  function handleLogout() {
    localStorage.removeItem('hwita-authenticated')
    window.location.href = '/fishing-zones'
  }

  const t = (key: string) => translate(language, key)

  return (
    <>
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
        .admin-dashboard-page {
          font-family: 'Manrope', sans-serif;
          background-color: #fff8f3;
          min-height: 100vh;
        }
        .admin-dashboard-page h1,
        .admin-dashboard-page h2,
        .admin-dashboard-page h3,
        .admin-dashboard-page h4 {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
      `}</style>

      <div className="admin-dashboard-page bg-surface text-on-surface antialiased min-h-screen">
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-cyan-950/80 backdrop-blur-xl shadow-[0_16px_42px_rgba(31,27,22,0.06)]">
          <div className="flex justify-between items-center w-full px-8 h-24 max-w-screen-2xl mx-auto">
            <div className="flex items-center gap-4">
              <a className="flex items-center" href="/dashboard">
                <img
                  alt="Hwita Logo"
                  className="h-16 w-auto object-contain"
                  src="https://lh3.googleusercontent.com/aida/ADBb0uguFhSk9yS8tOtJRHLePmLBBOD8iuAZZY0j5jLDuI9TKscs7OAwcHe6bouVCSRF6QUzYd-pLscWPVkUx93PxONYEO-Vul6BVbfueEiNl78X043BvqHnNZnepf0uzwXt3w-lYnRb4pLhtoXE9kO6cVYshBYmbLgu8R9MiNQqjVykNSgvYiu3ODLWdb5IrzigEOuQc1aOR9Z-xIQ_37hQbT3QMmVrYsGBSoX_detifDrBD98vE6LSdSiFC970JyKQWhYGC9_IZwfpXA"
                />
              </a>
            </div>

            <nav className="hidden md:flex items-center gap-10 font-display">
              <a
                className="text-cyan-700 dark:text-cyan-300 border-b-2 border-cyan-700 dark:border-cyan-300 pb-1 font-semibold transition-colors duration-300 text-base navbar-text"
                href="/dashboard"
              >
                {t('nav.dashboard')}
              </a>
              <a
                className="text-neutral-500 dark:text-neutral-400 font-medium hover:text-cyan-600 dark:hover:text-cyan-200 transition-colors duration-300 text-base navbar-text"
                href="/restoration"
              >
                {t('nav.restoration')}
              </a>
            </nav>

            <div className="flex items-center gap-4 text-cyan-900 dark:text-cyan-100">
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
              <button
                className="inline-flex items-center gap-2 rounded-full bg-[#007B8F] px-4 py-2 text-white shadow-[0_10px_24px_rgba(0,123,143,0.16)] transition-all hover:bg-[#006071] active:scale-95"
                onClick={handleLogout}
                type="button"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                <span className="text-sm font-semibold">{t('nav.logout')}</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-screen-2xl mx-auto px-6 py-8 pb-32">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-primary tracking-tight mb-2">{t('dashboard.title')}</h1>
            <p className="text-on-surface-variant text-lg max-w-2xl">
              {t('dashboard.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-surface-container-low p-6 rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500"></div>
                  <p className="text-sm font-bold uppercase tracking-widest text-primary/60 mb-2 font-label">
                    {t('dashboard.metricCoralHealth')}
                  </p>
                  <h3 className="text-3xl font-extrabold text-primary mb-1">84.2%</h3>
                  <p className="text-secondary text-sm font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">trending_up</span> {t('dashboard.metricCoralTrend')}
                  </p>
                </div>

                <div className="bg-surface-container-low p-6 rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500"></div>
                  <p className="text-sm font-bold uppercase tracking-widest text-primary/60 mb-2 font-label">
                    {t('dashboard.metricActiveVessels')}
                  </p>
                  <h3 className="text-3xl font-extrabold text-primary mb-1">128</h3>
                  <p className="text-on-surface-variant text-sm font-semibold">{t('dashboard.metricActiveVesselsDesc')}</p>
                </div>

                <div className="bg-surface-container-low p-6 rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500"></div>
                  <p className="text-sm font-bold uppercase tracking-widest text-primary/60 mb-2 font-label">
                    {t('dashboard.metricRiskLevel')}
                  </p>
                  <h3 className="text-3xl font-extrabold text-tertiary mb-1">{t('dashboard.metricRiskLevelValue')}</h3>
                  <p className="text-tertiary text-sm font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">verified</span> {t('dashboard.metricRiskStatus')}
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-highest p-8 rounded-2xl">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-on-background mb-1">{t('dashboard.progressTitle')}</h2>
                    <p className="text-on-surface-variant text-sm">
                      {t('dashboard.progressSubtitle')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold font-label uppercase">
                      {t('dashboard.primaryZone')}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold font-label uppercase">
                      {t('dashboard.bufferZone')}
                    </span>
                  </div>
                </div>

                <div className="h-64 flex items-end justify-between gap-2 px-2">
                  <div className="flex flex-col items-center flex-1 gap-2">
                    <div className="w-full bg-primary-container/20 rounded-t-lg relative h-[40%]">
                      <div className="absolute bottom-0 w-full bg-primary-container rounded-t-lg h-[60%]"></div>
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant font-label uppercase">{t('dashboard.monthJan')}</span>
                  </div>
                  <div className="flex flex-col items-center flex-1 gap-2">
                    <div className="w-full bg-primary-container/20 rounded-t-lg relative h-[55%]">
                      <div className="absolute bottom-0 w-full bg-primary-container rounded-t-lg h-[70%]"></div>
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant font-label uppercase">{t('dashboard.monthFeb')}</span>
                  </div>
                  <div className="flex flex-col items-center flex-1 gap-2">
                    <div className="w-full bg-primary-container/20 rounded-t-lg relative h-[65%]">
                      <div className="absolute bottom-0 w-full bg-primary-container rounded-t-lg h-[55%]"></div>
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant font-label uppercase">{t('dashboard.monthMar')}</span>
                  </div>
                  <div className="flex flex-col items-center flex-1 gap-2">
                    <div className="w-full bg-primary-container/20 rounded-t-lg relative h-[50%]">
                      <div className="absolute bottom-0 w-full bg-primary-container rounded-t-lg h-[80%]"></div>
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant font-label uppercase">{t('dashboard.monthApr')}</span>
                  </div>
                  <div className="flex flex-col items-center flex-1 gap-2">
                    <div className="w-full bg-primary-container/20 rounded-t-lg relative h-[80%]">
                      <div className="absolute bottom-0 w-full bg-primary-container rounded-t-lg h-[85%]"></div>
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant font-label uppercase">{t('dashboard.monthMay')}</span>
                  </div>
                  <div className="flex flex-col items-center flex-1 gap-2">
                    <div className="w-full bg-primary-container/20 rounded-t-lg relative h-[90%]">
                      <div className="absolute bottom-0 w-full bg-primary-container rounded-t-lg h-[75%]"></div>
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant font-label uppercase">{t('dashboard.monthJun')}</span>
                  </div>
                  <div className="flex flex-col items-center flex-1 gap-2">
                    <div className="w-full bg-primary-container/20 rounded-t-lg relative h-[75%]">
                      <div className="absolute bottom-0 w-full bg-primary-container rounded-t-lg h-[95%]"></div>
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant font-label uppercase">{t('dashboard.monthJul')}</span>
                  </div>
                </div>
              </div>
            </div>

            <aside className="md:col-span-4 space-y-6">
              <div className="bg-surface-container-low rounded-2xl overflow-hidden relative group">
                <div className="aspect-video w-full relative">
                  <img
                    className="w-full h-full object-cover grayscale opacity-80"
                    data-alt="Top-down satellite view of coastal coral reef systems with deep blue ocean and turquoise shallow waters"
                    data-location="Coastal Fiji"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUn1Wj6mDPLbEHGPQvdSKjHh4OjNd_sHWLVFb41dfrN2kxCfd2vs4vPU_sZvtNnMtLRbHYAM6jTyi89VATUHzsrC0qicccI2hbbH3Wux3j84p2vPzYBt0DTVmOTryf01d9fAjj0-cnOa0_GnIho8P4q2bRF7FrOh89WBM9HJea_M4RLNfXEpsAvbgjZYpJ0eb_uN5RsNgkj099GQbeoKAE8jjBcE9WB8OylkeVRFzWKDneAKqEXX6rGNznJd9CG0DDHrIneQDpAnI"
                    alt="Protected marine sector"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-md p-3 rounded-lg border border-outline-variant/15">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="material-symbols-outlined text-secondary text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        location_on
                      </span>
                      <span className="text-xs font-bold uppercase tracking-tighter text-on-surface">
                        {t('dashboard.sectorA4')}
                      </span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant leading-tight">
                      {t('dashboard.sectorA4Desc')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-primary mb-6 flex items-center justify-between">
                  {t('dashboard.recentActivity')}
                  <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">{t('dashboard.realtime')}</span>
                </h3>

                <div className="space-y-6">
                  <div className="flex gap-4 relative">
                    <div className="absolute left-3 top-8 bottom-[-24px] w-[2px] bg-outline-variant/20"></div>
                    <div className="z-10 bg-secondary-container w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                      <span
                        className="material-symbols-outlined text-xs text-on-secondary-container"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        waves
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">{t('dashboard.activity1Title')}</h4>
                      <p className="text-xs text-on-surface-variant mb-1">
                        {t('dashboard.activity1Desc')}
                      </p>
                      <span className="text-[10px] font-bold text-primary/50 font-label uppercase">{t('dashboard.time12m')}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 relative">
                    <div className="absolute left-3 top-8 bottom-[-24px] w-[2px] bg-outline-variant/20"></div>
                    <div className="z-10 bg-tertiary-container w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                      <span
                        className="material-symbols-outlined text-xs text-on-tertiary"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        warning
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">{t('dashboard.activity2Title')}</h4>
                      <p className="text-xs text-on-surface-variant mb-1">
                        {t('dashboard.activity2Desc')}
                      </p>
                      <span className="text-[10px] font-bold text-primary/50 font-label uppercase">{t('dashboard.time45m')}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="z-10 bg-primary-fixed w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                      <span
                        className="material-symbols-outlined text-xs text-on-primary-fixed"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        eco
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">{t('dashboard.activity3Title')}</h4>
                      <p className="text-xs text-on-surface-variant mb-1">
                        {t('dashboard.activity3Desc')}
                      </p>
                      <span className="text-[10px] font-bold text-primary/50 font-label uppercase">{t('dashboard.time2h')}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-8 py-3 rounded-xl bg-surface-container-highest text-primary text-xs font-bold uppercase tracking-widest hover:bg-surface-dim transition-colors">
                  {t('dashboard.viewAudit')}
                </button>
              </div>
            </aside>
          </div>
        </main>

        <footer className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-[#fff8f3]/80 dark:bg-[#0f171a]/80 backdrop-blur-xl rounded-t-3xl shadow-[0_-10px_40px_rgba(31,27,22,0.05)]">
          <a
            className="flex flex-col items-center justify-center bg-[#007B8F] text-white rounded-2xl px-6 py-2 shadow-lg shadow-[#007B8F]/30 active:scale-95 duration-150"
            href="/dashboard"
          >
            <span className="material-symbols-outlined mb-1">dashboard</span>
            <span className="font-['Manrope'] text-[11px] font-semibold uppercase tracking-widest">
              {t('nav.dashboard')}
            </span>
          </a>
          <a
            className="flex flex-col items-center justify-center text-[#006071]/50 dark:text-slate-500 px-4 py-2 hover:text-[#006071] transition-all active:scale-95 duration-150"
            href="/restoration"
          >
            <span className="material-symbols-outlined mb-1">tsunami</span>
            <span className="font-['Manrope'] text-[11px] font-semibold uppercase tracking-widest">
              {t('nav.restoration')}
            </span>
          </a>
          <button
            className="flex flex-col items-center justify-center text-[#006071]/50 dark:text-slate-500 px-4 py-2 hover:text-[#006071] transition-all active:scale-95 duration-150"
            onClick={handleLogout}
            type="button"
          >
            <span className="material-symbols-outlined mb-1">logout</span>
            <span className="font-['Manrope'] text-[11px] font-semibold uppercase tracking-widest">
              {t('nav.signOut')}
            </span>
          </button>
        </footer>
      </div>
    </>
  )
}
