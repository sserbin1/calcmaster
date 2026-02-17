import type { MetadataRoute } from 'next'
import { getAllCalculatorPaths, categories } from '@/data/calculators'
import { getAllStateCalculatorPaths, getAllStateSlugs } from '@/data/states'
import { initPromise as stateInitPromise } from '@/data/state-calculators'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://calcmaster.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await stateInitPromise

  // Generic calculators
  const calculatorPaths = getAllCalculatorPaths()
  const calculatorUrls: MetadataRoute.Sitemap = calculatorPaths.map(({ category, slug }) => ({
    url: `${BASE_URL}/${category}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // Category pages
  const categoryUrls: MetadataRoute.Sitemap = Object.keys(categories).map(category => ({
    url: `${BASE_URL}/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // State landing pages
  const stateSlugs = getAllStateSlugs()
  const stateLandingUrls: MetadataRoute.Sitemap = stateSlugs.map(stateSlug => ({
    url: `${BASE_URL}/state/${stateSlug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // State calculator pages
  const stateCalcPaths = getAllStateCalculatorPaths()
  const stateCalcUrls: MetadataRoute.Sitemap = stateCalcPaths.map(({ category, slug }) => ({
    url: `${BASE_URL}/${category}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...categoryUrls,
    ...calculatorUrls,
    ...stateLandingUrls,
    ...stateCalcUrls,
  ]
}
