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
    <div className='dark:bg-zinc-800'>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="relative w-full h-[60vh] md:h-[700px]">
          <Image
            src="/img/home.jpg"
            alt="Home Image"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[40%]"
          />

          <motion.p 
            className="absolute inset-0 flex flex-col items-center justify-center text-white text-5xl md:text-7xl z-40"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="font-bold">Intercambia lo que Tienes,</span>
            <span>Obtén lo que Necesitas</span>
          </motion.p>

          <Link href="/product">
            <button
              type="submit"
              className="absolute top-[70%] left-1/2 transform -translate-x-1/2 flex justify-center gap-2 z-40 items-center shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-green-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700  px-4 py-2 overflow-hidden border-2 rounded-full group"
            >
              Empieza a intercambiar
              <svg
                className="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
                viewBox="0 0 16 19"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                  className="fill-gray-800 group-hover:fill-gray-800"
                ></path>
              </svg>
            </button>
          </Link>

        </div>

        <motion.div 
          ref={recentProductsRef}
          className="mt-5 mb-28 w-full"
          style={{ opacity, y }}
        >
          <h2 className="text-2xl font-bold mb-2 mt-10 text-center dark:text-white">Productos Subidos Recientemente</h2>
          <div className="ml-5">
            <Product />
          </div>
        </motion.div>

      </main>
      <Footer />
    </div>
  );
}