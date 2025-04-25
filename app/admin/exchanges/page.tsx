"use client";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import ExchangeTable from "@/app/components/ExchangeTable";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { jwtDecode } from "jwt-decode";


export default function ExchangesPage() {
    const router = useRouter();
    
    useEffect(() => {
        const token = localStorage.getItem('token')
        console.log(token)
    
        if (!token) {
          router.push('/')
          return
        }
    
        try {
          const decoded = jwtDecode<{ role: string }>(token)
          if (decoded.role !== 'ADMIN') {
            router.push('/unauthorized')
          }
        } catch (err) {
          console.error('Invalid token:', err)
          router.push('/')
        }
      }, [router])


    return (
        <>
            <Header />
            <main className=" mx-auto px-4 py-8 dark:bg-zinc-800 min-h-96">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6  text-center animate-fade-down">
                    Gestión de Intercambios
                </h1>
                <ExchangeTable />
            </main>

            <Footer />
        </>
    );
}