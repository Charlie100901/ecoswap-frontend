"use client"
import Image from 'next/image';
import Header from './components/Header';
import { useEffect, useState } from 'react';

export default function Home() {
  const fullText = "Intercambia lo que Tienes, Obtén lo que Necesitas";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText((prev) => prev + fullText.charAt(index)); // Usar charAt para evitar undefined
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100); // Ajusta la velocidad de la animación aquí

    return () => clearInterval(interval);
  }, []); // Dependencia de fullText

  return (
    <div>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="relative w-full h-[700px]">
          {/* Imagen de fondo */}
          <Image
            src="/img/home.jpg"
            alt="Home Image"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[40%]"
          />

          <p className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold z-50">
            {displayedText}
          </p>
        </div>
      </main>
    </div>
  );
}
