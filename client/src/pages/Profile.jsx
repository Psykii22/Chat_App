import { useAuthStore } from '../store/useAuthStore';

const Profile = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <div className="mb-6">
          <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4">
            {authUser?.username?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-semibold">{authUser?.username}</h2>
          <p className="text-gray-500">{authUser?.email}</p>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;