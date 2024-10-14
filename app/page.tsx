"use client";
import Image from 'next/image';
import Header from './components/Header';
import QuienesSomos from './components/QuienesSomos';
import Footer from './components/Footer';
import Product from './components/Product';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Home() {
  const recentProductsRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: recentProductsRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [50, 0, 0, 50]);

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

          <motion.p 
            className="absolute inset-0 flex flex-col items-center justify-center text-white text-7xl z-40"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="font-bold">Intercambia lo que Tienes,</span>
            <span>Obtén lo que Necesitas</span>
          </motion.p>

          {/* <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          > */}
            <Link href="/product">
              <button className="absolute top-[450px] transform -translate-x-1/2 left-1/2 text-white bg-lime-700 hover:bg-green-700 font-semibold py-2 px-4 rounded mt-4 z-40 transition duration-300 ease-in-out hover:scale-105">
                Empieza a Intercambiar
              </button>
            </Link>
          {/* </motion.div> */}
        </div>

        <motion.div 
          ref={recentProductsRef}
          className="mt-5 mb-28 w-full"
          style={{ opacity, y }}
        >
          <h2 className="text-2xl font-bold mb-2 mt-10 text-center">Productos Subidos Recientemente</h2>
          <div className="ml-5">
            <Product />
          </div>
        </motion.div>

      </main>
      <Footer />
    </div>
  );
}
