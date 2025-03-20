"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao buscar usuários');
        }

        setUsers(data);
      } catch (error) {
        console.error('Erro na busca:', error);
        setError(error.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Image
                src="/icon/sidebar/search-icon.svg"
                alt="Pesquisar"
                width={20}
                height={20}
                className="text-gray-400"
              />
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => (
          <div
            key={user.id}
            className="bg-gray-800 rounded-xl p-4 flex items-start space-x-4 hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="flex-shrink-0 w-12 h-12 relative rounded-full overflow-hidden">
              <Image
                src={user.image || '/placeholder-user.jpg'}
                alt={user.name || 'Usuário'}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-medium truncate">
                {user.name || 'Usuário sem nome'}
              </h3>
              <p className="text-gray-400 text-sm truncate">
                {user.email}
              </p>
            </div>
          </div>
        ))}
        
        {users.length === 0 && !loading && !error && searchTerm && (
          <div className="col-span-full text-center text-gray-400 py-8">
            Nenhum usuário encontrado
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSearch; 