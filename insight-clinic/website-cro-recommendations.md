# Insight Clinic — Website CRO Recommendations
**Site:** insightclinic.care
**Industry benchmark:** Healthcare clinics typically convert at 2–4%. Above 5% is excellent.
**Goal:** Turn website visitors into booked patients

---

## CRO Score Assessment

Based on standard healthcare clinic patterns and the scoring dimensions used by `cro_audit.py`:

| Dimension | Common Issues for Health Clinics | Target Score |
|---|---|---|
| Headline Clarity | Vague taglines that don't state specialty clearly | 85+ |
| CTA Visibility | "Book Now" buried below the fold or weak contrast | 90+ |
| Social Proof | Too few reviews, no testimonials, no logos | 80+ |
| Urgency | No scarcity signals, no response-time commitment | 70+ |
| Trust Signals | Missing credentials, registration numbers, associations | 85+ |
| Form Friction | Too many fields in booking form | 80+ |
| Mobile Responsiveness | Critical: >70% of health searches happen on mobile | 90+ |
| Page Speed | Large images, unoptimised fonts | 80+ |

---

## Priority Fix 1: Homepage Headline Clarity

**The problem most health clinic websites have:**
The homepage headline says something like "Your Health, Our Priority" or "Holistic Wellbeing in Islington" — which says nothing about who you are or what you do.

**What to aim for:**
A visitor should understand within 3 seconds:
- What you do
- Who it's for
- Why you (not someone else)

**Recommended headline structure:**

```
H1: Integrative Health Care in Islington

Subheadline: We treat the root cause — not just the symptoms.
Combining conventional medicine with acupuncture, nutritional therapy, 
osteopathy and naturopathy for patients in N1 and across London.

CTA button: [Book Your First Consultation]   [Learn How We Work →]
```

**Secondary headlines (for service sections):**
- "Tired of hearing 'your results are normal'?" → leads to fatigue/complex conditions section
- "One team. Every tool." → leads to practitioner team section

---

## Priority Fix 2: CTA Visibility

**The problem:** Most clinic sites have one CTA (usually "Book Now") in the nav bar. Visitors who scroll past the fold lose sight of it.

**Fix: Sticky booking button on mobile**
- On mobile, add a sticky bottom bar: `[📅 Book an Appointment]` that follows the user as they scroll
- On desktop, add CTA buttons at the end of every section, not just the top

**CTA copy to test:**

| Version | Expected conversion |
|---|---|
| "Book Now" | Baseline |
| "Book Your First Consultation" | +10–15% |
| "Book a Free Discovery Call" | +20–30% (lowers barrier) |
| "Check Our Availability →" | +15–20% |

**Recommendation:** Offer a free 15-minute discovery call as the primary CTA. This lowers the barrier significantly vs committing to a paid consultation immediately. Capture email on the call → convert to full appointment.

---

## Priority Fix 3: Social Proof

**The problem:** Potential patients are making a healthcare decision. Trust is everything. Most clinic sites have 1–3 testimonials, no visible review count, and no practitioner credentials shown prominently.

**Fixes:**

1. **Review widget on homepage:** Show your Google rating (e.g., ⭐⭐⭐⭐⭐ 4.9 · 47 reviews) with a link to read reviews. Plugins like Elfsight or EmbedSocial do this for WordPress. Update it automatically.

2. **Testimonial format that converts:**
   ```
   "I'd had chronic fatigue for 3 years and my GP told me my results were normal.
   After 4 months at Insight Clinic my energy is completely different."

   — Sarah M., Islington (Integrative GP patient)
   ```
   - Include first name + initial (not full name if patient prefers)
   - Include the specific condition/service if patient allows
   - Include the neighbourhood (builds local trust)
   - Photo if patient consents — increases credibility 3x

3. **Practitioner credentials:** Show on the homepage and on each practitioner's profile:
   - Degree and institution
   - Regulatory body membership (GCC, BAcC, BANT, etc.) with logo
   - Years of experience
   - Areas of specialisation

4. **Media logos (if applicable):** "As featured in..." section with any press mentions

5. **Number proof:**
   ```
   12+ years experience · 1,000+ patients helped · 15 practitioners
   ```

---

## Priority Fix 4: Trust Signals

Healthcare visitors scan for credibility markers. Add these:

**Above the fold:**
- Association logos (British Acupuncture Council, General Chiropractic Council, BANT, etc.)
- CQC registration if applicable (or state "all practitioners are registered with their relevant regulatory body")
- "Book with confidence" — clear cancellation policy

**Footer (must-haves):**
- Full registered address (24 Chapel Market, Islington, N1 9EZ)
- Company registration number (if applicable)
- Privacy policy link (GDPR compliance)
- Cookie policy
- Contact phone number (not just a form)

**FAQ section (trust + SEO):**
- "Are your practitioners regulated?"
- "Does health insurance cover my treatment?"
- "What's the difference between integrative and alternative medicine?"
- "How many appointments will I need?"
- "What should I bring to my first appointment?"

---

## Priority Fix 5: Form Friction Reduction

**The problem:** Long booking forms with 10+ fields cause drop-off. Every extra field costs approximately 3–5% of completions.

**Minimum viable booking form (5 fields max):**
1. First name
2. Email address
3. Phone number
4. Service interested in (dropdown)
5. How did you hear about us? (dropdown)

**What to remove:**
- Date of birth (collect on intake form after they've booked)
- Full address
- Medical history (send an intake form AFTER booking is confirmed)
- Insurance details

**Better experience:**
1. Short form on site → they book a slot
2. Automated email with intake questionnaire → they complete it before attending
3. Practitioner reviews intake → arrives prepared

---

## Priority Fix 6: Mobile Experience

**>70% of healthcare searches happen on mobile.** This is non-negotiable.

**Mobile checklist:**
- [ ] Phone number is a `tel:` link (tap to call)
- [ ] Booking button is large (minimum 44px height) and above the fold on mobile
- [ ] No horizontal scrolling on any page
- [ ] Text is minimum 16px (healthcare users often older)
- [ ] Images compress correctly on mobile (no oversized images)
- [ ] Google Maps embed loads correctly
- [ ] Contact form is usable with thumbs (not tiny fields)

**Test:** Open insightclinic.care on your phone and try to book as if you'd never visited before. Time how long it takes. Aim for <2 minutes from landing to "booking confirmed".

---

## Priority Fix 7: Page Speed

Slow sites kill conversions. Healthcare visitors are often anxious — a slow site increases that anxiety.

**Free audit:** Google PageSpeed Insights (pagespeed.web.dev) — target 80+ on mobile.

**Common fixes:**
- Compress all images (use TinyPNG or WebP format)
- Lazy-load images below the fold
- Remove unused plugins (if WordPress)
- Use a CDN (Cloudflare free tier is sufficient)
- Eliminate render-blocking scripts

---

## High-Impact Page to Create: "New Patient Guide"

Create a standalone page at insightclinic.care/new-patients with:
1. What to expect at your first appointment (step by step)
2. How to prepare
3. FAQ
4. A short video from the lead practitioner welcoming new patients
5. A large, clear booking button

This page:
- Reduces anxiety (a key objection for first-time integrative health patients)
- Converts worried-but-interested visitors
- Can be used as the Google Ads landing page
- Gives referral partners something concrete to send patients

---

## A/B Tests to Run (Once Traffic is Flowing)

| Test | Variant A (Control) | Variant B (Test) | Metric |
|---|---|---|---|
| Primary CTA | "Book Now" | "Book a Free Discovery Call" | Booking rate |
| Hero headline | Current | Proposed version from Fix 1 | Time on page + bookings |
| Social proof position | Below fold | Above fold on homepage | Booking rate |
| Booking form length | Full form | 5-field short form | Form completions |
| Mobile sticky CTA | None | Sticky "Book Now" bar | Mobile bookings |

Use Google Optimize (free) or any split-testing tool. Run each test for minimum 2 weeks or 100 form completions — whichever comes last.

---

## 30-Day CRO Implementation Priority

| Week | Action | Effort | Expected Impact |
|---|---|---|---|
| 1 | Update homepage headline + subheadline | Low | High |
| 1 | Add Google review widget | Low | High |
| 1 | Make phone number a tap-to-call link on mobile | Very Low | Medium |
| 2 | Add sticky booking button on mobile | Medium | High |
| 2 | Reduce booking form to 5 fields | Low | Medium |
| 2 | Add practitioner credentials to homepage | Low | High |
| 3 | Create New Patient Guide page | Medium | High |
| 3 | Add association logos above the fold | Low | Medium |
| 4 | Run PageSpeed audit and fix top 3 issues | Medium | Medium |
| 4 | Add 3 strong patient testimonials with photos | Medium | High |
