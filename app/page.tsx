"use client"
import Image from 'next/image';
import Header from './components/Header';
import QuienesSomos from './components/QuienesSomos';
import Footer from './components/Footer';
import Product from './components/Product';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="relative w-full h-[700px]">
          <Image
            src="/img/home.jpg"
            alt="Home Image"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[40%]"
          />

          <p className="absolute inset-0 flex flex-col items-center justify-center text-white text-7xl z-40">
            <span className="font-bold">Intercambia lo que Tienes,</span>
            <span>Obtén lo que Necesitas</span>
          </p>

          <button type="button" onClick={() => router.push('/product')} className="absolute top-[70%] transform -translate-x-1/2 left-1/2 text-white bg-[#109C15] hover:bg-green-700 font-semibold py-2 px-4 rounded mt-4 z-40 w-[300px] h-[60px] text-xl">Empieza a Intercambiar</button>
        </div>
        {/* <QuienesSomos/> */}

        <div className="mt-5 mb-28">
          <h2 className="text-2xl font-bold mb-2 mt-10">Productos Subidos Recientemente</h2>
          <Product />
        </div>
        
      </main>
      <Footer/>
    </div>
  );
}
