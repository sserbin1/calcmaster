import { NextRequest, NextResponse } from 'next/server'

// Allowed domains for redirect (whitelist for security)
const ALLOWED_DOMAINS = [
  'who.int',
  'cdc.gov',
  'nih.gov',
  'ncbi.nlm.nih.gov',
  'pubmed.ncbi.nlm.nih.gov',
  'heart.org',
  'diabetes.org',
  'mayoclinic.org',
  'healthline.com',
  'webmd.com',
  'investopedia.com',
  'irs.gov',
  'sec.gov',
  'bls.gov',
  'federalreserve.gov',
  'wikipedia.org',
  'sciencedirect.com',
  'springer.com',
  'nature.com',
  'jstor.org',
  'researchgate.net',
  'aacrao.org',
  'ets.org',
  'collegeboard.org',
]

function isAllowedDomain(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return ALLOWED_DOMAINS.some(domain =>
      parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`)
    )
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json(
      { error: 'Missing url parameter' },
      { status: 400 }
    )
  }

  // Validate URL format
  let targetUrl: URL
  try {
    targetUrl = new URL(url)
  } catch {
    return NextResponse.json(
      { error: 'Invalid URL format' },
      { status: 400 }
    )
  }

  // Only allow http/https
  if (!['http:', 'https:'].includes(targetUrl.protocol)) {
    return NextResponse.json(
      { error: 'Invalid protocol' },
      { status: 400 }
    )
  }

  // Check whitelist
  if (!isAllowedDomain(url)) {
    return NextResponse.json(
      { error: 'Domain not in whitelist' },
      { status: 403 }
    )
  }

  // 301 Permanent Redirect - good for SEO
  return NextResponse.redirect(url, { status: 301 })
}
