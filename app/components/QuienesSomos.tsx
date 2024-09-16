export default function QuienesSomos() {
    return (
      <div className="bg-white py-12 px-6 sm:px-12 lg:px-24 m-4 rounded-lg shadow-md flex flex-col md:flex-row items-center md:items-start md:text-left text-center">
        <div className="md:w-1/3 mb-6 md:mb-0">
          <h2 className="font-extrabold text-3xl md:text-4xl text-green-700">Quiénes Somos</h2>
        </div>
        <div className="md:w-2/3">
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
            En <span className="font-semibold text-green-600">Ecoswap</span>, creemos en el poder de los intercambios justos y sostenibles. Somos una plataforma que conecta a personas de todas partes para intercambiar productos de manera segura, eficiente y sin necesidad de dinero.
            <br /><br />
            Nuestro objetivo es crear una comunidad donde cada objeto encuentre un nuevo hogar y cada usuario descubra el valor de compartir. Nos apasiona promover una economía circular, reducir el desperdicio y dar una segunda vida a los productos.
            <br /><br />
            En <span className="font-semibold text-green-600">Ecoswap</span>, cada intercambio es una oportunidad para crecer, conectar y construir un mundo más responsable y consciente. ¡Únete a nosotros y descubre una nueva forma de intercambiar!
          </p>
        </div>
      </div>
    );
  }
