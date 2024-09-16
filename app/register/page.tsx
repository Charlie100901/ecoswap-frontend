

export default function Page() {
    return (
      <div className="relative flex items-center justify-center w-full h-screen bg-gray-100">
      {/* Imagen de fondo */}
      <img
        src="/img/background-auth.jpg"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover filter brightness-[40%]"
      />

      {/* Contenedor para el formulario */}
      <div className="relative z-10 max-w-md w-full bg-white rounded-lg shadow-lg p-6 mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Registrate</h2>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-1">Nombre Completo</label>
          <input
            type="text"
            id="name"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder=""
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-1">Correo Electrónico</label>
          <input
            type="text"
            id="email"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder=""
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-1">Dirección</label>
          <input
            type="text"
            id="address"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder=""
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-1">Teléfono</label>
          <input
            type="number"
            id="cellphone"
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
          <p className="text-gray-600">¿Aún no tienes cuenta? <a href="#" className="text-green-700 hover:underline">Regístrate</a></p>
        </div>

        <button className="w-full mt-6 bg-lime-600 text-white py-2 px-4 rounded-lg hover:bg-lime-800">
          Iniciar Sesión
        </button>
      </div>
    </div>
    );
  }