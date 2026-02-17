// JSON-LD Schema.org generators for CalcMaster SEO

import type { CalculatorData, CalculatorFAQ } from '@/data/calculators'
import type { StateInfo, StateCalculatorConfig, StateCalculatorFAQ } from '@/types/state-calculator'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://calcmaster.vercel.app'

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CalcMaster',
    url: BASE_URL,
    logo: `${BASE_URL}/icon.png`,
    description: 'Free online calculators for health, finance, math, and more. Get instant results with AI-powered explanations.',
    sameAs: [],
  }
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CalcMaster',
    url: BASE_URL,
    description: 'Free online calculators with AI-powered explanations and scientific methodologies.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateCalculatorSchema(calc: CalculatorData, categoryName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: calc.name,
    url: `${BASE_URL}/${calc.category}/${calc.slug}`,
    description: calc.metaDescription,
    applicationCategory: 'CalculatorApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Instant calculations',
      'AI-powered explanations',
      'Scientific methodology',
      'PDF export',
      'Multiple calculation methods',
    ],
    browserRequirements: 'Requires JavaScript',
    isPartOf: {
      '@type': 'WebSite',
      name: 'CalcMaster',
      url: BASE_URL,
    },
  }
}

export function generateFAQSchema(faqs: CalculatorFAQ[]) {
  if (!faqs || faqs.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function generateHowToSchema(calc: CalculatorData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use the ${calc.name}`,
    description: `Step-by-step guide to using the ${calc.name} on CalcMaster.`,
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Enter your values',
        text: `Fill in the required fields for the ${calc.name}. Each field has helpful placeholders and default values.`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Review the results',
        text: 'Your results are calculated instantly as you type. Review the primary result and any secondary breakdowns.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Get AI explanation',
        text: 'Click "Explain with AI" for a personalized interpretation of your results with actionable insights.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Export or share',
        text: 'Download a PDF report of your calculation results for your records.',
      },
    ],
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateCollectionPageSchema(
  categoryName: string,
  categorySlug: string,
  calculators: CalculatorData[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} Calculators`,
    url: `${BASE_URL}/${categorySlug}`,
    description: `Free online ${categoryName.toLowerCase()} calculators with instant results and AI-powered explanations.`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'CalcMaster',
      url: BASE_URL,
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: calculators.map((calc, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: calc.name,
        url: `${BASE_URL}/${calc.category}/${calc.slug}`,
      })),
    },
  }
}

// --- State-specific schema generators ---

export function generateStateCalculatorSchema(calc: StateCalculatorConfig, stateInfo: StateInfo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: calc.name,
    url: `${BASE_URL}/${calc.category}/${calc.slug}`,
    description: calc.metaDescription,
    applicationCategory: 'CalculatorApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      `${stateInfo.name}-specific calculations`,
      'Real state tax rates and laws',
      'AI-powered explanations',
      'PDF export',
    ],
    browserRequirements: 'Requires JavaScript',
    contentLocation: {
      '@type': 'State',
      name: stateInfo.name,
      containedInPlace: {
        '@type': 'Country',
        name: 'United States',
      },
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'CalcMaster',
      url: BASE_URL,
    },
  }
}

export function generateStateFAQSchema(faqs: StateCalculatorFAQ[]) {
  if (!faqs || faqs.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function generateStateLandingSchema(stateInfo: StateInfo, calculators: StateCalculatorConfig[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${stateInfo.name} Calculators`,
    url: `${BASE_URL}/state/${stateInfo.slug}`,
    description: `Free ${stateInfo.name} calculators with state-specific tax rates, laws, and data. ${calculators.length} calculators built for ${stateInfo.abbreviation} residents.`,
    about: {
      '@type': 'State',
      name: stateInfo.name,
      containedInPlace: {
        '@type': 'Country',
        name: 'United States',
      },
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: calculators.map((calc, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: calc.name,
        url: `${BASE_URL}/${calc.category}/${calc.slug}`,
      })),
    },
  }
}
