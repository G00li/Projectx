import Head from 'next/head'

interface SEOProps {
  title: string
  description: string
  image?: string
  url?: string
  type?: string
  author?: string
  keywords?: string
  canonical?: string
  publishedTime?: string
  modifiedTime?: string
}

export default function SEO({
  title,
  description,
  image = '/logo/logo-black.svg',
  url = process.env.NEXT_PUBLIC_BASE_URL,
  type = 'website',
  author = 'Seu Nome',
  keywords = 'blog, posts, tecnologia',
  canonical,
  publishedTime,
  modifiedTime
}: SEOProps) {
  const siteTitle = `${title} | Nome do seu Site`
  const canonicalUrl = canonical || url

  return (
    <Head>
      {/* Tags Meta Básicas */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta name="robots" content="index, follow" />
      <link rel="icon" href="/logo/logo-black.svg" />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Gooli" />
      <meta property="og:locale" content="pt_PT" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@seutwitter" />
      
      {/* Datas */}
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      
      {/* Internacionalização */}
      <link rel="alternate" hrefLang="pt-PT" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />
      
      {/* Preconnect para recursos externos */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Head>
  )
} 