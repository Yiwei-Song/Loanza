# Circle Breaker — Frontend Prototype Brief & Requirements

**For:** an external design-engineering agent building a fresh, frontend-only UI prototype.
**Status:** standalone document. You do not have, and do not need, access to any existing
codebase. Everything required is in this file.

---

## 0. Read this first — the mandate

Build a **world-class, impressive, frontend-only UI prototype** for a product called
**Circle Breaker**. This is a from-scratch design and build. You are the author of the
entire visual language, layout system, component design, motion, and brand expression.

Three hard rules:

1. **Frontend only. No backend, no network, no real data.** No database, no authentication
   service, no third-party APIs, no server calls. Everything runs from local mock/static data
   and in-memory state. "Logging in," "saving," "filtering," "matching" all happen client-side
   against fixture data. The prototype must run with nothing but the frontend.
2. **This document gives you *what the product does*, never *how it should look or be
   structured*.** There are deliberately no layout diagrams, no component trees, no color or
   type direction, no screen mockups. Those choices are yours. Design it the way a top product
   studio would, from zero.
3. **Hold a trillion-dollar bar.** "Prototype" describes the data layer, never the craft. Every
   screen ships at production visual quality: intentional typography, spacing, hierarchy, color,
   motion, and state design. Empty / loading / error / edge states are designed deliberately,
   not skipped. The goal is a prototype that looks and feels like a flagship product.

Tech stack is your choice (any modern framework). Optimize for a beautiful, smooth, responsive,
accessible result.

---

## 1. The product

**Circle Breaker** (Chinese name **破圈俱乐部**, wordmark sometimes styled **Circlebreaker**) is a
**curated, searchable database of global opportunities** for ambitious people who want to break
out of the limits of where they started.

The opportunities are real-world programs: **fellowships, scholarships, research positions,
exchanges, conferences/summits, internships, professional roles, courses, summer/winter schools,
entrepreneurship programs, volunteering**, and similar. For each one, the product doesn't just
*list* it — it *decodes* it: who can actually apply, what's funded, the deadline, and how to
apply.

### Mission & positioning
- **Thesis:** *Talent is born everywhere; opportunity is not.* The product exists to put the
  world's life-changing programs — and a clear path to winning them — within reach of people who
  are otherwise outside the network: first in their family to apply, far from the capital,
  without insider access.
- **Tagline in use:** *"Your circle is not your ceiling."*
- **Voice:** confident, warm, plain-spoken, zero institutional dust — like an older friend who
  already broke out and came back with the map. Marketing lines are short and human; product copy
  is concrete and trustworthy. No dark patterns, no manufactured urgency, no fake reviews.
- **Brand meaning you may use as raw material (your visual interpretation is entirely yours):** the
  "circle" is the boundary of the context you were born into; the product is about breaking out of
  it.

### Audience (a real constraint, not a detail)
**Two co-equal, first-class audiences: international users AND mainland-China users.** Neither is
primary. This drives one concrete requirement: the product is **bilingual** — **English-first
(default), with a live Simplified-Chinese toggle**. Treat the Chinese experience as a real,
first-class surface, not an afterthought. Every user-facing string must exist in both languages
and switch live. (For the prototype, supply real mock translations for the key screens; you do not
need professional translation of every legal paragraph, but the toggle must visibly work
everywhere it matters.)

### Business model (context only — minimal UI surface in this prototype)
Free to browse and to read every opportunity breakdown. A **paid membership** tier unlocks
deeper features (e.g. the full Resources library). You only need to *represent* membership state
(member vs. free) and gate one surface accordingly; you are not building payments.

---

## 2. The surfaces (by purpose)

The product is made of the following user-facing surfaces. They are described **by what they do**,
not by how they are arranged. Design each one freshly.

1. **Home / landing (public).** Sells the product to a first-time visitor. Communicates the
   mission, what the database offers, how it works, and drives sign-up. Features **three live
   headline metrics**: total opportunities collected · open calls right now · closing soon. Should
   include a compelling visual centerpiece that conveys "global opportunity intelligence."

2. **Opportunities database (the core product).** A searchable, filterable, sortable collection of
   opportunities. This is where users spend their time. Full requirements in §3.

3. **Opportunity detail (public, shareable).** The full decoded breakdown of one opportunity. Full
   requirements in §4. These pages are meant to be shared and to look excellent as a link preview.

4. **Resources hub.** A library of guides/articles (application tips, interview prep, networking,
   mentorship, etc.), with category filters and search. Full content is **gated behind
   membership**; free users see a tasteful gate.

5. **Member dashboard.** The signed-in home. Personalized welcome, profile-completion meter,
   saved opportunities, upcoming deadlines, and a recommended-for-you feed. Full requirements in §6.

6. **Onboarding.** A progressive profile-setup flow collecting the fields in §5.

7. **Account settings.** Manage name, email (with verification state), password, the profile
   fields, sign out, and a "danger zone" to delete the account (with confirmation).

8. **Authentication flows.** Sign up, log in, forgot password, reset password, and an
   email-verification prompt/banner. (All simulated client-side.)

9. **Static / legal.** About, Support, Privacy, Terms. About is a real brand storytelling page
   (mission, vision, values, the meaning of the name). The legal pages are prose.

10. **System states.** A 404 (not found) and a generic error page, both on-brand. Plus the empty /
    loading / error states embedded throughout.

---

## 3. Opportunities database — functional requirements

This is the heart of the product. Build it to feel fast, precise, and powerful.

### 3.1 Results & presentation
- Display a collection of opportunity records (see §5 for the data each record carries).
- Provide **three interchangeable ways to view the same results** — the user can switch freely:
  - a rich **gallery** presentation,
  - a compact, scannable **list**,
  - a **geographic map** with one pin per location (pins that share a location cluster/group; a
    hover/tap preview shows the opportunity(ies) there). Opportunities with no mappable location
    are still present in the other two views.
- Show a **live result count** that reflects the active filters.
- Each result surfaces, at a glance: program type/category, a short summary, location, funding
  summary, duration, and the application deadline (with **closing-soon emphasis** when the deadline
  is within ~7 days). Each result links to its detail page and exposes a **save/bookmark** control
  and a quick link to the official page.

### 3.2 Search & filters
All of the following operate together (combined with AND across dimensions; multi-select within a
dimension is OR). Filters should feel live and reflect their active state clearly.

- **Free-text search** across program name, host/provider, location, field/sector, and type.
- **Program type** (multi-select). Controlled list in §5.
- **Delivery mode** (multi-select): In-person, Remote, Hybrid. (When "Remote" is the only mode
  selected, location becomes irrelevant — handle gracefully.)
- **Location, layered & cascading:** Region → Country → City. Choosing a region narrows the
  available countries; choosing countries narrows the available cities. Any layer may be left open.
- **Funding** (multi-select): Self Funded, Free, Fully Funded, Partial / Stipend, Salary.
- **Sector / field** (multi-select). Controlled list in §5.
- **Duration**, as a **range** (a minimum–maximum band over the ordered duration scale in §5).
- **Open vs. All** mode toggle: "Open" shows only opportunities still open to apply (future
  deadline, or rolling/no deadline); "All" also reveals closed/past ones.
- **Application-due window** (a month-range band) — only relevant/shown in "All" mode.
- **Program-dates window** — an independent month-range band with separate start and end bounds:
  the lower bound means "program starts on/after this month," the upper bound means "program
  finishes before the month after this stop." Single-date programs use their start as their finish.
- **Include / exclude undated programs** toggle (programs with no known start date).
- **Sort:** soonest deadline · latest deadline · recently added.
- **Saved-only** toggle: restrict to the user's bookmarked opportunities.
- A clear **empty / no-results state** (distinct copy for "no search matches," "no saved items,"
  "no matches for these filters") with a one-tap way to clear.

### 3.3 The eligibility lens (a signature feature — get this right)
The product's differentiator is **telling people what is actually open to them**, not just listing
everything. Two mechanisms:

- **Nationality lens (works for anyone, no account needed):** the user picks one or more
  nationalities (searchable country selector). Results filter to opportunities that nationality is
  eligible for — i.e. the opportunity's nationality requirement is open, or explicitly includes a
  selected nationality. When the lens is active, an eligible-but-restricted opportunity is badged
  **"Open to you."** When no lens is set, an opportunity that *has* nationality restrictions shows
  a quiet **"has nationality criteria"** hint so users know to check.
- **"Match my profile" (for signed-in members with a complete profile):** one action that filters
  the database to opportunities the member is **eligible for** *and* that match their stated
  interests. Eligibility is computed across four dimensions (see §5.3). It toggles on/off. If the
  profile is incomplete, point the user to complete it.

---

## 4. Opportunity detail — functional requirements

A single opportunity's full, decoded page. Public and built to be shared.

Must present:
- **Identity:** program name, category/type, location, host/provider organization.
- **Key facts**, scannable: funding summary, program dates (or "TBA"), and the **application
  deadline** (rolling when none; shows **"Closed"** when past).
- **Primary actions:** Save/bookmark (prompts sign-in if anonymous), link to the **official
  application page** (or a "link coming soon" state when absent), and **Share** (native share sheet
  on mobile, copy-link with "copied" feedback on desktop).
- **Editorial body**, composed of any of these named sections (each only appears if it has
  content): a lead **summary**; **Benefits & Funding**; **Eligibility**; **Application Process**
  (best presented as ordered, numbered steps); **Application Tips** (an advisory callout);
  **Program Timeline** (a sequence of milestone → date entries, well-suited to a timeline
  treatment). Design each with intent.
- A **"Other opportunities"** module suggesting a few related programs.
- Graceful handling when the breakdown isn't written yet (a "details being prepared" state).
- Be link-preview-worthy: assume each page generates a rich social card with the program name,
  category, host, and location.

---

## 5. The data model the UI must represent

Build mock fixtures that carry these fields. Populate enough realistic records (aim for ~25–40) to
make filtering, the map, and the lens feel real. Use plausible real-world programs (e.g.
Oxford/Chevening/Fulbright/Schwarzman-style fellowships, UN Volunteers roles, DAAD/Erasmus
scholarships, research grants, summits) so it reads as genuine, not lorem ipsum.

### 5.1 Opportunity record — fields
- **Program name** (string)
- **Host / provider organization** (string, optional)
- **Official URL** (string, optional)
- **Application deadline** (date, or none = "rolling"; may be in the past = "Closed")
- **Program start date** / **Program end date** (dates, optional; absent = "TBA"/undated)
- **Recurrence** (one of: Random, Annual, Bi-Annual, Rolling, Umbrella; optional)
- **Program type(s)** (one or more from the Program-type list)
- **Region** (one of: Global, Asia, Africa, Australia / Oceania, North America, South America,
  Europe)
- **Country / City** (each can be multiple)
- **Delivery mode(s)** (one or more of: In-person, Remote, Hybrid)
- **Duration(s)** (one or more from the Duration scale)
- **Degree-level requirement(s)** (one or more from the Degree-level list; "Open to all" = no
  restriction)
- **Experience requirement** (one of: Open to all, < 3 yrs, > 3 yrs, > 5 yrs)
- **Nationality required** (list of countries; empty / "Open to all" = no restriction)
- **Residency required** (list of countries; empty / "Open to all" = no restriction)
- **Sector / field(s)** (one or more from the Sector list; "All Fields" = multidisciplinary,
  matches any interest)
- **Funding type(s)** (one or more of: Self Funded, Free, Fully Funded, Partial / Stipend, Salary)
- **Short card summary** (a one–two sentence blurb)
- **Editorial body sections** (any of: summary, benefits & funding, eligibility, application
  process, application tips, program timeline)

### 5.2 Controlled vocabularies (use these exact option sets)

**Program types** (this order):
Fellowship · Internship · Professional Role · Volunteering · Entrepreneurship · Course / Training ·
Bachelor's Scholarship · Master's Scholarship · PhD Scholarship · Research Program · Summer School ·
Winter School · Forum / Summit · Cultural Exchange

**Durations** (ordered, low → high — the range slider follows this order):
Days · 2-3 weeks · 1 month · 2 months · 3 months · 4 months · 5 months · 6 months · 7 months ·
8 months · 9 months · 10 months · 11 months · 1 year · 2 years · 3 years · Long term · Flexible

**Delivery modes:** In-person · Remote · Hybrid

**Regions:** Global · Asia · Africa · Australia / Oceania · North America · South America · Europe

**Funding:** Self Funded · Free · Fully Funded · Partial / Stipend · Salary

**Degree levels:** Open to all · High School · Bachelor · Bachelor Enrolled · Master ·
Master Enrolled · PhD · PhD Enrolled

**Experience levels:** Open to all · < 3 yrs · > 3 yrs · > 5 yrs

**Sectors / fields** (this order; "All Fields" is the multidisciplinary sentinel):
All Fields · Technology & Computing · Engineering · Sciences & Mathematics ·
Environment & Sustainability · Health & Medicine · Business & Management · Economics & Finance ·
Law & Human Rights · Politics & Public Policy · Social Impact & Development · Education & Teaching ·
Arts & Design · Media & Communication · Humanities · Social Sciences · Agriculture & Food

### 5.3 Eligibility logic (reproduce this client-side)
Given a user (with nationality, residency, education level, years of experience) and an
opportunity, the user is **eligible** only if **all four** pass:
- **Nationality:** opportunity's nationality requirement is open/empty, OR includes the user's
  nationality.
- **Residency:** requirement is open/empty, OR includes the user's residency.
- **Degree:** requirement is open/empty, OR — for a requirement phrased as an **"Enrolled"** stage
  (e.g. "Master Enrolled"), the user must be at **exactly** that stage; for a **completed**
  requirement (e.g. "Master"), the user's attained level must **meet or exceed** it. (Implied
  attainment: someone "Master Enrolled" has completed a Bachelor; "PhD Enrolled" has completed a
  Master; etc.)
- **Experience:** requirement is "Open to all," OR the user's years fall in the required band
  (< 3 / > 3 / > 5).

The nationality lens (§3.3) uses only the nationality rule. "Match my profile" uses all four **and**
additionally narrows to the member's stated type/sector interests.

---

## 6. Member dashboard — functional requirements
- **Personalized welcome** by name.
- **Profile-strength meter:** a completion percentage with a small checklist (e.g. identity
  details, education) and a "complete your profile" prompt. It disappears once the profile is 100%
  complete.
- **Upcoming deadlines:** the member's saved opportunities that are closing, soonest first, each
  with a "days left" indicator and **urgent emphasis when ≤ 7 days** (including "due today" / "due
  tomorrow").
- **Recommended for you:** a feed matched to the member's stated interests (type + sector),
  excluding already-saved items, ranked by relevance then soonest deadline. When the member has set
  no interests, show a "get matched — set your interests" prompt instead.
- **Saved opportunities:** the member's bookmarked items, with an empty state inviting them to
  browse.

---

## 7. Profile (onboarding + account) — fields
Collect and let the user edit:
- **Gender**
- **Nationality / citizenship** (searchable country selector)
- **Residency** (country)
- **Education level** (from the Degree-level list)
- **Years of work experience**
- **Opportunity types of interest** (multi-select; an "All" default that means "don't narrow")
- **Sectors of interest** (multi-select; note "All Fields" is *not* offered as a personal interest
  — it's a property of opportunities only)

A profile is "complete" when the required identity/education fields are filled; completeness gates
the "Match my profile" feature and drives the dashboard meter.

---

## 8. Cross-cutting requirements (apply everywhere)
- **Bilingual EN / 中文**, English default, live toggle, with a font treatment appropriate to each
  script. Every label, button, empty state, and error message switches.
- **Saving / bookmarking** is available wherever an opportunity appears (gallery, list, map preview,
  detail). State is consistent across surfaces within a session.
- **Membership state** (member vs. free) is representable and gates the Resources library.
- **Authentication is simulated:** sign-up, log-in, log-out, forgot/reset password, and an
  email-verification prompt all work as believable client-side flows. Protected surfaces
  (dashboard, account, onboarding, saved) redirect a logged-out visitor to sign in.
- **Responsive:** excellent on mobile and desktop. No horizontal overflow at small widths. Adequate
  tap targets.
- **Accessible:** keyboard-navigable, sensible focus states, meaningful labels, and **honor
  `prefers-reduced-motion`** (motion is a feature, never a barrier).
- **Designed states:** every list/collection has intentional **loading**, **empty**, and **error**
  states. Nothing ever shows a raw blank or a dump.
- **Motion with purpose:** use animation to clarify and delight (entrances, transitions, the hero
  centerpiece), never to slow the user down. Keep frequent interactions instant.

---

## 9. What is explicitly out of scope
- Any backend, server, database, or real authentication.
- Real Notion/CMS integration or live data sync.
- Payments / checkout (only *represent* member vs. free).
- Real email sending, real deadline reminders, real OAuth.
- SEO infrastructure, analytics, and deployment plumbing.
- Professional localization of every legal word (mock translations for key flows are fine).

---

## 10. Deliverables
1. A running **frontend-only prototype** covering every surface in §2, driven entirely by local
   mock data and in-memory state.
2. A **distinct, original design language** you author end to end — typography, color, layout,
   components, iconography, and motion — at flagship quality.
3. The **opportunities database** fully interactive: search, every filter in §3.2, all three view
   modes, the eligibility lens, sorting, and saving, all working against the fixtures.
4. The **bilingual toggle** working across the key surfaces.
5. Believable **mock fixtures** (~25–40 opportunities using the real vocabularies in §5.2, plus a
   sample member profile and a few Resources articles).
6. All **designed states** (loading / empty / error / 404).

Build it like it's the product the mission deserves. Surprise us.
