'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const BemVindo = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      <div className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 sm:p-6 lg:p-8 shadow-xl">
          {/* Seção Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              Showcase de Projetos Dev
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto">
              A plataforma ideal para desenvolvedores compartilharem seus projetos, 
              descobrirem novas ideias e conectarem-se com outros profissionais da área
            </p>
          </motion.div>

          {/* Cards de Recursos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#1e1e1e] p-6 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white/90 mb-2 text-center">Compartilhe Conquistas</h2>
              <p className="text-white/60 text-center">
                Documente e apresente seus projetos de desenvolvimento com detalhes técnicos, 
                links para repositórios e níveis de complexidade
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#1e1e1e] p-6 rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="h-12 w-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white/90 mb-2 text-center">Explore Inovações</h2>
              <p className="text-white/60 text-center">
                Descubra projetos inspiradores, acompanhe o trabalho de outros desenvolvedores 
                e encontre referências para seus próximos desafios
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-[#1e1e1e] p-6 rounded-xl border border-gray-800 hover:border-green-500/50 transition-all duration-300"
            >
              <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white/90 mb-2 text-center">Impulsione seu Networking</h2>
              <p className="text-white/60 text-center">
                Receba feedback da comunidade, ganhe visibilidade para seus projetos 
                e construa conexões profissionais valiosas
              </p>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-8 border border-white/5"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white/90 mb-4">
              Pronto para mostrar seus projetos ao mundo?
            </h2>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Junte-se a uma comunidade de desenvolvedores, compartilhe seu portfólio 
              e descubra projetos inspiradores. Crie sua conta agora e comece a destacar 
              seu trabalho!
            </p>
            <Link href="/api/auth/signin">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium 
                hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg shadow-blue-500/20">
                Começar Agora
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BemVindo; 