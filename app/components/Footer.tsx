import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-900 text-zinc-100 py-12 px-4 md:px-6">
      <div className="container mx-auto grid gap-8 lg:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Image
            src="/img/logo-blanco.png"
            alt="EcoSwap Logo"
            width={50}
            height={40}
            className="mb-4"
          />
          <p className="text-zinc-300 text-sm leading-relaxed">
            En EcoSwap, creemos en un mundo donde la sostenibilidad y la comunidad van de la mano. Nuestra plataforma
            proporciona un espacio en línea para que las personas intercambien artículos de manera fácil, segura y
            respetuosa con el medio ambiente.
          </p>
          <div className="flex gap-4 pt-4">
            <Link href="#" className="text-zinc-300 hover:text-green-400 transition-colors">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-zinc-300 hover:text-green-400 transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="text-zinc-300 hover:text-green-400 transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Páginas</h3>
          <nav className="flex flex-col space-y-3">
            <Link href="/" className="text-zinc-300 hover:text-green-400 transition-colors">
              Inicio
            </Link>
            <Link href="/productos" className="text-zinc-300 hover:text-green-400 transition-colors">
              Ver Productos
            </Link>
            <Link href="/publicar" className="text-zinc-300 hover:text-green-400 transition-colors">
              Publicar Producto
            </Link>
            <Link href="/sobre-nosotros" className="text-zinc-300 hover:text-green-400 transition-colors">
              Sobre Nosotros
            </Link>
            <Link href="/blog" className="text-zinc-300 hover:text-green-400 transition-colors">
              Blog
            </Link>
          </nav>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contacto</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-zinc-300">
              <Phone className="h-4 w-4" />
              <span>(406) 555-0120</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <Mail className="h-4 w-4" />
              <span>ecoswap@gmail.com</span>
            </div>
            <div className="flex items-start gap-2 text-zinc-300">
              <MapPin className="h-4 w-4 mt-1" />
              <span>2972 Westheimer Rd. Santa Ana, Illinois 85486</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Suscríbete al Newsletter</h3>
          <p className="text-zinc-300 text-sm">Recibe las últimas noticias sobre sostenibilidad y nuevos productos.</p>
          <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Suscribirse
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto mt-12 pt-6 border-t border-zinc-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-400">
          <p>© 2025 EcoSwap. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="/privacidad" className="hover:text-green-400 transition-colors">
              Política de Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-green-400 transition-colors">
              Términos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

