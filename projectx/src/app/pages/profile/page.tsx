"use client";

import { useSession } from "next-auth/react";
import AuthWrapper from "@/components/AuthWrapper";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import toast, {Toaster} from "react-hot-toast";


const Profile = () => {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    image: "",
    birthDate: "",
    address: "",
    github: "",
    linkedin: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (status==="authenticated" && session?.user?.email) {
        try {
          const { data } = await axios.get(`/api/profile/get?email=${session.user.email}`);
          const formattedDate = data.birthDate ? new Date(data.birthDate).toISOString().split("T")[0] : "";
          setUserData({
            name: data.name || "",
            email: session.user.email,
            image: data.image || "/icon/profile-icon.svg",
            birthDate: formattedDate || "",
            address: data.address || "",
            github: data.github || "",
            linkedin: data.linkedin || "",
          });
        } catch (error) {
          console.error("Erro ao buscar perfil", error);
        }
      }
    };  
    fetchUserProfile();
  }, [status, session]);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") return; 

    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await toast.promise(
        axios.put("/api/profile/put/", userData),
        {
          loading: 'Atualizando perfil...',
          success: 'Perfil atualizado com sucesso! 🎉',
          error: 'Erro ao atualizar perfil 😕',
        }
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (status === "loading") {
    return <p>Atualizando perfil...</p>; 
  }

  return (
    <AuthWrapper>
      <Toaster position="top-center"/>
      <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white/90 tracking-tight">Bem vindo, {session?.user?.name}</h1>
            {session?.user && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium 
                hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                transition-all duration-200"
              >
                Editar Perfil
              </button>
            )}
          </div>

          {session?.user ? (
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Foto de perfil com novo estilo */}
                <div className="flex justify-center mb-8">
                  <div className="relative group">
                    <Image
                      src={userData.image || "/icon/profile-icon.svg"}
                      alt="Foto de perfil"
                      className="w-36 h-36 object-cover rounded-full border-4 border-blue-500/30 transition-all duration-300 group-hover:border-blue-500"
                      width={144}
                      height={144}
                    />
                    <div className="absolute inset-0 rounded-full bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Grid para campos do formulário */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Campo Nome */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-white/80 flex items-center gap-2">
                      Nome
                      <Image
                        src="/icon/profile/name-icon.svg"
                        alt="Nome"
                        width={16}
                        height={16}
                        className="inline-block text-white/80"
                      />
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg transition-all duration-200 text-white
                        ${isEditing 
                          ? 'bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'bg-gray-800/50 border border-gray-700 cursor-not-allowed opacity-75'}`}
                      placeholder="Seu nome completo"
                      readOnly={!isEditing}
                    />
                  </div>

                  {/* Campo Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-white/80 flex items-center gap-2">
                      Email
                      <Image
                        src="/icon/profile/email-icon.svg"
                        alt="Email"
                        width={16}
                        height={16}
                        className="inline-block text-white/80"
                      />
                    </label>

                    {/* Campo Email */}
                    <div className="relative group">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white/50 cursor-not-allowed pr-10"
                        disabled
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Image
                          src="/icon/profile/lock-icon.svg"
                          alt="Bloqueado"
                          width={20}
                          height={20}
                          className="opacity-50"
                        />
                      </div>
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        Não é possível alterar o email de acesso
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                      </div>
                    </div>
                  </div>

                  {/* Campo Data de Nascimento */}
                  <div className="space-y-2">
                    <label htmlFor="birthDate" className="text-sm font-medium text-white/80 flex items-center gap-2">
                      Data de Nascimento
                      <Image
                        src="/icon/profile/calendar-icon.svg"
                        alt="Calendário"
                        width={16}
                        height={16}
                        className="inline-block text-white/80"
                      />
                    </label>
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={userData.birthDate}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg transition-all duration-200 text-white [color-scheme:dark]
                        ${isEditing 
                          ? 'bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'bg-gray-800/50 border border-gray-700 cursor-not-allowed opacity-75'}`}
                      readOnly={!isEditing}
                    />
                  </div>

                  {/* Campo Endereço */}
                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium text-white/80 flex items-center gap-2">
                      Endereço
                      <Image
                        src="/icon/profile/address-icon.svg"
                        alt="Endereço"
                        width={16}
                        height={16}
                        className="inline-block text-white/80"
                      />
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={userData.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg transition-all duration-200 text-white
                        ${isEditing 
                          ? 'bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'bg-gray-800/50 border border-gray-700 cursor-not-allowed opacity-75'}`}
                      placeholder="Seu endereço"
                      readOnly={!isEditing}
                    />
                  </div>

                  {/* Campo GitHub */}
                  <div className="space-y-2">
                    <label htmlFor="github" className="text-sm font-medium text-white/80 flex items-center gap-2">
                      GitHub
                      <Image
                        src="/icon/profile/github-icon.svg"
                        alt="GitHub"
                        width={16}
                        height={16}
                        className="inline-block text-white/80"
                      />
                    </label>
                    <input
                      type="text"
                      id="github"
                      name="github"
                      value={userData.github}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg transition-all duration-200 text-white
                        ${isEditing 
                          ? 'bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'bg-gray-800/50 border border-gray-700 cursor-not-allowed opacity-75'}`}
                      placeholder="Seu perfil do GitHub"
                      readOnly={!isEditing}
                    />
                  </div>

                  {/* Campo LinkedIn */}
                  <div className="space-y-2">
                    <label htmlFor="linkedin" className="text-sm font-medium text-white/80 flex items-center gap-2">
                      LinkedIn
                      <Image
                        src="/icon/profile/linkedin-icon.svg"
                        alt="LinkedIn"
                        width={16}
                        height={16}
                        className="inline-block text-white/80"
                      />
                    </label>
                    <input
                      type="text"
                      id="linkedin"
                      name="linkedin"
                      value={userData.linkedin}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg transition-all duration-200 text-white
                        ${isEditing 
                          ? 'bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'bg-gray-800/50 border border-gray-700 cursor-not-allowed opacity-75'}`}
                      placeholder="Seu perfil do LinkedIn"
                      readOnly={!isEditing}
                    />
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="mt-8 flex justify-center gap-4">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-8 py-3 bg-gray-500 text-white rounded-lg font-medium 
                      hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 
                      transition-all duration-200 min-w-[200px]"
                    >
                      Cancelar
                    </button>
                  )}
                  
                  {isEditing && (
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium 
                      hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                      disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-w-[200px]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center space-x-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                          <span>Salvando...</span>
                        </span>
                      ) : (
                        "Salvar Alterações"
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <p className="text-center text-xl text-white/60">Por favor, faça login para ver seu perfil.</p>
          )}
        </div>
      </div>
    </AuthWrapper>
  );
};

export default Profile;
