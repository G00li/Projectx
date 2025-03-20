import UserSearch from '@/components/UserSearch';

export const metadata = {
  title: 'Pesquisar Usuários',
  description: 'Pesquise e encontre usuários na plataforma',
};

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto">
        <h1 className="text-xl font-bold text-white mb-8 px-6">Pesquisar Usuários</h1>
        <UserSearch />
      </div>
    </main>
  );
} 