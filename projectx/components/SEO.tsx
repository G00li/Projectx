import Head from 'next/head'

interface SEOProps {
  title: string
  description: string
  image?: string
  url?: string
  type?: string
  author?: string
  keywords?: string
}

export default function SEO({
  title,
  description,
  image = '/logo/logo-black.svg', // usando seu logo como imagem padrão
  url = process.env.NEXT_PUBLIC_BASE_URL,
  type = 'website',
  author = 'Seu Nome',
  keywords = 'blog, posts, tecnologia'
}: SEOProps) {
  const siteTitle = `${title} | Nome do seu Site`

  return (
    <Head>
      {/* Tags Meta Básicas */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="icon" href="/logo/logo-black.svg" />
      
      {/* Open Graph */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  )
} 