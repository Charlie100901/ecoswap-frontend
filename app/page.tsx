"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "./components/ProductCard";

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
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [50, 0, 0, 50]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/product/recent"
        );
        const data: Product[] = await response.json();
        setRecentProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "0px",
        },
      },
    ],
  };

  return (
    <div className="dark:bg-zinc-800 min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh]">
          <Image
            src="/img/home.jpg"
            alt="Home Image"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[40%]"
          />

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4">
              <span className="block">Intercambia lo que Tienes,</span>
              <span className="block">Obtén lo que Necesitas</span>
            </h1>
            <Link href="/product">
              <button
                type="button"
                className="flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg bg-gray-50 text-gray-800 hover:text-white px-4 py-2 rounded-full transition-all duration-300 hover:bg-green-500 group"
              >
                Empieza a intercambiar
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:rotate-90 transition-transform duration-300"
                  viewBox="0 0 16 19"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                    className="fill-current"
                  />
                </svg>
              </button>
            </Link>
          </motion.div>
        </div>

        <div className="py-10 px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center dark:text-white animate-fade-up">
            Productos Subidos Recientemente
          </h2>
          <div
            ref={recentProductsRef}
            className="max-w-7xl mx-auto sm:overflow-visible overflow-hidden"
          >
            <motion.div style={{ opacity, y }}>
              <Slider {...settings} className="mx-auto slider-fix">
                {recentProducts.length > 0 ? (
                  recentProducts.map((product) => (
                    <div key={product.id} className="px-2 slider-item">
                      <ProductCard product={product} />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    No hay productos recientes disponibles.
                  </p>
                )}
              </Slider>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
