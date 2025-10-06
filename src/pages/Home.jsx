import React, { useState, useEffect } from 'react'

function Typewriter({ words = [], typingSpeed = 120, deletingSpeed = 60, pause = 1200 }) {
  const [index, setIndex] = useState(0)
  const [display, setDisplay] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let timeout;
    const currentWord = words[index % words.length]

    if (!deleting) {
      timeout = setTimeout(() => {
        setDisplay(currentWord.slice(0, display.length + 1))
        if (display.length + 1 === currentWord.length) {
          setTimeout(() => setDeleting(true), pause)
        }
      }, typingSpeed)
    } else {
      timeout = setTimeout(() => {
        setDisplay(currentWord.slice(0, display.length - 1))
        if (display.length - 1 === 0) {
          setDeleting(false)
          setIndex(i => i + 1)
        }
      }, deletingSpeed)
    }

    return () => clearTimeout(timeout)
  }, [display, deleting, index, words, typingSpeed, deletingSpeed, pause])

  return <span className="typewriter">{display}<span className="cursor">|</span></span>
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function validate() {
    const e = {}
    if (!form.name || form.name.trim().length < 2) e.name = 'Please enter your name.'
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email.'
    if (!form.message || form.message.trim().length < 10) e.message = 'Message must be at least 10 characters.'
    return e
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    setLoading(true)
    // simulate submit
    await new Promise(res => setTimeout(res, 900))
    setLoading(false)
    setSuccess(true)
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setSuccess(false), 4000)
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
      {success && <div className="p-3 bg-emerald-50 text-emerald-800 rounded">Thanks — your message has been sent!</div>}

      <div>
  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Name</label>
  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={`mt-1 block w-full rounded-md border px-3 py-2 text-slate-900 dark:text-slate-100 ${errors.name ? 'border-rose-400 bg-rose-50 dark:bg-rose-900' : 'border-slate-200 bg-white dark:bg-slate-800'}`} />
        {errors.name && <p className="mt-1 text-sm text-rose-600">{errors.name}</p>}
      </div>

      <div>
  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
  <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} type="email" className={`mt-1 block w-full rounded-md border px-3 py-2 text-slate-900 dark:text-slate-100 ${errors.email ? 'border-rose-400 bg-rose-50 dark:bg-rose-900' : 'border-slate-200 bg-white dark:bg-slate-800'}`} />
        {errors.email && <p className="mt-1 text-sm text-rose-600">{errors.email}</p>}
      </div>

      <div>
  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Message</label>
  <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={5} className={`mt-1 block w-full rounded-md border px-3 py-2 text-slate-900 dark:text-slate-100 ${errors.message ? 'border-rose-400 bg-rose-50 dark:bg-rose-900' : 'border-slate-200 bg-white dark:bg-slate-800'}`} />
        {errors.message && <p className="mt-1 text-sm text-rose-600">{errors.message}</p>}
      </div>

      <div className="flex items-center justify-between">
        <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded shadow hover:bg-sky-700 disabled:opacity-60">
          {loading ? 'Sending...' : 'Send message'}
        </button>
        <p className="text-sm text-slate-500">Or email me at <a href="mailto:you@example.com" className="text-sky-600">you@example.com</a></p>
      </div>
    </form>
  )
}

function ThemeToggle({ dark, setDark }) {
  return (
    <button
      aria-pressed={dark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setDark(d => !d)}
      className="relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-300 focus:outline-none"
      title={dark ? 'Dark mode' : 'Light mode'}
    >
      <span className={`absolute inset-0 rounded-full ${dark ? 'bg-sky-600' : 'bg-slate-300'}`} />
      <span className={`relative z-10 ml-1 inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-300 ${dark ? 'translate-x-6' : 'translate-x-0'}`}>
        <span className="sr-only">toggle</span>
      </span>
    </button>
  )
}

export default function Home() {
  const [dark, setDark] = useState(() => {
    try {
      const v = localStorage.getItem('theme')
      if (v) return v === 'dark'
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch { return false }
  })

  useEffect(() => {
    try { localStorage.setItem('theme', dark ? 'dark' : 'light') } catch {}
    const header = document.querySelector('header')
    if (dark) {
      document.documentElement.classList.add('dark')
      if (header) header.classList.add('header-dark')
    } else {
      document.documentElement.classList.remove('dark')
      if (header) header.classList.remove('header-dark')
    }
  }, [dark])

  return (
  <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-100">
      {/* Fixed header so sections can be full viewport */}
  <header className="fixed top-0 left-0 right-0 z-20 bg-white/60 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <img src={dark ? '/src/assets/logoW.png' : '/src/assets/logoB.png'} alt="Logo" className="h-10 w-10 object-contain transform scale-110 md:scale-125" />
          </a>
          <nav className="space-x-6 hidden md:block">
            <a href="#about" className="text-slate-600 hover:text-slate-900">About</a>
            <a href="#experience" className="text-slate-600 hover:text-slate-900">Experience</a>
            <a href="#projects" className="text-slate-600 hover:text-slate-900">Projects</a>
            <a href="#contact" className="text-slate-600 hover:text-slate-900">Contact</a>
          </nav>
            <div className="ml-4">
            <ThemeToggle dark={dark} setDark={setDark} />
          </div>
        </div>
      </header>

      {/* Main area is viewport height and scroll-snaps to each section */}
      <main className="h-screen pt-20 overflow-y-auto scroll-smooth snap-y snap-mandatory">
        <section className="snap-start min-h-screen flex items-center">
          <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col items-center text-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold mt-2">
                Hi, I am <span className="text-sky-600">
                  <Typewriter words={["Shanuka Abeysinghe", "a Software Engineer", "a Full-Stack Developer"]} />
                </span>
              </h2>
              <p className="mt-4 text-lg text-slate-700 dark:text-slate-300">I'm a web developer from Sri Lanka with a passion for creating dynamic and responsive web applications with experience in Frontend and Backend development.</p>
              <div className="mt-6 flex items-center gap-4 justify-center">
                <a href="#about" className="px-4 py-2 bg-sky-600 text-white rounded shadow hover:bg-sky-700">Learn More</a>
                <a href="#contact" className="px-4 py-2 border border-slate-300 rounded hover:bg-slate-50">Contact me</a>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="snap-start min-h-screen flex items-center">
              <div className="max-w-5xl mx-auto px-6 py-12 w-full grid md:grid-cols-2 gap-6 items-center">
            <div className="flex justify-center md:justify-start">
              <img src="/src/assets/WhatsApp%20Image%202025-09-03%20at%2020.24.41.jpeg" alt="Your Photo" className="w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full shadow-lg object-cover md:-mr-4" loading="lazy" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold">About me</h3>
              <p className="mt-4 text-slate-700 dark:text-slate-300">Hi, I'm Shanuka Abeysinghe, a web developer from Sri Lanka, born in 2006. My education journey began at Sri Chandananda Buddhist College, Kandy. This diverse educational background has equipped me with a broad perspective and a passion for learning.
                <br></br><br></br>I am currently an undergraduate at ICBT Kandy Campus pursuing a Bsc(Hons) Software Engineering. My dedication to continuous learning enables me to stay update with new technologies and seeking ways to enhance my skills. Here are some technologies that I have worked with,</p>
              <div className="mt-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">Tools & technologies:</p>
                <div role="list" className="mt-2 flex flex-wrap gap-3">
                  <span role="listitem" className="px-3 py-1 text-sm font-medium rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 flex items-center">
                    <img src="/src/assets/html.png" alt="HTML" className="inline-block mr-2 h-5 w-5 flex-none object-contain" loading="lazy" />
                    HTML
                  </span>

                  <span role="listitem" className="px-3 py-1 text-sm font-medium rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 flex items-center">
                    <img src="/src/assets/css.png" alt="CSS" className="inline-block mr-2 h-5 w-5 flex-none object-contain" loading="lazy" />
                    CSS
                  </span>

                  <span role="listitem" className="px-3 py-1 text-sm font-medium rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 flex items-center">
                    <img src="/src/assets/java-script.png" alt="JavaScript" className="inline-block mr-2 h-5 w-5 flex-none object-contain" loading="lazy" />
                    JavaScript
                  </span>

                  <span role="listitem" className="px-3 py-1 text-sm font-medium rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 flex items-center">
                    <img src="/src/assets/java.png" alt="Java" className="inline-block mr-2 h-5 w-5 flex-none object-contain" loading="lazy" />
                    Java
                  </span>

                  <span role="listitem" className="px-3 py-1 text-sm font-medium rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 flex items-center">
                    <img src="/src/assets/c-sharp.png" alt="C#" className="inline-block mr-2 h-5 w-5 flex-none object-contain" loading="lazy" />
                    C#
                  </span>

                  <span role="listitem" className="px-3 py-1 text-sm font-medium rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 flex items-center">
                    <img src="/src/assets/sql-server.png" alt="SQL" className="inline-block mr-2 h-5 w-5 flex-none object-contain" loading="lazy" />
                    SQL
                  </span>

                  <span role="listitem" className="px-3 py-1 text-sm font-medium rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 flex items-center">
                    <img src="/src/assets/php.png" alt="PHP" className="inline-block mr-2 h-5 w-5 flex-none object-contain" loading="lazy" />
                    PHP
                  </span>

                  <span role="listitem" className="px-3 py-1 text-sm font-medium rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 flex items-center">
                    <img src="/src/assets/express.png" alt="Express" className="inline-block mr-2 h-5 w-5 flex-none object-contain" loading="lazy" />
                    Express js
                  </span>

                  <span role="listitem" className="px-3 py-1 text-sm font-medium rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 flex items-center">
                    <img src="/src/assets/react.png" alt="React" className="inline-block mr-2 h-5 w-5 flex-none object-contain" loading="lazy" />
                    React js
                  </span>

                  <span role="listitem" className="px-3 py-1 text-sm font-medium rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 flex items-center">
                    <img src="/src/assets/node.png" alt="Node" className="inline-block mr-2 h-5 w-5 flex-none object-contain" loading="lazy" />
                    Node js
                  </span>

                  <span role="listitem" className="px-3 py-1 text-sm font-medium rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 flex items-center">
                    <img src="/src/assets/mongo.png" alt="MongoDB" className="inline-block mr-2 h-5 w-5 flex-none object-contain" loading="lazy" />
                    MongoDB
                  </span>

                  <span role="listitem" className="px-3 py-1 text-sm font-medium rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 flex items-center">
                    <img src="/src/assets/firestore.png" alt="Firestore" className="inline-block mr-2 h-5 w-5 flex-none object-contain" loading="lazy" />
                    Firestore
                  </span>

                  <span role="listitem" className="px-3 py-1 text-sm font-medium rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 flex items-center">
                    <img src="/src/assets/vercel.png" alt="Vercel" className="inline-block mr-2 h-5 w-5 flex-none object-contain" loading="lazy" />
                    Vercel
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="snap-start min-h-screen flex items-center">
          <div className="max-w-5xl mx-auto px-6 py-12 w-full">
            <h3 className="text-2xl font-semibold">Experience</h3>
            <div className="mt-6 space-y-8">
              <div className="relative pl-8">
                <div className="absolute left-0 top-2 h-full w-0.5 bg-slate-200 dark:bg-slate-700" />
                <div className="mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-none w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center">A</div>
                    <div>
                      <h4 className="font-semibold">Frontend Engineer — Acme Co</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-300">Jan 2023 — Present</p>
                    </div>
                  </div>
                  <p className="mt-3 text-slate-700 dark:text-slate-300">Built user-facing features with React and Tailwind, improved site performance, and led accessibility audits.</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-none w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center">B</div>
                    <div>
                      <h4 className="font-semibold">Software Developer — Beta Labs</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-300">Jun 2020 — Dec 2022</p>
                    </div>
                  </div>
                  <p className="mt-3 text-slate-700 dark:text-slate-300">Worked on full-stack features, API integrations, and devops automation for CI/CD pipelines.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="snap-start min-h-screen flex items-center">
          <div className="max-w-5xl mx-auto px-6 py-12 w-full">
            <h3 className="text-2xl font-semibold">Featured projects</h3>
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <article className="p-6 bg-white rounded-lg shadow dark:bg-slate-900/60">
                <h4 className="font-semibold">Project One</h4>
                <p className="mt-2 text-slate-600 dark:text-slate-300">A short description of the project. Tech: React, Tailwind.</p>
              </article>
              <article className="p-6 bg-white rounded-lg shadow dark:bg-slate-900/60">
                <h4 className="font-semibold">Project Two</h4>
                <p className="mt-2 text-slate-600 dark:text-slate-300">A short description of the project. Tech: Node, Express, MongoDB.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="contact" className="snap-start min-h-screen flex items-center">
          <div className="max-w-3xl mx-auto px-6 py-12 w-full">
            <div className="bg-white/90 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold">Contact</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300">Have a project or just want to say hi? Fill the form and I'll get back to you.</p>

              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-4 left-0 right-0 text-center text-sm text-slate-500">Made with ❤️ by Shanuka Abeysinghe</footer>
    </div>
  )
}
