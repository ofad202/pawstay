# PawStay Pet Sitting — Landing Page

A single-page responsive landing site for a fictional pet-sitting service in Metro Manila, built as a college web development project.

## Live Demo
Open `index.html` directly in any modern browser — no build step or server required.

## Features
- **Responsive layout** with three breakpoints (1100px, 768px, 480px)
- **CSS Grid + Flexbox** used throughout for layout
- **CSS custom properties** for a consistent design system
- **Vanilla JavaScript interactivity**:
  - Sticky header with scroll-triggered state
  - Mobile hamburger menu
  - Smooth-scroll anchor navigation
  - Active nav-link highlighting on scroll (requestAnimationFrame throttled)
  - Reveal-on-scroll animations via `IntersectionObserver`
  - Accessible FAQ accordion (`aria-expanded` / `aria-controls`)
  - Auto-generated booking-date dropdown (3–90 days from today)
  - Team carousel with scroll-snap and disabled arrow states
  - Client-side form validation with inline per-field error messages
  - AJAX form submission with loading state and success/error feedback
- **Semantic HTML5** — `header`, `nav`, `section`, `footer`
- **Accessibility** — `aria-label`, `aria-expanded`, `aria-controls`, `role`, `hidden`, `prefers-reduced-motion` support
- **Modern image practices** — `loading="lazy"`, explicit `width`/`height`, descriptive `alt` text

## Technologies
- HTML5
- CSS3 (Grid, Flexbox, custom properties, media queries, `prefers-reduced-motion`)
- Vanilla JavaScript (ES6+, `fetch`, `IntersectionObserver`, `FormData`)
- Google Fonts — Fredoka, Nunito, Caveat
- Font Awesome 6 (CDN)
- Formspree (demo form endpoint)

## File Structure