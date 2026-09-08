# Insight Clinic — Patient Care Flows (Px Care)

Digitised from the clinic flip‑chart. Two parallel journeys plus a shared touch‑point
layer that runs across every treatment block.

- **N/P Care Flow** — New Patient journey (left)
- **O/P Care Flow** — Old / returning Patient journey (right)
- **Touch Points** — SMS / Email / Phone check‑ins during treatment blocks

**Treatment key:** `ACU` = Acupuncture · `CRAN` = Cranial / Craniosacral therapy ·
`(1)(2)(3)` = session number in sequence · `Cons` = Consultation · `Meds` = Medications / Supplements

---

## Visual flow (side‑by‑side)

```mermaid
flowchart TB
    subgraph NP["🆕 N/P CARE FLOW — New Patient"]
        direction TB
        NP1["1 · INITIAL CONS"]
        NP1A["A — Create a treatment plan<br/>e.g. ACU(1) → CRAN(1) → ACU(2) → CRAN(2) → ACU(3)"]
        NP1B["B — Medications / Supplements<br/>(with 6‑week review)"]
        NP1C["C — ACU / CRAN taster<br/>(FREE · new patients only)"]
        NP2["2 · TREATMENT BLOCK<br/>(within 6 weeks)<br/>ACU(1) → CRAN(1) → ACU(2) → ACU(3)"]
        NP3["3 · FOLLOW‑UP (6 week)<br/>A — Assess meds<br/>B — Assess treatments<br/>C — New treatment plan"]
        NPR(["🔁 REPEAT FLOW"])

        NP1 --> NP1A --> NP1B --> NP1C --> NP2 --> NP3 --> NPR
        NPR -.-> NP2
    end

    subgraph OP["🔄 O/P CARE FLOW — Old / Returning Patient"]
        direction TB
        OP1["1 · FOLLOW‑UP<br/>↳ Create treatment plan<br/>↳ Supplements assessment"]
        OP2["2 · IF? TREATMENT PLAN<br/>ACU(1) → CRAN(1) → ACU(2) → CRAN(2) → ACU(3)"]
        OP3["3 · FOLLOW‑UP (6 week)<br/>↳ Assess meds<br/>↳ Assess treatments<br/>↳ NEW treatment plan"]
        OPR(["🔁 REPEAT FLOW"])

        OP1 --> OP2 --> OP3 --> OPR
        OPR -.-> OP2
    end

    subgraph TP["📣 TOUCH POINTS — Customer Journey / Px Care"]
        direction TB
        TPnote["During treatment blocks — touch points via:<br/>1 · SMS  2 · Email  3 · Phone"]
        TPsurvey["'How are you feeling?' — quick survey form<br/>• How are your energy levels today? → Good / OK / Bad<br/>• Would you like a quick SMS / call back today? → Yes / No"]
        TPnote --> TPsurvey
    end

    NP2 -.->|check‑ins| TP
    OP2 -.->|check‑ins| TP
```

---

## N/P Care Flow — New Patient (step‑by‑step)

### 1. Initial Consultation
- **A — Create a treatment plan.** Map out the recommended sequence of sessions, e.g.
  `ACU(1) → CRAN(1) → ACU(2) → CRAN(2) → ACU(3)`.
- **B — Medications / Supplements.** Recommend supplements and set a **6‑week review**.
- **C — ACU / CRAN taster (FREE).** New‑patient‑only acquisition offer to get them into care.

### 2. Treatment Block *(within 6 weeks)*
- Deliver the planned sessions: `ACU(1) → CRAN(1) → ACU(2) → ACU(3)`.
- Run **Touch Points** (SMS / Email / Phone) throughout the block — see below.

### 3. Follow‑up *(6 week)*
- **A — Assess meds / supplements.**
- **B — Assess treatments** (progress against the plan).
- **C — Create a new treatment plan.**
- ➡️ **Repeat flow** — loop back into a new treatment block.

---

## O/P Care Flow — Old / Returning Patient (step‑by‑step)

### 1. Follow‑up
- Create a treatment plan.
- Run a supplements assessment.

### 2. *If?* Treatment Plan
- If a plan is warranted, deliver the sequence:
  `ACU(1) → CRAN(1) → ACU(2) → CRAN(2) → ACU(3)`.
- Run **Touch Points** (SMS / Email / Phone) throughout the block.

### 3. Follow‑up *(6 week)*
- Assess meds / supplements.
- Assess treatments.
- Create a **NEW** treatment plan.
- ➡️ **Repeat flow** — loop back into a new treatment block.

> **Note:** The free ACU / CRAN taster is a **new‑patient acquisition offer only** and does
> not appear in the O/P flow.

---

## Touch Points — Customer Journey / Px Care

Runs **during every treatment block**, in both flows.

**Channels:** 1. SMS  ·  2. Email  ·  3. Phone

**"How are you feeling?" — quick survey form**

| Prompt | Options |
|---|---|
| How are your energy levels today? | ☐ Good  ☐ OK  ☐ Bad |
| Would you like a quick SMS / call back today? | ☐ Yes  ☐ No |

A "Bad" energy answer or a "Yes" call‑back request should trigger a same‑day follow‑up
from the clinic.
