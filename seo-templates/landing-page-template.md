# CalcMaster SEO Landing Page Template

## Instructions
Use this template to generate SEO-optimized landing pages for each calculator.
Replace {CALCULATOR_NAME}, {CATEGORY}, etc. with actual values.

---

# {CALCULATOR_NAME} Calculator

## SEO Metadata

```tsx
export const metadata: Metadata = {
  title: '{CALCULATOR_NAME} Calculator - {BENEFIT} | CalcMaster',
  description: 'Free {CALCULATOR_NAME} calculator with instant results. {UNIQUE_VALUE_PROP}. Get AI-powered insights and save your calculations.',
  keywords: ['{PRIMARY_KEYWORD}', '{SECONDARY_KEYWORD_1}', '{SECONDARY_KEYWORD_2}'],
  alternates: {
    canonical: 'https://calcmaster.io/{CATEGORY}/{SLUG}/',
  },
  openGraph: {
    title: '{CALCULATOR_NAME} Calculator | CalcMaster',
    description: '{META_DESCRIPTION}',
    url: 'https://calcmaster.io/{CATEGORY}/{SLUG}/',
    siteName: 'CalcMaster',
    images: [
      {
        url: '/og-images/{SLUG}.png',
        width: 1200,
        height: 630,
        alt: '{CALCULATOR_NAME} Calculator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '{CALCULATOR_NAME} Calculator | CalcMaster',
    description: '{META_DESCRIPTION}',
    images: ['/og-images/{SLUG}.png'],
  },
};
```

## Page Structure

### 1. Hero Section (Above Fold)
```
<h1>{CALCULATOR_NAME} Calculator</h1>
<p class="subtitle">{HERO_SUBTITLE}</p>

[CALCULATOR COMPONENT]

<p class="intro">{INTRO_TEXT}</p>
```

### 2. How It Works
```
<section id="how-it-works">
  <h2>How to Use the {CALCULATOR_NAME} Calculator</h2>
  <ol>
    <li>
      <h3>Step 1: {STEP_1_TITLE}</h3>
      <p>{STEP_1_DESC}</p>
    </li>
    <li>
      <h3>Step 2: {STEP_2_TITLE}</h3>
      <p>{STEP_2_DESC}</p>
    </li>
    <li>
      <h3>Step 3: {STEP_3_TITLE}</h3>
      <p>{STEP_3_DESC}</p>
    </li>
  </ol>
</section>
```

### 3. AI Explanation (Unique Feature)
```
<section id="ai-insights">
  <h2>AI-Powered Insights</h2>
  <p>Unlike other calculators, CalcMaster uses AI to explain your results in plain language.</p>
  [AI_EXPLANATION_COMPONENT]
</section>
```

### 4. Benefits Section
```
<section id="benefits">
  <h2>Why Use CalcMaster's {CALCULATOR_NAME} Calculator?</h2>
  <ul>
    <li>
      <h3>{BENEFIT_1_TITLE}</h3>
      <p>{BENEFIT_1_DESC}</p>
    </li>
    <li>
      <h3>{BENEFIT_2_TITLE}</h3>
      <p>{BENEFIT_2_DESC}</p>
    </li>
    <li>
      <h3>{BENEFIT_3_TITLE}</h3>
      <p>{BENEFIT_3_DESC}</p>
    </li>
  </ul>
</section>
```

### 5. Educational Content (SEO Text)
```
<article id="learn-more">
  <h2>What is {TOPIC}?</h2>
  <p>{PARAGRAPH_1}</p>

  <h3>{SUBTOPIC_1}</h3>
  <p>{PARAGRAPH_2}</p>

  <h3>{SUBTOPIC_2}</h3>
  <p>{PARAGRAPH_3}</p>

  <h3>{SUBTOPIC_3}</h3>
  <p>{PARAGRAPH_4}</p>
</article>
```

### 6. FAQ Section (Schema Markup)
```
<section id="faq">
  <h2>Frequently Asked Questions</h2>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "{FAQ_1_Q}",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "{FAQ_1_A}"
        }
      },
      // ... 4 more FAQs
    ]
  }
  </script>

  <details>
    <summary>{FAQ_1_Q}</summary>
    <p>{FAQ_1_A}</p>
  </details>
  <!-- Repeat for all FAQs -->
</section>
```

### 7. Related Calculators
```
<section id="related">
  <h2>Related Calculators</h2>
  <ul>
    <li><a href="/{RELATED_1_URL}/">{RELATED_1_NAME} Calculator</a></li>
    <li><a href="/{RELATED_2_URL}/">{RELATED_2_NAME} Calculator</a></li>
    <li><a href="/{RELATED_3_URL}/">{RELATED_3_NAME} Calculator</a></li>
  </ul>
</section>
```

### 8. Calculator Schema (Structured Data)
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "{CALCULATOR_NAME} Calculator",
  "url": "https://calcmaster.io/{CATEGORY}/{SLUG}/",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1250"
  }
}
```

---

## Long-Tail Page Variants

Create these additional pages targeting specific keywords:

| Variant | URL | Target Keyword |
|---------|-----|----------------|
| {VARIANT_1_NAME} | /{CATEGORY}/{SLUG}/{VARIANT_1_SLUG}/ | {VARIANT_1_KEYWORD} |
| {VARIANT_2_NAME} | /{CATEGORY}/{SLUG}/{VARIANT_2_SLUG}/ | {VARIANT_2_KEYWORD} |
| {VARIANT_3_NAME} | /{CATEGORY}/{SLUG}/{VARIANT_3_SLUG}/ | {VARIANT_3_KEYWORD} |

---

## Checklist Before Publishing

- [ ] Title is 50-60 characters
- [ ] Meta description is 150-160 characters
- [ ] H1 contains primary keyword
- [ ] At least 300 words of educational content
- [ ] 5 FAQs with schema markup
- [ ] OpenGraph image created (1200x630)
- [ ] Canonical URL set
- [ ] Internal links to 3+ related calculators
- [ ] Mobile-responsive layout tested
- [ ] Page loads in <3 seconds
- [ ] AI explanation component integrated
