"use client"

import { useSession } from "next-auth/react";
import Link from "next/link";

const TermsPage = () => {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-xl p-8">
        {/* Cabeçalho */}
        <div className="border-b border-gray-700 pb-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Termos e Condições</h1>
          <p className="text-gray-400">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        {/* Conteúdo */}
        <div className="space-y-8 text-gray-300">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar nossa plataforma, você concorda em cumprir e estar vinculado a estes Termos e Condições.
              Se você não concordar com qualquer parte destes termos, não poderá acessar o serviço.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">2. Contas de Usuário</h2>
            <p>
              Para utilizar nossos serviços, é necessário criar uma conta através de autenticação via GitHub ou Google.
              Você é responsável por manter a confidencialidade de sua conta e por todas as atividades que ocorrem nela.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">3. Conteúdo do Usuário</h2>
            <p>
              Ao publicar conteúdo em nossa plataforma, você garante que:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Possui todos os direitos necessários sobre o conteúdo compartilhado</li>
              <li>O conteúdo não viola direitos de terceiros</li>
              <li>O conteúdo não é ilegal, ofensivo ou prejudicial</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">4. Privacidade</h2>
            <p>
              Respeitamos sua privacidade e protegemos seus dados pessoais de acordo com nossa Política de Privacidade.
              Utilizamos apenas serviços confiáveis para autenticação (GitHub e Google).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">5. Limitação de Responsabilidade</h2>
            <p>
              Não nos responsabilizamos por quaisquer danos diretos, indiretos, incidentais ou consequenciais
              resultantes do uso ou impossibilidade de uso de nossos serviços.
            </p>
          </section>
        </div>

        {/* Rodapé */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              Para dúvidas ou esclarecimentos, entre em contato conosco.
            </p>
            <Link 
              href="/"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage; 