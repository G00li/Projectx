import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import SEO from '@/components/SEO/SEO'

export default async function HomePage() {
  const session = await getServerSession();
  
  if (session) {
    redirect('/viewAllPost');
  } else {
    redirect('/bemVindo');
  }

  return (
    <>
      <SEO 
        title="Página Inicial"
        description="Explore os melhores posts e conteúdos sobre tecnologia e desenvolvimento"
        keywords="blog, tecnologia, desenvolvimento, programação"
      />
    </>
  )
}
