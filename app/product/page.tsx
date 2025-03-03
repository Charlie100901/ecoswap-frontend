"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";

interface Product {
  id: number;
  title: string;
  description: string;
  imageProduct?: string;
}

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(9);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState<boolean>(false);

  const categories = [
    "Electrónica y Tecnología",
    "Hogar y Muebles",
    "Juguetes y Accesorios",
    "Libros y Entretenimiento",
    "Deportes y Aire Libre",
    "Ropa y Accesorios",
    "Mascotas",
    "Oficina y Papelería",
    "Salud y Belleza",
    "Joyería y Relojes",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const url = selectedCategory
          ? `http://localhost:8080/api/v1/product/category/${selectedCategory}?page=${page}&size=${size}`
          : `http://localhost:8080/api/v1/product?page=${page}&size=${size}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Error al cargar los productos");
        }
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, page, size]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const lastPagesToShow = 3;

    if (totalPages <= maxPagesToShow + lastPagesToShow) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 rounded ${
              i === page
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            {i + 1}
          </button>
        );
      }
    } else {
      for (let i = 0; i < maxPagesToShow; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 rounded ${
              i === page
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            {i + 1}
          </button>
        );
      }

      if (page >= maxPagesToShow && page < totalPages - lastPagesToShow) {
        pages.push(
          <span key="dots" className="px-3 py-1">
            ...
          </span>
        );
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`px-3 py-1 rounded ${
                i === page
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`}
            >
              {i + 1}
            </button>
          );
        }
        pages.push(
          <span key="dots2" className="px-3 py-1">
            ...
          </span>
        );
      } else {
        pages.push(
          <span key="dots" className="px-3 py-1">
            ...
          </span>
        );
      }

      for (let i = totalPages - lastPagesToShow; i < totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 rounded ${
              i === page
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            {i + 1}
          </button>
        );
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="dark:bg-zinc-800">
        <Header />
        <div className="container mx-auto p-4 mb-[100px] mt-6 ">
          <h1 className="text-center text-3xl font-bold mb-6  dark:text-white animate-jump-in">
            ENCUENTRA LO QUE NECESITAS
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: size }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dark:bg-zinc-800">
        <Header />
        <div className="container mx-auto p-4 mb-[100px] mt-6">
          <h1 className="text-center text-3xl font-bold mb-6 dark:text-white animate-jump-in">
            ENCUENTRA LO QUE NECESITAS
          </h1>
          <div className="text-center text-red-500">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="dark:bg-zinc-800">
      <Header />
      <div className="container mx-auto p-4 mb-[100px] mt-6">
        <h1
          className="text-center text-3xl font-bold mb-6 dark:text-white animate-jump-in
"
        >
          ENCUENTRA LO QUE NECESITAS
        </h1>

        <div className="flex flex-col md:flex-row">
          <aside className="md:w-1/4 p-4 mr-[20px] bg-white dark:bg-zinc-800 rounded-lg shadow-lg mb-4 md:mb-0 border border-gray-200 dark:border-gray-700 animate-fade-up">
            <h3
              className="font-bold text-lg mb-4 dark:text-gray-300 cursor-pointer md:hidden"
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            >
              Categorías
            </h3>
            <ul className={`space-y-2 ${isCategoriesOpen ? "block" : "hidden"} md:block`}>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setPage(0);
                  }}
                  className="text-left w-full text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded mb-2"
                >
                  Todas
                </button>
              </li>
              {categories.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setPage(0);
                    }}
                    className="text-left w-full text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded mb-2"
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <main className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setPage(page > 0 ? page - 1 : 0)}
                disabled={page === 0}
                className="bg-gray-300 text-gray-700 rounded px-4 py-2 disabled:opacity-50"
              >
                Anterior
              </button>
              <div className="flex space-x-2">{renderPagination()}</div>
              <button
                onClick={() =>
                  setPage(page < totalPages - 1 ? page + 1 : totalPages - 1)
                }
                disabled={page === totalPages - 1}
                className="bg-gray-300 text-gray-700 rounded px-4 py-2 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
