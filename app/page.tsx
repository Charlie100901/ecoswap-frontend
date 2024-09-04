"use client"
import Image from 'next/image';
import Header from './components/Header';
import QuienesSomos from './components/QuienesSomos';
import Footer from './components/Footer';

export default function Home() {

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

          <p className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold z-40">
            Intercambia lo que Tienes, Obtén lo que Necesitas
          </p>
          <button className="absolute top-[60%] transform -translate-x-1/2 left-1/2 text-white bg-lime-700 hover:bg-green-700 font-semibold py-2 px-4 rounded mt-4 z-40">Empieza a Intercambiar</button>
        </div>
        <QuienesSomos/>
        
      </main>
      <Footer/>
    </div>
  );
}
