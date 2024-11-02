'use client';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Header from './components/Header';
import Footer from './components/Footer';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Product {
  id: number; 
  title: string;
  description: string;
  imageProduct?: string; 
}

export default function Home() {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const recentProductsRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: recentProductsRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [50, 0, 0, 50]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('http://localhost:8080/api/v1/product/recent');
        const data: Product[] = await response.json();
        setRecentProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    fetchProducts();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        }
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        }
      }
    ]
  };

  return (
    <div className="dark:bg-zinc-800">
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
                />
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
          <Slider {...settings} className="max-w-[1300px] flex mx-auto">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <div key={product.id} className="p-4">
                  <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                    <Link href={`/product/${product.id}`}>
                      <Image 
                        className="w-full max-h-[250px] min-h-[250px]" 
                        src={product.imageProduct || '/img/placeholder.png'} 
                        alt={product.title} 
                        width={340}
                        height={300}
                      />
                    </Link>
                    <div className="p-5">
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white transition-all duration-300 ease-in-out hover:text-blue-700">
                        {product.title}
                      </h5>
                      <p className="mb-3 font-normal text-[#4F3527] dark:text-gray-400">
                        {product.description}
                      </p>
                      <Link 
                        href={`/product/${product.id}`} 
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-800 hover:translate-x-1 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Más información
                        <svg 
                          className="rtl:rotate-180 w-3.5 h-3.5 ms-2 transition-transform duration-300 ease-in-out hover:translate-x-1" 
                          aria-hidden="true" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 14 10"
                        >
                          <path 
                            stroke="currentColor" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M1 5h12m0 0L9 1m4 4L9 9" 
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No hay productos recientes disponibles.</p>
            )}
          </Slider>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
