import type { FormEvent } from 'react'
import { useState } from 'react'
import type { Language } from '../i18n'
import { translate } from '../i18n'

type LoginProps = {
  language: Language
  onLanguageChange: (language: Language) => void
}

export default function Login({ language, onLanguageChange }: LoginProps) {
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    localStorage.setItem('hwita-authenticated', 'true')
    window.location.href = '/dashboard'
  }

  const t = (key: string) => translate(language, key)

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
        .login-page {
          font-family: 'Manrope', sans-serif;
        }
        .login-page h1,
        .login-page h2,
        .login-page h3,
        .login-page .font-headline {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .login-page .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .login-page .bg-oceanic-mesh {
          background-color: #fcf5ed;
        }
        .login-page [dir="rtl"] .navbar-text {
          font-size: 1.125rem;
          letter-spacing: 0.5px;
        }
      `}</style>

      <div className="login-page bg-oceanic-mesh min-h-screen flex flex-col">
        <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-[0_1px_0_rgba(31,27,22,0.04)]">
          <div className="flex justify-end items-center gap-4 px-6 py-5 w-full max-w-7xl mx-auto">
            <a className="text-[#6b7d8a] hover:text-[#007B8F] transition-colors duration-300 font-label text-base font-medium navbar-text" href="/fishing-zones">
              {t('nav.fishingZones')}
            </a>
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
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center px-6 pt-24 pb-8">
          <div className="w-full max-w-[1120px] min-h-[540px] flex flex-col md:flex-row bg-[#f5e8db] rounded-[14px] overflow-hidden shadow-[0_18px_44px_rgba(31,27,22,0.04)]">
            <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-[#f2e5d6] flex-col">
              <div className="absolute inset-0 flex items-center justify-center p-12 pointer-events-none">
                <img
                  alt="Hwita Logo"
                  className="max-w-[360px] w-full max-h-[250px] object-contain opacity-95"
                  src="https://lh3.googleusercontent.com/aida/ADBb0uguFhSk9yS8tOtJRHLePmLBBOD8iuAZZY0j5jLDuI9TKscs7OAwcHe6bouVCSRF6QUzYd-pLscWPVkUx93PxONYEO-Vul6BVbfueEiNl78X043BvqHnNZnepf0uzwXt3w-lYnRb4pLhtoXE9kO6cVYshBYmbLgu8R9MiNQqjVykNSgvYiu3ODLWdb5IrzigEOuQc1aOR9Z-xIQ_37hQbT3QMmVrYsGBSoX_detifDrBD98vE6LSdSiFC970JyKQWhYGC9_IZwfpXA"
                />
              </div>
              <div className="relative z-10 p-12 flex flex-col h-full justify-between text-white">
                <div></div>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full border-2 border-[#0c6478] bg-[#0e1114] overflow-hidden shadow-sm">
                      <img
                        alt="User"
                        data-alt="Professional headshot of a female environmental scientist in a modern lab setting."
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0i1MCVDKDzlGAcV6EibddnERiyX2Fn_v5Z5qgPTJES1oxQ9Hc6kUVLfmhxE7mfxrW2Yefv3laMRjc7XgwU6m2fUsDU6bDkDsLfgbBSzbo5JcdkxWrQtvQqBQ8-_-2ZH-AwF88ugIeJ5SOvYKVAm7yhl2QLZtVtZjefvXtvj4YZI5ZoUqbf4eeJYlK5jqySnFCAbkR4OngmDWmlHoxbwiuM8_V2WOGhQcROWcp9VVWNOUbKlbo29u7ITsvOWCvAgatMtAjUAzmqe8"
                      />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-[#0c6478] bg-[#0e1114] overflow-hidden shadow-sm">
                      <img
                        alt="User"
                        data-alt="Close up portrait of a senior government official with a neutral professional expression."
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCvvvTXTZtezJK2huArje_csZXtIyMY6rOkI9o4tJAymKRgyOnudnbHotJv1hdH6IziFANCme0fIb9cbniQlauNXE41o1BwBNSF-cgIJN53t32q3kygghpVyBJWS-nKDv8Zr1AKHiyucsDUVGKnGE6QPXVSeV-Vd4xDgH5G5Ga1tJJcRsLBvuwzXILPuUHBL5EA4qmzdFT3olaULIiW5LnAZOibinPMhN7JjwXLwVPc6Bos8aFh1MSPjzG50hWtp2VIEa6Vb8TtBE"
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium opacity-60 italic text-white/90">
                    {t('login.trustedBy')}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 p-8 lg:p-16 bg-[#f7eee3] flex flex-col justify-center">
              <div className="mb-10 text-center md:text-left">
                <h2 className="text-3xl font-bold font-headline text-on-surface mb-2">{t('login.welcome')}</h2>
                <p className="text-on-surface-variant font-body">{t('login.subtitle')}</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-primary font-label tracking-wide uppercase" htmlFor="email">
                    {t('login.email')}
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                      alternate_email
                    </span>
                    <input
                      className="w-full pl-12 pr-4 py-4 bg-white border-0 rounded-xl focus:ring-2 focus:ring-primary-container/20 text-on-surface placeholder:text-outline-variant transition-all shadow-[0_2px_8px_rgba(31,27,22,0.04)]"
                      id="email"
                      placeholder="name@organization.gov"
                      type="email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label
                      className="block text-sm font-bold text-primary font-label tracking-wide uppercase"
                      htmlFor="password"
                    >
                      {t('login.password')}
                    </label>
                    <a className="text-sm font-semibold text-secondary hover:text-primary-container transition-colors" href="/login">
                      {t('login.forgotPassword')}
                    </a>
                  </div>

                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                      lock
                    </span>
                    <input
                      className="w-full pl-12 pr-4 py-4 bg-white border-0 rounded-xl focus:ring-2 focus:ring-primary-container/20 text-on-surface placeholder:text-outline-variant transition-all shadow-[0_2px_8px_rgba(31,27,22,0.04)]"
                      id="password"
                      placeholder="••••••••"
                      type="password"
                    />
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary"
                      type="button"
                    >
                      <span className="material-symbols-outlined">visibility</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-2">
                  <input
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20"
                    id="remember"
                    type="checkbox"
                  />
                  <label className="text-sm font-medium text-on-surface-variant" htmlFor="remember">
                    {t('login.remember')}
                  </label>
                </div>

                <button
                  className="w-full py-4 bg-[#0d7487] text-white font-bold font-headline rounded-xl shadow-[0_12px_24px_rgba(13,116,135,0.22)] active:scale-[0.98] transition-all hover:shadow-[0_14px_28px_rgba(13,116,135,0.28)] flex items-center justify-center gap-2"
                  type="submit"
                >
                  <span>{t('login.submit')}</span>
                  <span className="material-symbols-outlined text-xl">login</span>
                </button>
              </form>

              <div className="mt-12 pt-8 text-center">
                <p className="text-sm text-on-surface-variant mb-6">{t('login.securityNote')}</p>
                <div className="flex justify-center gap-8 opacity-35 grayscale">
                  <img
                    alt="UN"
                    className="h-6 object-contain"
                    data-alt="Simplified monochrome logo of a global environmental organization."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjJoPhVxAtBedpG_NZ37cqTeV_Cq7dfbhE_al2kDjfw9LRUnLlUkmYjcclsb9rE4IrBvBlVP00Fo_M09VIbJCNx9cwBoKU5JxQ_u7AbJS5s0dzRJhZ7kZM0fzq4wDFkHQNsHFH4ehpx_AjkH3LugfZK2p9P0_PkKHu0pYaxoCoNe1wNLKl17zJat2_uOwAqUwR_OZBqNTMIvHBouk_jguZZTVOEtCI1iNZ8RlI6nF3h2iA2cFJXRTzr3GLVnl7-Zyj1MdHw-BUt9w"
                  />
                  <img
                    alt="Intergovernmental Panel"
                    className="h-6 object-contain"
                    data-alt="Simplified monochrome logo of a governmental scientific body."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjOrYnEAt3WTbrNNd4ixdjG1N1BbG4cJ1NZMsuTAEbYfFliuU2mdsObbcvfakaAdUsxytPwS630qmzV1h9Qsb-_JQq8yp9TY-1t7dvdNsBYT9Uotkc80l-JXIlipuVLT3gB3yIuOXeZVENpziyfX-oYXFFemb40XTW1Ey9VT7KXvLL_R7vWl9f16eFdiUS06mReTVfpvrrb1dzdsX0smfStQqGqYgD7aReW3Po1Ra5byb6n53HgSH6_WoVbG4fDTvoJ9x631NW_TY"
                  />
                  <img
                    alt="Trust Fund"
                    className="h-6 object-contain"
                    data-alt="Simplified monochrome logo of a maritime conservation fund."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHfVO9g88loFqjxVfdZnm4KRvWYFUmhfS47Pdk63V5tCy2C1OtLiMQPTKwn3oXpWCjLDuLQDLpuGN_HJU7-4hh3oELKqhgYOJnD42MzuxQcnr62YUZFDJZe17nKtn9hdqGchr9hvsXDjb9u3Y1c0Bepkd17_vw6UZnvtRL8CB3lvRHzUQ0cZ22cPINcMn7WbCdgliSnX7sDs19fthBqCDc94QQAgjdJvwXeOerzUhpK8lawZJag-kFKfY3j6QAyK-AuJYpdSGAAVU"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-outline">
          <div className="flex items-center gap-4">
            <span>© 2024 Hwita Foundation</span>
            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
            <a className="hover:text-primary transition-colors" href="/login#privacy-protocol">
              {t('login.privacyProtocol')}
            </a>
            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
            <a className="hover:text-primary transition-colors" href="/login#data-sovereignty">
              {t('login.dataSovereignty')}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">public</span>
            <span>{t('login.servingZones')}</span>
          </div>
        </footer>
      </div>
    </>
  );
}
