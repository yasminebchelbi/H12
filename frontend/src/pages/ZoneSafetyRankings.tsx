import { useState } from 'react'
import type { Language } from '../i18n'
import { translate } from '../i18n'
import SeagrassFusionPanel from '../components/SeagrassFusionPanel'

type ZoneSafetyRankingsProps = {
  language: Language
  onLanguageChange: (language: Language) => void
}

export default function ZoneSafetyRankings({ language, onLanguageChange }: ZoneSafetyRankingsProps) {
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const [plantName, setPlantName] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [chatbotError, setChatbotError] = useState('')
  const [isAskingChatbot, setIsAskingChatbot] = useState(false)

  const chatbotApiUrl = import.meta.env.VITE_CHATBOT_API_URL || '/api/chatbot/ask/'

  const tr = (key: string) => translate(language, key)

  function handleLogout() {
    localStorage.removeItem('hwita-authenticated')
    window.location.href = '/fishing-zones'
  }

  async function handleChatbotSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setChatbotError('')
    setAnswer('')
    setIsAskingChatbot(true)

    try {
      const response = await fetch(chatbotApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plant_name: plantName,
          question
        })
      })

      const rawPayload = await response.text()
      let payload: { error?: string; error_code?: string; answer?: string } = {}
      try {
        payload = rawPayload ? JSON.parse(rawPayload) : {}
      } catch {
        payload = {}
      }

      if (!response.ok) {
        if (payload.error_code === 'QUOTA_EXCEEDED') {
          setChatbotError(tr('restoration.chatbotQuotaExceeded'))
          return
        }
        if (
          payload.error_code === 'MISSING_API_KEY' ||
          (payload.error || '').includes('GOOGLE_API_KEY')
        ) {
          setChatbotError(tr('restoration.chatbotMissingApiKey'))
          return
        }
        setChatbotError(payload.error || tr('restoration.chatbotError'))
        return
      }

      setAnswer(payload.answer || '')
    } catch {
      setChatbotError(tr('restoration.chatbotBackendUnavailable'))
    } finally {
      setIsAskingChatbot(false)
    }
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />

      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .zone-safety-rankings-page {
          font-family: 'Manrope', sans-serif;
          background-color: #fff8f3;
          color: #1f1b16;
        }
        .zone-safety-rankings-page h1,
        .zone-safety-rankings-page h2,
        .zone-safety-rankings-page h3,
        .zone-safety-rankings-page h4 {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .zone-safety-rankings-page [dir="rtl"] .navbar-text {
          font-size: 1.125rem;
          letter-spacing: 0.5px;
        }
      `}</style>

      <div className="zone-safety-rankings-page bg-surface text-on-surface">
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-cyan-950/80 backdrop-blur-xl shadow-[0_16px_42px_rgba(31,27,22,0.06)]">
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

            <div className="hidden md:flex items-center gap-10 font-display">
              <a
                className="text-neutral-500 dark:text-neutral-400 font-medium hover:text-cyan-600 dark:hover:text-cyan-200 transition-colors duration-300 text-base navbar-text"
                href="/dashboard"
              >
                {tr('nav.dashboard')}
              </a>
              <a
                className="text-cyan-700 dark:text-cyan-300 border-b-2 border-cyan-700 dark:border-cyan-300 pb-1 font-semibold transition-colors duration-300 text-base navbar-text"
                href="/restoration"
              >
                {tr('nav.restoration')}
              </a>
            </div>

            <div className="flex items-center gap-4 text-cyan-900 dark:text-cyan-100">
              <div className="relative">
                <button
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 border border-[#d8c8b8] hover:bg-white/100 transition-all hover:shadow-md"
                  title={tr('language.label')}
                >
                  <span className="material-symbols-outlined text-[#006071]">public</span>
                </button>
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 mt-2 bg-white border border-[#d8c8b8] rounded-lg shadow-lg z-10 min-w-[140px]">
                    {[
                      { code: 'en' as Language, label: tr('language.english') },
                      { code: 'fr' as Language, label: tr('language.french') },
                      { code: 'ar' as Language, label: tr('language.arabic') }
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
                <span className="text-sm font-semibold">{tr('nav.logout')}</span>
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-screen-2xl mx-auto px-6 py-12 pb-32">
          <header className="mb-16">
            <h1 className="text-5xl md:text-7xl font-extrabold text-primary tracking-tighter mb-4">
              {tr('restoration.title')}
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed">
              {tr('restoration.subtitle')}
            </p>
          </header>

          <div className="mb-12">
            <SeagrassFusionPanel language={language} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <section className="md:col-span-8 group">
              <div className="relative overflow-hidden rounded-3xl bg-surface-container-lowest shadow-[0_30px_60px_rgba(0,96,113,0.06)] h-full">
                <div className="h-64 md:h-80 w-full relative overflow-hidden">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    data-alt="serene tropical beach with crystal clear turquoise water and white sand under a soft afternoon sun with gentle ripples"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3I581U64mp3YgxEwHu_RWnTiVIT12wazqJNIlWhnaN1libNX7Yd9LhO2vWIp04GUB_bzG9c2vicNIlRZiJvuVy-HXeLkbwLHeBJqJSJDw-sjxJ1qjqwWkZ9CjHFAooOiNvpcz08ynN88SwMaWwrwLNL3vQDS6oZIRSGdr6xL0t-G06E3eHfbW6pJ4lbuc-ETxYE_V0rfWznvG7LPFBOVpUNMmxwJhA9mifoKgpKeFoRe8LDESeRfgaTogmKaEH9A0FwvoFWAz68s"
                    alt="Azure Bay Reserve"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute top-6 left-6">
                    <span className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                      <span
                        className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        verified_user
                      </span>
                      {tr('restoration.rankSafest')}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h2 className="text-4xl font-extrabold text-primary tracking-tight">{tr('restoration.mainZone')}</h2>
                      <p className="text-secondary font-semibold mt-1">{tr('restoration.mainStatus')}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-5xl font-black text-secondary">98</span>
                      <p className="text-xs font-bold uppercase tracking-widest text-secondary/60">{tr('restoration.safetyIndex')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-2 p-4 rounded-2xl bg-surface-container-low">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{tr('restoration.windSpeed')}</p>
                      <p className="text-lg font-bold text-on-surface">4 knots</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{tr('restoration.visibility')}</p>
                      <p className="text-lg font-bold text-on-surface">12.4 km</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{tr('restoration.advisory')}</p>
                      <p className="text-lg font-bold text-secondary">{tr('restoration.none')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="md:col-span-4">
              <div className="rounded-3xl bg-surface-container-low p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="rounded-2xl bg-white/70 p-4 border border-[#d8c8b8]">
                    <h4 className="text-sm font-extrabold uppercase tracking-widest text-primary mb-3">
                      {tr('restoration.chatbotTitle')}
                    </h4>
                    <form className="space-y-3" onSubmit={handleChatbotSubmit}>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block mb-1">
                          {tr('restoration.chatbotPlantLabel')}
                        </label>
                        <input
                          className="w-full rounded-lg border border-[#d8c8b8] bg-white px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/25"
                          onChange={(event) => setPlantName(event.target.value)}
                          placeholder={tr('restoration.chatbotPlantPlaceholder')}
                          required
                          value={plantName}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block mb-1">
                          {tr('restoration.chatbotQuestionLabel')}
                        </label>
                        <textarea
                          className="w-full rounded-lg border border-[#d8c8b8] bg-white px-3 py-2 text-sm text-on-surface outline-none min-h-[92px] resize-y focus:ring-2 focus:ring-primary/25"
                          onChange={(event) => setQuestion(event.target.value)}
                          placeholder={tr('restoration.chatbotQuestionPlaceholder')}
                          required
                          value={question}
                        />
                      </div>

                      <button
                        className="w-full py-2.5 bg-secondary text-white font-bold rounded-lg transition-all hover:brightness-95 disabled:opacity-60"
                        disabled={isAskingChatbot}
                        type="submit"
                      >
                        {isAskingChatbot ? tr('restoration.chatbotLoading') : tr('restoration.chatbotSubmit')}
                      </button>
                    </form>

                    {chatbotError && (
                      <p className="mt-3 text-sm font-semibold text-tertiary">
                        {chatbotError}
                      </p>
                    )}

                    {answer && (
                      <div className="mt-4 rounded-xl bg-surface-container-low p-3 border border-outline-variant/20">
                        <p className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-1">
                          {tr('restoration.chatbotAnswerLabel')}
                        </p>
                        <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                          {answer}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="md:col-span-12 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-surface-container-low p-6 rounded-3xl flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center shrink-0">
                    <span className="text-xl font-black text-primary/40">03</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-primary">{tr('restoration.zone3')}</h4>
                    <p className="text-sm text-on-surface-variant mb-3">
                      {tr('restoration.zone3Desc')}
                    </p>
                    <span className="inline-flex items-center px-3 py-1 bg-surface-container-highest text-primary font-bold text-[10px] uppercase tracking-widest rounded-full">
                      {tr('restoration.safetyIndex')}: 74
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-low p-6 rounded-3xl flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center shrink-0">
                    <span className="text-xl font-black text-primary/40">04</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-primary">{tr('restoration.zone4')}</h4>
                    <p className="text-sm text-on-surface-variant mb-3">
                      {tr('restoration.zone4Desc')}
                    </p>
                    <span className="inline-flex items-center px-3 py-1 bg-surface-container-highest text-primary font-bold text-[10px] uppercase tracking-widest rounded-full">
                      {tr('restoration.safetyIndex')}: 62
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-low p-6 rounded-3xl flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center shrink-0">
                    <span className="text-xl font-black text-primary/40">05</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-primary">{tr('restoration.zone5')}</h4>
                    <p className="text-sm text-on-surface-variant mb-3">{tr('restoration.zone5Desc')}</p>
                    <span className="inline-flex items-center px-3 py-1 bg-surface-container-highest text-primary font-bold text-[10px] uppercase tracking-widest rounded-full">
                      {tr('restoration.safetyIndex')}: 55
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="md:col-span-12 mt-12">
              <div className="flex items-center gap-4 mb-8">
                <span
                  className="material-symbols-outlined text-tertiary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  report
                </span>
                <h2 className="text-3xl font-extrabold text-on-surface tracking-tight uppercase">{tr('restoration.highRisk')}</h2>
                <div className="h-[2px] grow bg-tertiary/10"></div>
              </div>

              <div className="space-y-4">
                <div className="group relative bg-surface-container-lowest p-1 rounded-[2rem] overflow-hidden">
                  <div className="absolute inset-0 bg-tertiary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-surface-container-lowest rounded-[1.85rem] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                        <img
                          className="w-full h-full object-cover"
                          data-alt="dramatic rough sea with large crashing waves against dark jagged volcanic rocks under a stormy dark sky"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuClg4od7ZvbO6nMk3Wm7vgnoMdZanwABdoTDFjwHbOyxK5W0a8rGYs42eOB-0kCAulZqPtU_gegaFyox-4D_pI83jXyipvwAA9l7M1O_4b8uwCrXpTeanLO28m1N0Bt48CQ6RIbdsn1MNi2pE75QWybR0w9a8wcrZDz1F1vAK6pi57rHwK-Iagl-gxBbZtgasqVrKZILgrAaLt4EisX04MKXGAsilj5ozItvH7ld2vU_vX0F3GPsMpSNjeSO4o_KeGiJa-7j1Rx-g0"
                          alt="Iron Reach Cliffs"
                        />
                      </div>
                      <div>
                        <h4 className="text-2xl font-extrabold text-tertiary tracking-tight leading-none">
                          {tr('restoration.alert1Title')}
                        </h4>
                        <p className="text-on-surface-variant font-medium mt-2">
                          {tr('restoration.alert1Desc')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 px-6">
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary/60">{tr('restoration.riskLevel')}</p>
                        <p className="text-2xl font-black text-tertiary">{tr('restoration.critical')}</p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-outline-variant/30"></div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary/60">{tr('restoration.safetyIndex')}</p>
                        <p className="text-2xl font-black text-tertiary">14</p>
                      </div>
                      <span className="material-symbols-outlined text-tertiary text-3xl">warning</span>
                    </div>
                  </div>
                </div>

                <div className="group relative bg-surface-container-lowest p-1 rounded-[2rem] overflow-hidden">
                  <div className="relative bg-surface-container-lowest rounded-[1.85rem] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                        <img
                          className="w-full h-full object-cover"
                          data-alt="misty ocean mouth where river meets sea with turbulent gray water and dense coastal fog obscuring the horizon"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4p9zxuWtZed9D7fIOR9fK5He_0qNpH2PKsgIF3m9szL5Yl-3UMkofOn1Yd37y1ZpMvkHKfRbWmmVZOl6Xv9_r6PjJmYdAJ_jQOzNx-8qvu-LZ617KWhF3SjZBPty7225A0F0V7jU2FCaFj5sKOqCGSvHoJpKUSgRjCMfAV4q-U6cbx58ql1pd8kv6HKGsxoAekeM1kE2pE3LF81Fj0lt9NxaMUzaDJkDHT-gU3Kit6Bd_IBaR-bXOYCRXsRbhb6E0701qVJ4Bo0I"
                          alt="The Void Mouth"
                        />
                      </div>
                      <div>
                        <h4 className="text-2xl font-extrabold text-tertiary tracking-tight leading-none">{tr('restoration.alert2Title')}</h4>
                        <p className="text-on-surface-variant font-medium mt-2">
                          {tr('restoration.alert2Desc')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 px-6">
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary/60">{tr('restoration.riskLevel')}</p>
                        <p className="text-2xl font-black text-tertiary">{tr('restoration.danger')}</p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-outline-variant/30"></div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary/60">{tr('restoration.safetyIndex')}</p>
                        <p className="text-2xl font-black text-tertiary">26</p>
                      </div>
                      <span className="material-symbols-outlined text-tertiary text-3xl">block</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-[#fff8f3]/80 dark:bg-[#0f171a]/80 backdrop-blur-xl rounded-t-3xl shadow-[0_-10px_40px_rgba(31,27,22,0.05)]">
          <a className="flex flex-col items-center justify-center text-[#006071]/50 dark:text-slate-500 px-4 py-2 hover:text-[#006071] transition-all active:scale-95 duration-150" href="/dashboard">
            <span className="material-symbols-outlined mb-1">dashboard</span>
            <span className="font-['Manrope'] text-[11px] font-semibold uppercase tracking-widest">{tr('nav.dashboard')}</span>
          </a>
          <a className="flex flex-col items-center justify-center bg-[#007B8F] text-white rounded-2xl px-6 py-2 shadow-lg shadow-[#007B8F]/30 active:scale-95 duration-150" href="/restoration">
            <span className="material-symbols-outlined mb-1">tsunami</span>
            <span className="font-['Manrope'] text-[11px] font-semibold uppercase tracking-widest">{tr('nav.restoration')}</span>
          </a>
          <button
            className="flex flex-col items-center justify-center text-[#006071]/50 dark:text-slate-500 px-4 py-2 hover:text-[#006071] transition-all active:scale-95 duration-150"
            onClick={handleLogout}
            type="button"
          >
            <span className="material-symbols-outlined mb-1">logout</span>
            <span className="font-['Manrope'] text-[11px] font-semibold uppercase tracking-widest">{tr('nav.signOut')}</span>
          </button>
        </nav>
      </div>
    </>
  );
}
