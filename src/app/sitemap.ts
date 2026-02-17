import type { MetadataRoute } from 'next'
import { getAllCalculatorPaths, categories } from '@/data/calculators'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://calcmaster.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const calculatorPaths = getAllCalculatorPaths()

  const calculatorUrls: MetadataRoute.Sitemap = calculatorPaths.map(({ category, slug }) => ({
    url: `${BASE_URL}/${category}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const categoryUrls: MetadataRoute.Sitemap = Object.keys(categories).map(category => ({
    url: `${BASE_URL}/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
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
  ]
}
