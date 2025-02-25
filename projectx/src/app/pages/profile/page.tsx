import ProtectedRoute from "@/components/ProtectedRoute";

const ProfilePage = () => {
  return (
    <ProtectedRoute>
      <div className="text-white">
        <h1>Perfil do Usuário</h1>
        <p>Informações do perfil...</p>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
