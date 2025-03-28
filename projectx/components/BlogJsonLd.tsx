interface Post {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  image?: string;
  author: {
    name: string;
    image?: string;
  };
  language?: string;
  stars?: number;
  repoUrl?: string;
}

export default function BlogJsonLd({ post }: { post: Post }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      ...(post.author.image && { "image": post.author.image })
    },
    "datePublished": post.createdAt,
    ...(post.updatedAt && { "dateModified": post.updatedAt }),
    ...(post.image && { "image": post.image }),
    "publisher": {
      "@type": "Organization",
      "name": "Gooli",
      "logo": {
        "@type": "ImageObject",
        "url": "https://gooli.pt/logo/logo-black.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://gooli.pt/post/${post.id}`
    },
    ...(post.language && { "inLanguage": post.language }),
    ...(post.stars && { "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": post.stars,
      "bestRating": "5",
      "worstRating": "1"
    }}),
    ...(post.repoUrl && { "codeRepository": post.repoUrl })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd)
      }}
    />
  );
} 