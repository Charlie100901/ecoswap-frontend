"use client";
import ExchangeTable from "@/app/components/ExchangeTable";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";

export default function ExchangesPage() {
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