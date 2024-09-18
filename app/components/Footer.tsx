import Image from 'next/image';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-12">
      <div className="container mx-auto flex justify-between">
        <div className="w-1/3">
          <div className="flex items-center space-x-3">
            <Image src="/img/logo-blanco.png" alt="Logo ecoswap" width={40} height={40} />
            <span className="text-2xl font-semibold">EcoSwap</span>
          </div>
          <p className="mt-4 text-gray-400">
            Lorem ipsum od ohet dilogi. Bell trabel, samuligt, ohöbel utom diska. Jinesade bel när feras redorade i belogi. FAR paratyp i muvåning, och pesask vyifsat.
          </p>
          <div className="flex space-x-4 mt-6">
            <a href="#" className="text-gray-400 hover:text-white">
              <FaFacebookF />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaLinkedinIn />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className="w-1/3">
          <h3 className="text-xl font-semibold mb-4">Páginas</h3>
          <ul className="space-y-2">
            <li><a href="/" className="text-gray-400 hover:text-white">Inicio</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">Publicar Producto</a></li>
            <li><a href="/login" className="text-gray-400 hover:text-white">Inicia Sesión</a></li>
            <li><a href="/register" className="text-gray-400 hover:text-white">Registrate</a></li>
          </ul>
        </div>

        <div className="w-1/3">
          <h3 className="text-xl font-semibold mb-4">Contacto</h3>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <HiOutlinePhone className="text-gray-400" />
              <span className="text-gray-400">(406) 555-0120</span>
            </li>
            <li className="flex items-center space-x-2">
              <HiOutlineMail className="text-gray-400" />
              <span className="text-gray-400">mangcoding123@gmail.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <HiOutlineLocationMarker className="text-gray-400" />
              <span className="text-gray-400">2972 Westheimer Rd. Santa Ana, Illinois 85486</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
