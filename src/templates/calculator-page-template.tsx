/**
 * CalcMaster Programmatic SEO Template
 *
 * This template generates unique, SEO-optimized pages for each calculator.
 * Each page has: unique content, proper schema, internal links, and AI explanations.
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// ============================================
// TYPES
// ============================================

export interface CalculatorData {
  // Core identifiers
  slug: string;
  name: string;
  category: 'health' | 'finance' | 'math' | 'date-time' | 'construction' | 'fun' | 'education';

  // SEO metadata
  primaryKeyword: string;
  secondaryKeywords: string[];
  metaTitle: string;           // 50-60 chars
  metaDescription: string;     // 150-160 chars

  // Page content
  heroTitle: string;
  heroSubtitle: string;
  introText: string;           // Unique intro paragraph

  // How it works (3 steps)
  howItWorks: {
    step: number;
    title: string;
    description: string;
  }[];

  // Benefits (3-4 items)
  benefits: {
    icon: string;
    title: string;
    description: string;
  }[];

  // Educational content (300+ words, unique per page)
  educationalContent: {
    title: string;
    sections: {
      heading: string;
      paragraphs: string[];
      table?: {
        headers: string[];
        rows: string[][];
      };
    }[];
  };

  // FAQs (5 questions for schema)
  faqs: {
    question: string;
    answer: string;
  }[];

  // Internal linking
  relatedCalculators: string[];  // slugs
  longTailVariants: {
    slug: string;
    title: string;
    keyword: string;
  }[];

  // Optional
  formula?: string;
  lastUpdated: string;
}

// ============================================
// METADATA GENERATOR
// ============================================

export function generateCalculatorMetadata(data: CalculatorData, category: string): Metadata {
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    keywords: [data.primaryKeyword, ...data.secondaryKeywords],

    alternates: {
      canonical: `https://calcmaster.io/${category}/${data.slug}/`,
    },

    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: `https://calcmaster.io/${category}/${data.slug}/`,
      siteName: 'CalcMaster',
      images: [{
        url: `/og/${data.slug}.png`,
        width: 1200,
        height: 630,
        alt: `${data.name} Calculator`,
      }],
      locale: 'en_US',
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title: data.metaTitle,
      description: data.metaDescription,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// ============================================
// SCHEMA GENERATORS
// ============================================

export function generateWebApplicationSchema(data: CalculatorData, category: string) {
  return {
    '@type': 'WebApplication',
    '@id': `https://calcmaster.io/${category}/${data.slug}/#webapp`,
    name: `${data.name} Calculator`,
    url: `https://calcmaster.io/${category}/${data.slug}/`,
    description: data.metaDescription,
    applicationCategory: getCategorySchema(category),
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'CalcMaster',
      url: 'https://calcmaster.io',
    },
  };
}

export function generateFAQSchema(data: CalculatorData) {
  return {
    '@type': 'FAQPage',
    mainEntity: data.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(data: CalculatorData, category: string) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://calcmaster.io/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: getCategoryName(category),
        item: `https://calcmaster.io/${category}/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${data.name} Calculator`,
        item: `https://calcmaster.io/${category}/${data.slug}/`,
      },
    ],
  };
}

export function generateHowToSchema(data: CalculatorData) {
  return {
    '@type': 'HowTo',
    name: `How to Use the ${data.name} Calculator`,
    description: data.introText,
    totalTime: 'PT2M',
    step: data.howItWorks.map(step => ({
      '@type': 'HowToStep',
      position: step.step,
      name: step.title,
      text: step.description,
    })),
  };
}

export function generateFullSchema(data: CalculatorData, category: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      generateWebApplicationSchema(data, category),
      generateFAQSchema(data),
      generateBreadcrumbSchema(data, category),
      generateHowToSchema(data),
    ],
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getCategorySchema(category: string): string {
  const map: Record<string, string> = {
    health: 'HealthApplication',
    finance: 'FinanceApplication',
    math: 'UtilityApplication',
    'date-time': 'UtilityApplication',
    construction: 'UtilityApplication',
    fun: 'GameApplication',
    education: 'EducationalApplication',
  };
  return map[category] || 'UtilityApplication';
}

function getCategoryName(category: string): string {
  const map: Record<string, string> = {
    health: 'Health & Fitness',
    finance: 'Financial',
    math: 'Math',
    'date-time': 'Date & Time',
    construction: 'Construction',
    fun: 'Fun & Games',
    education: 'Education',
  };
  return map[category] || category;
}

// ============================================
// TITLE & META TEMPLATES
// ============================================

export const titleTemplates = {
  // Primary calculator pages
  calculator: '{name} Calculator - {benefit} | CalcMaster',

  // Persona variants
  persona: '{name} Calculator for {audience} | CalcMaster',

  // Location variants
  location: '{name} Calculator {location} | CalcMaster',

  // Conversion pages
  conversion: '{from} to {to} Converter - Free Online | CalcMaster',

  // Glossary pages
  glossary: 'What is {term}? Definition & Calculator | CalcMaster',
};

export const metaTemplates = {
  calculator: 'Free {name} calculator with instant results. {uniqueValue}. Get AI-powered insights and save your calculations.',

  persona: 'Free {name} calculator designed for {audience}. {uniqueValue}. Includes {specialFeature}.',

  conversion: 'Convert {from} to {to} instantly. Free online converter with accurate results. Includes conversion table and formula.',

  glossary: 'Learn what {term} means and how to calculate it. Simple explanation with free calculator tool.',
};

// ============================================
// CONTENT TEMPLATES
// ============================================

export const introTemplates = {
  health: `Looking for an accurate {name} calculation? Our free {name} calculator gives you instant results based on {inputs}. Plus, get AI-powered explanations of what your results mean for your health.`,

  finance: `Planning your finances? Our {name} calculator helps you understand {benefit}. Enter your details below for instant calculations, visual breakdowns, and AI-powered financial insights.`,

  math: `Need to calculate {name}? Our free calculator gives you instant, accurate results with step-by-step explanations. Perfect for students, teachers, and professionals.`,

  'date-time': `Calculate {name} instantly with our free online tool. Whether you need to find {useCase1} or {useCase2}, we've got you covered with precise results.`,

  construction: `Planning a project? Our {name} calculator helps you estimate {material} needs accurately. Avoid over-ordering or running short with precise calculations.`,
};

// ============================================
// INTERNAL LINKING LOGIC
// ============================================

export function getRelatedCalculators(
  currentSlug: string,
  category: string,
  allCalculators: CalculatorData[]
): CalculatorData[] {
  // 1. Same category calculators (highest relevance)
  const sameCategory = allCalculators.filter(
    calc => calc.category === category && calc.slug !== currentSlug
  );

  // 2. Sort by keyword overlap
  const current = allCalculators.find(c => c.slug === currentSlug);
  if (!current) return sameCategory.slice(0, 5);

  const scored = sameCategory.map(calc => ({
    calc,
    score: calculateRelevanceScore(current, calc),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 5).map(s => s.calc);
}

function calculateRelevanceScore(a: CalculatorData, b: CalculatorData): number {
  let score = 0;

  // Same category = base score
  if (a.category === b.category) score += 10;

  // Keyword overlap
  const aKeywords = new Set([a.primaryKeyword, ...a.secondaryKeywords]);
  const bKeywords = new Set([b.primaryKeyword, ...b.secondaryKeywords]);

  for (const kw of aKeywords) {
    if (bKeywords.has(kw)) score += 5;
  }

  // Name similarity (shared words)
  const aWords = a.name.toLowerCase().split(' ');
  const bWords = b.name.toLowerCase().split(' ');

  for (const word of aWords) {
    if (bWords.includes(word)) score += 3;
  }

  return score;
}

// ============================================
// SITEMAP GENERATOR
// ============================================

export function generateSitemapEntries(calculators: CalculatorData[]) {
  const entries: { url: string; lastmod: string; priority: number; changefreq: string }[] = [];

  // Homepage
  entries.push({
    url: 'https://calcmaster.io/',
    lastmod: new Date().toISOString(),
    priority: 1.0,
    changefreq: 'daily',
  });

  // Category hubs
  const categories = ['health', 'finance', 'math', 'date-time', 'construction', 'fun', 'education'];
  for (const cat of categories) {
    entries.push({
      url: `https://calcmaster.io/${cat}/`,
      lastmod: new Date().toISOString(),
      priority: 0.9,
      changefreq: 'weekly',
    });
  }

  // Calculator pages
  for (const calc of calculators) {
    entries.push({
      url: `https://calcmaster.io/${calc.category}/${calc.slug}/`,
      lastmod: calc.lastUpdated,
      priority: 0.8,
      changefreq: 'monthly',
    });

    // Long-tail variants
    for (const variant of calc.longTailVariants) {
      entries.push({
        url: `https://calcmaster.io/${calc.category}/${calc.slug}/${variant.slug}/`,
        lastmod: calc.lastUpdated,
        priority: 0.7,
        changefreq: 'monthly',
      });
    }
  }

  return entries;
}
