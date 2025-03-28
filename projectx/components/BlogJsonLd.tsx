interface Post {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  image?: string;
  author: {
    name: string;
  };
}

export default function BlogJsonLd({ post }: { post: Post }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.description,
          "author": {
            "@type": "Person",
            "name": post.author.name
          },
          "datePublished": post.createdAt,
          "image": post.image
        })
      }}
    />
  )
} 