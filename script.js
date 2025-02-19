// Typing Animation
const texts = [
  "Software Quality Assurance Engineer",
  "Automation Enthusiast",
  "Agile Mindset",
  "Team Player",
  "Fast Learner and Explorer",
]

let currentTextIndex = 0
const typingText = document.querySelector(".typing-text")

function typeText() {
  const currentText = texts[currentTextIndex]
  let charIndex = 0

  function type() {
    if (charIndex < currentText.length) {
      typingText.textContent += currentText.charAt(charIndex)
      charIndex++
      setTimeout(type, 50)
    } else {
      setTimeout(erase, 2000)
    }
  }

  function erase() {
    if (typingText.textContent.length > 0) {
      typingText.textContent = typingText.textContent.slice(0, -1)
      setTimeout(erase, 30)
    } else {
      currentTextIndex = (currentTextIndex + 1) % texts.length
      setTimeout(typeText, 500)
    }
  }

  type()
}

// Start typing animation
typeText()

// Theme Toggle
const themeToggle = document.querySelector(".theme-toggle")
const html = document.documentElement
const themeIcon = themeToggle.querySelector("i")

// Check for saved theme preference
const savedTheme = localStorage.getItem("theme") || "light"
html.setAttribute("data-theme", savedTheme)
updateThemeIcon(savedTheme)

themeToggle.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-theme")
  const newTheme = currentTheme === "light" ? "dark" : "light"

  html.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
  updateThemeIcon(newTheme)
})

function updateThemeIcon(theme) {
  themeIcon.className = theme === "light" ? "fas fa-moon" : "fas fa-sun"
}

// Smooth Scrolling
const navbar = document.querySelector(".navbar")
const navbarHeight = navbar.offsetHeight

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const targetPosition = target.offsetTop - navbarHeight
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  })
})

// Active Navigation Highlight
const sections = document.querySelectorAll("section")
const navLinks = document.querySelectorAll(".nav-links a")

function highlightNavigation() {
  const scrollPosition = window.scrollY + navbarHeight + 100

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionBottom = sectionTop + section.offsetHeight

    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      const currentId = section.getAttribute("id")
      navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${currentId}`) {
          link.classList.add("active")
        }
      })
    }
  })
}

window.addEventListener("scroll", highlightNavigation)
window.addEventListener("load", highlightNavigation)

