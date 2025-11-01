# Frisspits Cleaning Services - Codebase Architecture

## Project Overview

Frisspits is a professional cleaning services company website built with Next.js 15.3.5, React 18.3.1, and TypeScript. B2C marketing website for Netherlands-based cleaning services company (Amersfoort). Enables customers to learn about services and submit inquiries.

**Tech Stack:**
- Next.js 15.3.5 with Turbopack
- React 18.3.1
- TypeScript 5.8.3
- Tailwind CSS 3.4.1
- Framer Motion (animations)
- EmailJS (client-side email)
- Lucide React (icons)

---

## 1. Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── bedrijf/           # Company info pages
│   ├── diensten/          # Services: catalog + 6 detail pages
│   ├── fonts.ts           # Go3 font configuration
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Tailwind
└── components/            # 11 reusable React components
```

### Key Routes

**Main Routes:**
- `/` - Homepage
- `/diensten` - Services catalog
- `/diensten/[service]` - Service pages (6 total)

**Services (6):**
1. huishoudelijk-schoonmaak (Household cleaning)
2. glazenwasser (Window cleaning)
3. dakgoten-reinigen (Gutter cleaning)
4. zonnepanelen-reinigen (Solar panels)
5. kantoor-schoonmaak (Office cleaning)
6. vve-schoonmaken (HOA cleaning)

**Company Pages:**
- /bedrijf/over-ons, /carriere, /privacy, /servicevoorwaarden, /cookie-beleid

**Admin Routes:**
- `/admin/logs` - Protected visitor tracking dashboard (password: see `.env`)
- `/privacybeleid` - GDPR-compliant privacy policy

---

## 2. Application Type

**B2C Service Marketing Website** - Lead generation through contact forms with visitor tracking analytics.

**API Routes:**
- `/api/track-visitor` - Captures visitor IP, location, and page views (GDPR-compliant with consent)

**Email Integration:**
- EmailJS (client-side) for form submissions

---

## 3. Architectural Patterns

### A. Two Form Patterns

**Pattern 1: GenericServiceForm.tsx** - Reusable for most services
- Props: serviceName, frequencyOptions, quantityLabel
- Fields: Frequency, Email, Quantity, Phone, Additional Info
- EmailJS.send() to NEXT_PUBLIC_EMAILJS_SECOND_TEMPLATE_ID

**Pattern 2: ContactForm.tsx** - Homepage main form
- Fields: Title, Description, Location, Date, ServiceType, Phone, Email
- EmailJS.sendForm() to NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
- Special: #NieuwKlant hash tracking for offers

### B. Service Page Architecture

Each service page:
1. Back button
2. Gradient background (service-specific)
3. Service form
4. ServiceDetails accordion
5. CTA section

### C. Email Integration

**EmailJS Client-Side:**
- Initialized in form components
- Two email templates
- Environment variables:
  - NEXT_PUBLIC_EMAILJS_USER_ID
  - NEXT_PUBLIC_EMAILJS_SERVICE_ID
  - NEXT_PUBLIC_EMAILJS_TEMPLATE_ID (main)
  - NEXT_PUBLIC_EMAILJS_SECOND_TEMPLATE_ID (services)

### D. State Management

**Local component state** - React hooks only
- No global state management
- useState for form fields and UI state
- localStorage for popup tracking (1-hour cooldown)

### E. Animation & UI

**Framer Motion:**
- Entrance animations (fade, slide, scale)
- Button hover effects
- Accordion transitions
- Popup modals
- Icon rotations

**Styling:**
- Tailwind CSS (primary)
- CSS Modules (Header.module.css)
- Service-specific gradients
- Inline JSX for animations

---

## 4. Email & Communication

### EmailJS Integration

**Two Templates:**
1. Homepage form: General inquiries
2. Service forms: Service-specific inquiries

### Form Validation

**ContactForm:** HTML5 validation (required, type="email", type="tel")
**GenericServiceForm:** Manual validation checking empty fields

### Nodemailer

Installed but unused - available for future backend integration.

---

## 5. Unique Patterns

### A. Popup Offer System
- Triggered 20 seconds after load
- "20% OFF first cleaning" offer
- localStorage cooldown: 1 hour
- Clicking offer pre-fills form with #NieuwKlant
- Auto-scrolls to contact form

### B. Hide-on-Scroll Navigation
- Fixed header hides when scrolling down
- Reappears scrolling up or near top
- 0.3s smooth animation

### C. Service-Specific Quantity Labels
- GenericServiceForm handles all via quantityLabel prop
- Glazenwasser: "Aantal ramen"
- Zonnepanelen: "Aantal zonnepanelen"
- Huishoudelijk: "Oppervlakte in m²"

### D. URL Hash Tracking (#NieuwKlant)
- ContactForm detects hash
- Pre-fills title with #NieuwKlant
- Bridges popup to form tracking

### E. Visitor Tracking System (GDPR-Compliant)

**Overview:**
- Tracks visitor location and page views on all diensten pages
- Requires user consent via cookie banner
- Stores data in file-based JSON storage (`/data/visitor-logs.json`)
- Protected admin dashboard at `/admin/logs`

**Implementation:**
1. `useVisitorTracking(pageName)` hook on all diensten pages
2. Captures: IP address, geolocation (via ip-api.com), browser info, timestamp
3. Cookie consent banner (`CookieConsent.tsx`) - appears after 2 seconds
4. Only tracks after user accepts cookies
5. Admin dashboard with authentication (password in `.env`)

**Files:**
- `src/hooks/useVisitorTracking.ts` - Tracking hook
- `src/components/CookieConsent.tsx` - Cookie banner
- `src/app/api/track-visitor/route.ts` - API endpoint
- `src/app/admin/logs/page.tsx` - Admin dashboard
- `src/app/privacybeleid/page.tsx` - Privacy policy (Dutch)
- `/data/visitor-logs.json` - Storage (git-ignored)

**Admin Dashboard Features:**
- Login with password (`ADMIN_PASSWORD` env var)
- Statistics cards (total visitors, top page, top country)
- Search/filter logs
- View visitor details (location, IP, browser, timestamp)

**Privacy Compliance:**
- Cookie consent required before tracking
- Comprehensive privacy policy in Dutch
- User rights under GDPR explained
- Data retention policy: 1 year for logs
- IP anonymization after 12 months

**Security:**
- Password-protected admin access
- Session-based authentication
- Rate limiting via ip-api.com (45/min free tier)
- Git-ignored data folder and .env file
- Maximum 1000 logs stored (auto-cleanup)

**See:** `VISITOR_TRACKING_README.md` for full documentation

---

## 6. Service Pages Configuration

| Service | Quantity Label | Frequency | Gradient |
|---------|---|---|---|
| Huishoudelijk | Oppervlakte m² | On request | Blue-Green |
| Glazenwasser | Aantal ramen | 4 options | Sky-Indigo |
| Dakgoten | - | - | Black-Blue |
| Zonnepanelen | Aantal panelen | 3 options | Yellow-Blue |
| Kantoor | - | - | Black-Blue |
| VVE | - | - | Black-Blue |

---

## 7. Key Dependencies

### Critical
- next (15.3.5)
- react (18.3.1)
- @emailjs/browser (4.4.1)
- framer-motion (12.23.0)
- lucide-react (0.441.0)
- tailwindcss (3.4.1)

### Unused
- nodemailer (6.9.15)
- chart.js / react-chartjs-2
- @splinetool/react-spline

---

## 8. Development

### Scripts
- `npm run dev` - Next.js with Turbopack
- `npm run build` - Production build
- `npm run start` - Production start
- `npm run lint` - ESLint

### Environment Variables
Required in `.env`:
```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
NEXT_PUBLIC_EMAILJS_USER_ID=...
ADMIN_PASSWORD=changeme123  # Change this!
```

**IMPORTANT:** Never commit `.env` to git. Change `ADMIN_PASSWORD` before deployment.

### Import Pattern
All absolute imports via @: `import Header from "@/components/Header"`

### Form State Pattern
```typescript
const [fieldName, setFieldName] = useState<string>('')
const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
const [errorMessage, setErrorMessage] = useState<string>('')
```

---

## Summary

**Frisspits** is a clean, modern B2C marketing website for cleaning services. Key architectural highlights:

1. **Flexible Form Component** - GenericServiceForm eliminates service-specific code through configuration props
2. **Client-Side Email** - Pure EmailJS integration, no backend API routes
3. **Service Differentiation** - 6 specialized landing pages with unique colors and details
4. **Modern UX** - Framer Motion animations, smooth interactions, responsive design
5. **Smart Navigation** - Hide-on-scroll header
6. **Lead Tracking** - localStorage + URL hash for campaigns

Main innovation: Reusable GenericServiceForm component handles form submission for 5+ different service types through configuration props, reducing code duplication while allowing service-specific customization.

