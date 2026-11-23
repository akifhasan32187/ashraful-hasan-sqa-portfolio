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

const siteFooter = document.querySelector(".site-footer")

if (siteFooter && floatingActions && "IntersectionObserver" in window) {
  const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      floatingActions.classList.toggle("is-footer-visible", entry.isIntersecting)
    })
  }, { threshold: 0.1 })

  footerObserver.observe(siteFooter)
}
