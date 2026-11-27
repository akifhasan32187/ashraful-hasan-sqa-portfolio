const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
const root = document.documentElement
const particleField = document.querySelector(".particle-field")

if (particleField) {
  const celestialScene = document.createElement("div")
  celestialScene.className = "celestial-scene"
  celestialScene.setAttribute("aria-hidden", "true")
  celestialScene.innerHTML = `
    <div class="planet-system">
      <div class="planet-ring"></div>
      <div class="planet-body"><span class="planet-markings"></span></div>
      <div class="satellite-path">
        <svg class="satellite" viewBox="0 0 28 20" aria-hidden="true">
          <path class="satellite-panel" d="M1 5h8v10H1zM19 5h8v10h-8z"/>
          <path class="satellite-frame" d="M10 7h8v7h-8zM13 3h2v15h-2zM9 10h10"/>
        </svg>
      </div>
    </div>
    <svg class="space-station" viewBox="0 0 106 42" aria-hidden="true">
      <path class="station-panel" d="M1 8h28v26H1zM77 8h28v26H77z"/>
      <path class="station-panel-grid" d="M8 8v26m7-26v26m7-26v26M84 8v26m7-26v26m7-26v26"/>
      <path class="station-frame" d="M29 15h13l5-6h12l5 6h13v13H64l-5 6H47l-5-6H29zm13 0 5 13m17-13-5 13M53 9v26M42 21h22"/>
      <circle class="station-frame" cx="53" cy="21" r="4"/>
    </svg>
  `
  particleField.appendChild(celestialScene)

  const particles = document.createDocumentFragment()

  for (let index = 0; index < 72; index += 1) {
    const particle = document.createElement("span")
    const drift = ((index * 17) % 48) - 24
    const isStar = index % 3 !== 0

    particle.className = `ambient-particle ${isStar ? "is-star" : "is-dot"}`
    particle.style.setProperty("--particle-x", `${(index * 37 + 13) % 96}%`)
    particle.style.setProperty("--particle-y", `${(index * 29 + 7) % 88}%`)
    particle.style.setProperty("--particle-duration", `${isStar ? 3 + (index % 3) : 12 + (index * 2) % 9}s`)
    particle.style.setProperty("--particle-delay", `${-((index * 3) % 37)}s`)
    particle.style.setProperty("--particle-drift", `${drift}px`)
    particle.style.setProperty("--particle-drift-reverse", `${-drift / 2}px`)
    particle.style.setProperty("--particle-rise", `${-24 - (index % 4) * 10}px`)
    particle.style.setProperty("--particle-size", `${10 + index % 5}px`)
    particles.appendChild(particle)
  }

  particleField.appendChild(particles)

  if (!reducedMotion) {
    const scheduleMeteor = (delay) => {
      window.setTimeout(() => {
        if (document.visibilityState === "visible") {
          const meteor = document.createElement("span")
          meteor.className = "meteor"
          meteor.style.setProperty("--meteor-x", `${Math.random() * 65}%`)
          meteor.style.setProperty("--meteor-y", `${Math.random() * 24}%`)
          meteor.style.setProperty("--meteor-angle", `${30 + Math.random() * 25}deg`)
          meteor.style.setProperty("--meteor-travel-x", `${28 + Math.random() * 30}vw`)
          meteor.style.setProperty("--meteor-travel-y", `${22 + Math.random() * 26}vh`)
          particleField.appendChild(meteor)
          meteor.addEventListener("animationend", () => meteor.remove(), { once: true })
        }

        scheduleMeteor(8000 + Math.random() * 9000)
      }, delay)
    }

    scheduleMeteor(2500 + Math.random() * 2500)
  }
}

const themeToggle = document.querySelector(".theme-toggle")
const themeColor = document.querySelector('meta[name="theme-color"]')
const themeIcon = themeToggle && themeToggle.querySelector("i")

function applyTheme(theme, persist = false) {
  const isLight = theme === "light"
  root.dataset.theme = isLight ? "light" : "dark"

  if (themeToggle) {
    themeToggle.setAttribute("aria-label", `Switch to ${isLight ? "dark" : "light"} mode`)
    themeToggle.setAttribute("aria-pressed", String(isLight))
    const label = themeToggle.querySelector("span")
    if (label) label.textContent = isLight ? "Dark mode" : "Light mode"
  }

  if (themeIcon) {
    themeIcon.className = `fa-solid ${isLight ? "fa-moon" : "fa-sun"}`
  }

  if (themeColor) {
    themeColor.setAttribute("content", isLight ? "#F1F4FA" : "#030407")
  }

  if (persist) {
    try {
      localStorage.setItem("portfolio-theme", isLight ? "light" : "dark")
    } catch (error) {
      console.warn("Could not save the color theme preference.", error)
    }
  }
}

if (themeToggle) {
  let savedTheme = "dark"
  try {
    savedTheme = localStorage.getItem("portfolio-theme") || "dark"
  } catch (error) {
    console.warn("Could not load the saved color theme preference.", error)
  }
  applyTheme(savedTheme)
  themeToggle.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true)
  })
}

const typingText = document.querySelector(".typing-text")
const roles = ["Quality assurance", "Thoughtful testing", "Reliable releases"]

if (typingText && !reducedMotion) {
  let roleIndex = 0
  let characterIndex = roles[0].length
  let deleting = false

  const typeNext = () => {
    const role = roles[roleIndex]
    typingText.textContent = role.slice(0, characterIndex)

    if (!deleting && characterIndex === role.length) {
      deleting = true
      window.setTimeout(typeNext, 1500)
      return
    }

    if (deleting && characterIndex === 0) {
      deleting = false
      roleIndex = (roleIndex + 1) % roles.length
    }

    characterIndex += deleting ? -1 : 1
    window.setTimeout(typeNext, deleting ? 38 : 65)
  }

  window.setTimeout(() => {
    deleting = true
    typeNext()
  }, 1800)
}

const menuToggle = document.querySelector(".menu-toggle")
const navLinks = document.querySelector(".nav-links")

function closeMenu() {
  if (!menuToggle || !navLinks) return
  menuToggle.setAttribute("aria-expanded", "false")
  menuToggle.setAttribute("aria-label", "Open navigation")
  navLinks.classList.remove("is-open")
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true"
    menuToggle.setAttribute("aria-expanded", String(!isOpen))
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation")
    navLinks.classList.toggle("is-open", !isOpen)
  })

  navLinks.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", closeMenu)
  })

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu()
  })

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) closeMenu()
  })
}

const revealElements = document.querySelectorAll(".reveal")

if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible")
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" })

  revealElements.forEach((element) => revealObserver.observe(element))
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"))
}

const progressBar = document.querySelector(".scroll-progress")
const scrollToTopButton = document.querySelector(".floating-action-top")
const scrollWater = document.querySelector(".water")
const heroPortrait = document.querySelector(".portrait-frame img")
const floatingActions = document.querySelector(".floating-actions")
let scrollUpdatePending = false

function updateScrollProgress() {
  if (!progressBar || scrollUpdatePending) return
  scrollUpdatePending = true
  window.requestAnimationFrame(() => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0
    const progressValue = Math.max(0, Math.min(progress, 100))
    progressBar.style.width = `${progressValue}%`
    if (scrollWater) scrollWater.style.setProperty("--scroll-progress", `${progressValue}%`)
    if (scrollToTopButton) {
      const progressLabel = `Page progress: ${Math.round(progressValue)}%`
      scrollToTopButton.setAttribute("aria-label", `Back to top — ${progressLabel}`)
      scrollToTopButton.setAttribute("data-label", progressLabel)
    }
    if (floatingActions) {
      floatingActions.classList.toggle("is-visible", window.scrollY > 50)
    }
    if (heroPortrait && !reducedMotion) {
      heroPortrait.style.translate = `0 ${-Math.min(window.scrollY * 0.035, 18)}px`
    }
    scrollUpdatePending = false
  })
}

window.addEventListener("scroll", updateScrollProgress, { passive: true })
window.addEventListener("resize", updateScrollProgress)
updateScrollProgress()

const contactForm = document.querySelector("#contact-form")
const statusMessage = document.querySelector("#status-message")

if (contactForm && statusMessage) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault()
    const submitButton = contactForm.querySelector('button[type="submit"]')
    submitButton.disabled = true
    statusMessage.textContent = "Sending your message…"

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      })

      if (!response.ok) {
        const result = await response.json().catch(() => null)
        const errors = result && Array.isArray(result.errors)
          ? result.errors.map((error) => error.message).join(", ")
          : ""
        throw new Error(errors || "Your message could not be sent. Please try again.")
      }

      statusMessage.textContent = "Thanks for your message — I’ll be in touch."
      contactForm.reset()
    } catch (error) {
      statusMessage.textContent = error instanceof Error
        ? error.message
        : "Your message could not be sent. Please try again."
    } finally {
      submitButton.disabled = false
    }
  })
}

const sectionObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      document.querySelectorAll(".nav-links a").forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${entry.target.id}`
        link.classList.toggle("active", isCurrent)
        if (isCurrent) link.setAttribute("aria-current", "location")
        else link.removeAttribute("aria-current")
      })
    })
  }, { rootMargin: "-30% 0px -60% 0px" })
  : null

if (sectionObserver) {
  document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section))
}

document.querySelectorAll(".project-grid, .certification-grid").forEach((grid) => {
  const track = grid.querySelector(".project-track, .certification-track")
  if (!track) return

  grid.addEventListener("pointerenter", () => track.classList.add("is-paused"))
  grid.addEventListener("pointerleave", () => track.classList.remove("is-paused"))
  grid.addEventListener("focusin", () => track.classList.add("is-paused"))
  grid.addEventListener("focusout", (event) => {
    if (!grid.contains(event.relatedTarget)) track.classList.remove("is-paused")
  })
})

document.querySelectorAll(
  '.project-group[aria-hidden="true"] a, .certification-group[aria-hidden="true"] a'
).forEach((link) => { link.tabIndex = -1 })

const siteFooter = document.querySelector(".site-footer")

if (siteFooter && floatingActions && "IntersectionObserver" in window) {
  const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      floatingActions.classList.toggle("is-footer-visible", entry.isIntersecting)
    })
  }, { threshold: 0.1 })

  footerObserver.observe(siteFooter)
}
/* ===================== Additions ===================== */
/* Boot screen (once per session) */
try {
  if (!reducedMotion && !sessionStorage.getItem("booted")) {
    sessionStorage.setItem("booted", "1")
    const boot = document.createElement("div")
    boot.className = "boot"
    boot.setAttribute("aria-hidden", "true")
    boot.innerHTML = `<span>> initializing test environment…</span><span>> loading requirements… <b>OK</b></span><span>> running smoke checks… <b>PASS</b></span><div class="bar"><i></i></div>`
    document.body.appendChild(boot)
    window.setTimeout(() => { boot.classList.add("out"); window.setTimeout(() => boot.remove(), 600) }, 1400)
  }
} catch (e) { /* ignore */ }

/* Theme change as a circular wave from the toggle */
if (themeToggle && document.startViewTransition && !reducedMotion) {
  themeToggle.addEventListener("click", (event) => {
    event.stopImmediatePropagation()
    const r = themeToggle.getBoundingClientRect()
    const x = r.left + r.width / 2, y = r.top + r.height / 2
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const next = root.dataset.theme === "dark" ? "light" : "dark"
    document.startViewTransition(() => applyTheme(next, true)).ready.then(() => {
      root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "ease-in", pseudoElement: "::view-transition-new(root)" })
    }).catch(() => {})
  }, true)
}

/* Cursor radar */
if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
  const radar = document.createElement("div")
  radar.className = "radar"
  radar.setAttribute("aria-hidden", "true")
  document.body.appendChild(radar)
  let tx = 0, ty = 0, cx = 0, cy = 0
  window.addEventListener("pointermove", (e) => {
    tx = e.clientX; ty = e.clientY
    radar.classList.add("show")
    radar.classList.toggle("hot", !!e.target.closest("a, button, .tech-pill, .cn"))
  }, { passive: true })
  document.addEventListener("pointerleave", () => radar.classList.remove("show"))
  const follow = () => { cx += (tx - cx) * .2; cy += (ty - cy) * .2; radar.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(follow) }
  follow()
}

/* Skills constellation */
const constellation = document.getElementById("constellation")
if (constellation) {
  const NS = "http://www.w3.org/2000/svg"
  const groups = [
    { name: "QUALITY", x: 250, y: 130, skills: ["Manual testing", "Functional", "Regression", "Exploratory", "API testing", "Selenium WebDriver"] },
    { name: "TRACKING", x: 155, y: 360, skills: ["Jira", "ClickUp", "Ezzyplan"] },
    { name: "DEVELOPMENT", x: 650, y: 130, skills: ["Python", "Java", "C++", "C", "HTML", "CSS", "JavaScript", "jQuery", "Flask"] },
    { name: "DATA & TOOLS", x: 640, y: 360, skills: ["Git", "Scikit-Learn", "NumPy", "Pandas", "TensorFlow", "PyTorch", "Keras", "NLP", "LaTeX", "Microsoft Office"] },
  ]
  const cross = [["Selenium WebDriver", "Python"], ["Flask", "Python"], ["Pandas", "NumPy"], ["Keras", "TensorFlow"], ["NLP", "PyTorch"], ["Scikit-Learn", "NumPy"]]
  const pos = {}, lines = [], nodes = []
  const el = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v)); parent.appendChild(n); return n }
  const lineLayer = el("g", {}, constellation)
  const signalLayer = el("g", { "aria-hidden": "true" }, constellation)
  const nodeLayer = el("g", {}, constellation)
  groups.forEach((g) => {
    pos[g.name] = { x: g.x, y: g.y }
    g.skills.forEach((s, i) => {
      const a = (i / g.skills.length) * Math.PI * 2 - Math.PI / 2, rad = g.skills.length > 6 ? 118 : 96
      pos[s] = { x: g.x + Math.cos(a) * rad * 1.25, y: g.y + Math.sin(a) * rad * .8 }
    })
  })
  const link = (a, b, extra) => {
    const l = el("line", { class: `cl ${extra || ""}`, x1: pos[a].x, y1: pos[a].y, x2: pos[b].x, y2: pos[b].y }, lineLayer)
    lines.push({ a, b, l })
  }
  groups.forEach((g) => g.skills.forEach((s) => link(g.name, s)))
  cross.forEach(([a, b]) => link(a, b, "cx"))
  const signalRoutes = [
    ["QUALITY", "Manual testing"], ["QUALITY", "API testing"],
    ["TRACKING", "Ezzyplan"], ["DEVELOPMENT", "Python"],
    ["DEVELOPMENT", "JavaScript"], ["DATA & TOOLS", "TensorFlow"],
    ["DATA & TOOLS", "Pandas"], ["Selenium WebDriver", "Python"]
  ]
  signalRoutes.forEach(([fromName, toName], i) => {
    const from = pos[fromName]
    const to = pos[toName]
    const duration = `${3.2 + i * .35}s`
    const signal = el("circle", {
      class: `signal ${i % 3 === 0 ? "signal-lime" : ""}`,
      r: 2.5
    }, signalLayer)
    el("animateMotion", {
      dur: duration,
      begin: `${i * .4}s`,
      repeatCount: "indefinite",
      path: `M ${from.x} ${from.y} L ${to.x} ${to.y}`
    }, signal)
    el("animate", {
      attributeName: "opacity",
      values: "0;1;1;0",
      keyTimes: "0;.12;.82;1",
      dur: duration,
      begin: `${i * .4}s`,
      repeatCount: "indefinite"
    }, signal)
  })
  const addNode = (name, hub, delay) => {
    const n = el("g", { class: `cn ${hub ? "hub" : ""}`, tabindex: "0", style: `animation-delay:${delay}s` }, nodeLayer)
    if (hub) el("circle", { class: "hub-halo", cx: pos[name].x, cy: pos[name].y, r: 15 }, n)
    el("circle", { cx: pos[name].x, cy: pos[name].y, r: hub ? 9 : 5 }, n)
    const t = el("text", { x: pos[name].x, y: pos[name].y - (hub ? 16 : 11), "text-anchor": "middle" }, n)
    t.textContent = name
    nodes.push({ name, n })
    const focus = (on) => {
      constellation.classList.toggle("has-focus", on)
      nodes.forEach((o) => o.n.classList.remove("on"))
      lines.forEach((o) => o.l.classList.remove("on"))
      if (!on) return
      n.classList.add("on")
      lines.forEach((o) => {
        if (o.a !== name && o.b !== name) return
        o.l.classList.add("on")
        nodes.forEach((p) => { if (p.name === o.a || p.name === o.b) p.n.classList.add("on") })
      })
    }
    n.addEventListener("pointerenter", () => focus(true))
    n.addEventListener("pointerleave", () => focus(false))
    n.addEventListener("focus", () => focus(true))
    n.addEventListener("blur", () => focus(false))
    n.addEventListener("click", () => focus(true))
  }
  groups.forEach((g, i) => { addNode(g.name, true, i * .4); g.skills.forEach((s, j) => addNode(s, false, (i + j) * .3)) })
}

/* Quality lab: bug lifecycle, test console, readiness gauge, counters */
const labConsole = document.getElementById("console")
if (labConsole) {
  const stages = [...document.querySelectorAll("#lifecycle li")]
  const bugStatus = document.getElementById("bug-status")
  const gaugeFill = document.getElementById("gauge-fill")
  const gaugePct = document.getElementById("gauge-pct")
  const gaugeLabel = document.getElementById("gauge-label")
  const replay = document.querySelector(".lab-replay")
  const tests = ["Login with valid credentials", "Reject invalid email format", "Block empty required fields", "Reject negative quantity", "Regression: previous release flows"]
  let token = 0

  const setGauge = (pct, ready) => {
    gaugeFill.style.strokeDashoffset = String(276.5 * (1 - pct / 100))
    gaugePct.textContent = `${Math.round(pct)}%`
    gaugeLabel.textContent = ready ? "READY TO SHIP" : "RELEASE READINESS"
    if (replay) {
      const complete = pct >= 100
      replay.textContent = complete
        ? "Complete"
        : pct > 0
          ? "Test in Progress"
          : "Start"
      replay.classList.toggle("is-start", pct === 0)
      replay.classList.toggle("is-active", pct > 0 && !complete)
      replay.classList.toggle("is-complete", complete)
    }
  }
  const addLine = (text, cls) => {
    const s = document.createElement("span")
    s.className = `ln ${cls || ""}`
    s.textContent = text
    labConsole.appendChild(s)
  }
  const runTests = () => {
    const mine = ++token
    labConsole.innerHTML = ""
    setGauge(0, false)
    if (reducedMotion) {
      tests.forEach((t) => addLine(`✔ PASS  ${t}`, "ok"))
      addLine("RELEASE READY — ALL CHECKS PASSED", "ok")
      setGauge(100, true)
      return
    }
    let i = 0
    const step = () => {
      if (mine !== token) return
      if (i < tests.length) {
        addLine(`▶ ${tests[i]}…`, "run")
        window.setTimeout(() => {
          if (mine !== token) return
          addLine(`✔ PASS  ${tests[i]}`, "ok")
          i += 1
          setGauge((i / tests.length) * 100, false)
          window.setTimeout(step, 350)
        }, 650)
      } else {
        addLine("RELEASE READY — ALL CHECKS PASSED", "ok")
        setGauge(100, true)
        window.setTimeout(() => {
          if (mine === token) runTests()
        }, 2400)
      }
    }
    step()
  }
  const statusNames = ["NEW", "ASSIGNED", "FIXED", "RETESTED", "CLOSED"]
  let stage = reducedMotion ? 4 : 0
  const paintStage = () => {
    stages.forEach((li, idx) => { li.classList.toggle("done", idx < stage); li.classList.toggle("now", idx === stage) })
    if (bugStatus) bugStatus.textContent = statusNames[stage]
  }
  paintStage()
  if (!reducedMotion) window.setInterval(() => { stage = (stage + 1) % stages.length; paintStage() }, 1600)

  let started = false
  const startObs = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting && !started) { started = true; runTests(); startObs.disconnect() }
  }), { threshold: 0.35 })
  startObs.observe(labConsole)
  if (replay) replay.addEventListener("click", runTests)

  const counters = document.querySelectorAll("[data-count]")
  const countObs = new IntersectionObserver((entries, o) => entries.forEach((en) => {
    if (!en.isIntersecting) return
    o.unobserve(en.target)
    const end = Number(en.target.dataset.count)
    if (reducedMotion) { en.target.textContent = end; return }
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min((now - t0) / 1200, 1)
      en.target.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }), { threshold: 0.6 })
  counters.forEach((c) => countObs.observe(c))
}

/* Contact form success check */
if (statusMessage) {
  new MutationObserver(() => statusMessage.classList.toggle("sent", statusMessage.textContent.startsWith("Thanks")))
    .observe(statusMessage, { childList: true, characterData: true, subtree: true })
}

/* Easter egg */
const eggBug = document.querySelector(".egg-bug")
if (eggBug) {
  const toast = document.createElement("div")
  toast.className = "egg-toast"
  toast.setAttribute("role", "status")
  document.body.appendChild(toast)
  const msgs = ["🐞 Bug found! Severity: cosmetic. Status: reported ✔", "🐞 Reproduced. Fixed. Retested. Closed. You’d make a good tester.", "🐞 No bugs here — I tested it twice."]
  let n = 0
  eggBug.addEventListener("click", () => {
    toast.textContent = msgs[n++ % msgs.length]
    toast.classList.add("show")
    window.setTimeout(() => toast.classList.remove("show"), 2800)
  })
}