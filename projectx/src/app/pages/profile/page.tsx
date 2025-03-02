"use client";

import { useSession } from "next-auth/react";
import AuthWrapper from "@/components/AuthWrapper";
import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const { data: session, status } = useSession();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    image: "",
    birthDate: "",
    address: "",
    github: "",
    linkedin: "",
  });

  useEffect(() => {
    if (session?.user) {
      setUserData({
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || "",
        birthDate: "",
        address: "",
        github: "",
        linkedin: "",
      });
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      await axios.put("/api/profile/put/", userData);
      alert("Perfil atualizado com sucesso!");
  
      const { data } = await axios.get(`/api/profile/get?email=${userData.email}`);
      setUserData(data);
  
    } catch (error) {
      console.error("Erro ao atualizar perfil", error);
      alert("Ocorreu um erro ao atualizar o perfil.");
    }
  };
  
  if (status === "loading") {
    return <p>Carregando...</p>; 
  }

  return (
    <AuthWrapper>
      <h1 className="text-3xl font-semibold mb-6">Página do Perfil</h1>

      {session?.user ? (
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Foto de perfil */}
            <div className="flex justify-center">
              <img
                src={userData.image || "/icon/profile-icon.svg"}
                alt="Foto de perfil"
                className="w-32 h-32 object-cover rounded-full border-4 border-gray-300"
              />
            </div>

            {/* Campos de formulário */}
            <div>
              <label htmlFor="name" className="block text-lg font-medium">
                Nome:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-medium">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                disabled
              />
            </div>

            <div>
              <label htmlFor="birthDate" className="block text-lg font-medium">
                Data de Nascimento:
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={userData.birthDate}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-lg font-medium">
                Endereço:
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={userData.address}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="github" className="block text-lg font-medium">
                GitHub:
              </label>
              <input
                type="text"
                id="github"
                name="github"
                value={userData.github}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="linkedin" className="block text-lg font-medium">
                LinkedIn:
              </label>
              <input
                type="text"
                id="linkedin"
                name="linkedin"
                value={userData.linkedin}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Atualizar Perfil
              </button>
            </div>
          </form>
        </div>
      ) : (
        <p className="mt-6 text-xl text-gray-600">Por favor, faça login para ver seu perfil.</p>
      )}
    </AuthWrapper>
  );
};

export default Profile;
