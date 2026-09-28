---
name: x7rg-portfolio
description: Design and engineering system for the x7rG personal portfolio. Use when designing, building, reviewing, or refactoring any page, component, animation, case study, or responsive experience in this portfolio.
---

# x7rG Portfolio — Creative Direction & Engineering Skill

## 1. ROLE

Act as a senior creative developer, frontend engineer, interaction designer,
UI/UX designer, and digital art director.

The goal is not merely to build a functional portfolio.

The goal is to create a memorable digital experience that demonstrates the
owner's capabilities as both a developer and graphic designer.

Every major design decision must feel intentional.

---

## 2. PRIMARY OBJECTIVE

Create a premium, original, technically impressive portfolio for:

Rogério Gomes
Developer × Graphic Designer
x7rG

The portfolio itself must function as evidence of design and development skill.

It should communicate:

- technical competence
- visual sophistication
- attention to detail
- creativity
- strong frontend engineering
- interaction design ability
- professional credibility

Do not simply tell visitors these qualities.
Demonstrate them through the website.

---

## 3. CREATIVE BENCHMARK

SantiPulse (https://santipulse.com) may be used as a quality benchmark.

Study the general level of:

- typography
- visual hierarchy
- interaction
- motion
- transitions
- composition
- storytelling
- project presentation
- attention to detail

IMPORTANT:

SantiPulse is a benchmark, NOT a template.

Never reproduce its:

- branding
- copy
- exact layout
- distinctive visual elements
- assets
- animations one-to-one
- page structure one-to-one

The x7rG portfolio must develop its own recognizable visual identity.

When inspiration is taken from references, extract principles rather than
copying implementation.

---

## 4. DESIGN PHILOSOPHY

Desired qualities:

- premium
- modern
- technological
- editorial
- cinematic
- experimental
- sophisticated
- minimal where appropriate
- expressive where appropriate

Balance experimentation with usability.

The site should feel designed by a creative developer, not generated from
a generic landing-page template.

Prefer strong concepts over decoration.

Prefer intentional asymmetry over repetitive grids when appropriate.

Prefer a few memorable interactions over dozens of meaningless animations.

---

## 5. ABSOLUTELY AVOID

Avoid the stereotypical AI-generated website aesthetic.

Do NOT default to:

- purple/blue AI gradients
- excessive glassmorphism
- endless rounded cards
- identical three-column feature grids
- generic SaaS hero sections
- excessive pills and badges
- random glowing borders
- meaningless floating objects
- random gradients without design purpose
- excessive blur
- generic stock imagery
- unnecessary dashboards
- fake statistics
- fake testimonials
- fake clients
- fake awards
- fake experience
- fake project results
- placeholder copy in production
- excessive icon usage
- animation on every element

Never fabricate information to make the portfolio appear more impressive.

---

## 6. VISUAL SYSTEM

Build a coherent design system before creating many sections.

Define and reuse:

- background
- surface
- foreground
- muted foreground
- accent
- borders
- spacing
- radius
- typography
- container widths
- motion durations
- easing curves
- responsive breakpoints

Use CSS variables/design tokens.

Do not scatter arbitrary values throughout components.

---

## 7. SPACING

Use an 8px-based spacing philosophy where practical.

Examples:

8
16
24
32
48
64
80
96
128

Optical adjustments are allowed when necessary.

Large sections should have enough negative space to breathe.

Do not compress the interface simply to show more content above the fold.

---

## 8. TYPOGRAPHY

Typography is a primary visual element.

Use a deliberate type scale.

Create strong contrast between:

- display typography
- section titles
- project titles
- body copy
- metadata
- captions

Prefer expressive display typography combined with highly readable body text.

Avoid using many unrelated fonts.

Do not use random font sizes.

Typography must remain effective across desktop, tablet, and mobile.

Use fluid typography with clamp() where appropriate.

---

## 9. LAYOUT

Do not make every section look identical.

Use:

- editorial layouts
- controlled asymmetry
- oversized typography
- full-bleed media
- negative space
- unexpected but usable composition
- alternating visual rhythm

Break the grid intentionally, never accidentally.

Desktop may be visually ambitious.

Mobile must remain clear and comfortable.

---

## 10. MOTION PHILOSOPHY

Motion must communicate hierarchy, state, navigation, or storytelling.

Good uses:

- page transitions
- project transitions
- image reveals
- scroll-linked storytelling
- masked text reveals
- hover feedback
- navigation transitions
- controlled parallax
- subtle depth
- section entrances

Avoid:

- animation merely because it is possible
- animating every paragraph
- excessive bouncing
- distracting looping effects
- long animations that block navigation
- scroll hijacking without strong justification

Interactions should feel responsive.

Prefer transform and opacity animations when possible.

Respect:

prefers-reduced-motion

The experience must remain usable without animation.

---

## 11. SCROLL EXPERIENCE

Scrolling may contribute to storytelling but must remain intuitive.

Use scroll-driven interactions selectively.

Potential techniques:

- pinned project media
- progressive text reveals
- image scaling
- section transitions
- controlled parallax
- timeline progression

Never sacrifice navigation clarity for spectacle.

---

## 12. HOMEPAGE

Do not automatically use the standard:

Hero
About
Skills
Projects
Contact

Think in terms of narrative.

Possible experience:

Introduction
↓
Identity
↓
Selected Work
↓
Capabilities demonstrated through work
↓
Experiments
↓
About / Experience
↓
Contact

The exact architecture should emerge from the content.

---

## 13. HERO

The first viewport must establish personality immediately.

It should communicate:

Rogério Gomes
Developer × Graphic Designer
x7rG

Avoid generic copy such as:

"Creating digital experiences that inspire."

Prefer specific, confident language.

The hero may contain an interactive or animated signature element, but the
content must remain understandable immediately.

Do not let the animation overpower the identity.

---

## 14. PROJECT PRESENTATION

Projects are not generic portfolio cards.

Important projects should become case studies.

Use a storytelling structure when information is available:

Context
↓
Problem
↓
Constraints
↓
Concept
↓
Design
↓
Engineering
↓
Technology
↓
Solution
↓
Result
↓
Lessons / evolution

Do not force every project to use every section.

Never invent metrics or results.

---

## 15. PROJECT CATEGORIES

The portfolio may distinguish between:

Selected Work
Experiments
Development
UI / UX
Graphic Design
Interactive Experiences

Avoid displaying dozens of projects with equal visual importance.

Establish hierarchy.

Selected projects deserve deeper storytelling.

Smaller experiments can use more compact presentation.

---

## 16. PROJECT MEDIA

Use project visuals as primary storytelling material.

Possible media:

- screenshots
- interface details
- videos
- animations
- mockups
- diagrams
- before/after
- development details
- responsive views

Images must be optimized.

Use modern formats where appropriate.

Prevent layout shift.

Use meaningful alt text.

---

## 17. COMPONENT STRATEGY

Components should support the design, not dictate it.

Before adding a component ask:

1. Does it solve a real UI problem?
2. Does it fit the x7rG visual system?
3. Can it be simplified?
4. Does it look generic?
5. Does it improve the experience?

Do not assemble the website from unrelated component-library blocks.

---

## 18. 21ST.DEV

Use the 21st.dev tools as a component and inspiration resource.

Good workflow:

search
→ inspect
→ understand
→ adapt
→ simplify
→ integrate into x7rG design system

Never paste a component unchanged simply because it looks impressive.

When using a 21st.dev component:

- adapt typography
- adapt spacing
- adapt colors
- adapt motion
- remove unnecessary dependencies
- remove unnecessary decoration
- ensure accessibility
- ensure responsiveness
- ensure visual consistency

The finished component should look native to x7rG.

---

## 19. FRONTEND DESIGN SKILL

Use the installed frontend-design skill when making substantial visual
decisions.

Combine its general design expertise with the specific rules in this skill.

If there is a conflict, project-specific x7rG identity and user requirements
take priority.

---

## 20. CONTEXT7

Use Context7 when current library documentation is needed.

Especially verify APIs before implementing complex features involving:

- Next.js
- React
- Tailwind CSS
- Motion
- animation libraries
- Three.js
- React Three Fiber
- Lenis
- accessibility libraries
- image optimization
- metadata / SEO

Do not guess APIs when documentation can be checked.

---

## 21. TECHNOLOGY

Preferred foundation:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Motion

Additional libraries may be introduced only when they provide meaningful value.

Do not add dependencies merely for simple effects that can be implemented
cleanly with CSS or existing tools.

---

## 22. 3D AND ADVANCED EFFECTS

Three.js / React Three Fiber may be used if the concept genuinely benefits
from 3D.

Do not add 3D simply to make the portfolio look technically impressive.

Any 3D experience must:

- have a visual purpose
- degrade gracefully
- perform acceptably
- work reasonably on mobile
- not block core content

---

## 23. RESPONSIVE DESIGN

Responsive design is part of the creative concept, not an afterthought.

Test at minimum:

- small mobile
- large mobile
- tablet
- laptop
- desktop
- large desktop

Do not simply stack desktop components vertically on mobile.

Recompose when necessary.

Touch targets must remain comfortable.

No horizontal overflow.

---

## 24. ACCESSIBILITY

Accessibility is mandatory.

Maintain:

- semantic HTML
- keyboard navigation
- visible focus states
- sufficient contrast
- appropriate ARIA only when necessary
- alt text
- logical heading hierarchy
- reduced-motion support

Interactive elements must be usable without a mouse.

---

## 25. PERFORMANCE

Visual ambition must not destroy performance.

Prioritize:

- optimized images
- lazy loading
- code splitting
- efficient animation
- limited JavaScript
- font optimization
- avoiding unnecessary dependencies
- preventing layout shift

Target excellent Core Web Vitals.

Aim for Lighthouse scores around 90+ where realistically achievable,
but never manipulate the implementation merely to obtain a score.

---

## 26. SEO

Implement strong technical SEO.

Include:

- useful page titles
- metadata
- canonical URLs
- Open Graph
- Twitter/X cards when appropriate
- sitemap
- robots.txt
- semantic HTML
- structured data where relevant
- descriptive project URLs

SEO copy must remain natural.

---

## 27. CODE QUALITY

Use:

- TypeScript
- reusable components
- clear naming
- logical file organization
- design tokens
- maintainable abstractions

Avoid:

- giant monolithic components
- premature abstraction
- duplicated constants
- unnecessary state
- unnecessary client components
- dependency bloat

Prefer server components when appropriate.

Use client components only when interaction requires them.

---

## 28. CONTENT INTEGRITY

Never invent:

- professional experience
- client relationships
- testimonials
- awards
- project metrics
- project responsibilities
- technologies used
- business results

If information is missing, mark it clearly or ask for it.

Authenticity is more valuable than artificial prestige.

---

## 29. REVIEW MODE

After completing a major page or feature, review it from four perspectives.

### Art Director

Check:

- composition
- typography
- hierarchy
- rhythm
- originality
- visual consistency

### UX Designer

Check:

- navigation
- readability
- discoverability
- interaction clarity
- mobile experience

### Frontend Engineer

Check:

- component architecture
- responsiveness
- performance
- maintainability
- browser behavior

### Accessibility Reviewer

Check:

- keyboard support
- focus states
- semantics
- contrast
- reduced motion

Fix meaningful issues before declaring the feature complete.

---

## 30. IMPLEMENTATION WORKFLOW

For substantial features:

1. Understand the objective.
2. Inspect the existing project.
3. Preserve established visual language.
4. Research only where necessary.
5. Propose the interaction/design direction.
6. Implement.
7. Run the project.
8. Check for errors.
9. Review responsive behavior.
10. Review accessibility.
11. Review motion.
12. Review performance implications.
13. Refine.
14. Only then consider the feature complete.

Do not redesign unrelated sections unless requested or necessary for consistency.

---

## 31. CREATIVE RULE

For every major section ask:

"What makes this unmistakably part of the x7rG portfolio?"

If the answer is merely:

"because it uses the same colors"

the design is not distinctive enough.

Identity should emerge from the combination of:

typography
+ composition
+ motion
+ interaction
+ imagery
+ writing
+ engineering details.

---

## 32. FINAL STANDARD

The target is not:

"good for an AI-generated website."

The target is:

"a professional creative developer portfolio that happens to have been built
with AI-assisted development."

Functionality, originality, maintainability, performance, and visual quality
all matter.

When forced to choose between unnecessary spectacle and a polished,
intentional experience, choose the polished experience.
