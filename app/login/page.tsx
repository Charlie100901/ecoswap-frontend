import Header from "../components/Header";

export default function Page() {
  return (
    <div className="relative flex items-center justify-center w-full h-screen bg-gray-100">
      <img
        src="/img/background-auth.jpg"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover filter brightness-[40%]"
      />

      <div className="relative z-10 max-w-md w-full bg-white rounded-lg shadow-lg p-6 mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Iniciar Sesión</h2>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-1">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder=""
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-1">Contraseña</label>
          <input
            type="password"
            id="password"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder=""
          />
        </div>

        <div className="mb-4">
          <p className="text-gray-600">¿Aún no tienes cuenta? <a href="/register" className="text-green-700 hover:underline">Regístrate</a></p>
        </div>

        <button className="w-full mt-6 bg-[#0B9710] text-white py-2 px-4 rounded-xl hover:bg-lime-800">
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
}
