import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage = () => {
    return (
        <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            <Header />

            <main className="max-w-5xl mx-auto px-6 py-16">
                <section className="text-center">
                    <h1 className="text-5xl font-extrabold text-green-600 dark:text-green-400 mb-4">
                        Sobre Nosotros
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Conectando personas para un futuro sostenible a través del intercambio responsable.
                    </p>
                </section>

                <section className="mt-12 grid md:grid-cols-2 gap-12 items-center">
                    <div className="flex justify-center hover:scale-105 transition-transform duration-300 ">
                        
                        <img
                            src="/img/EcoTeam.png"
                            alt="Equipo EcoSwap"
                            className="rounded-2xl shadow-xl w-full max-w-sm md:max-w-full"
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300 mb-4">
                            Nuestra Misión
                        </h2>
                        <p className="text-lg leading-relaxed">
                            EcoSwap es una plataforma dedicada a fomentar el intercambio sostenible de productos. 
                            Buscamos reducir el desperdicio y promover un estilo de vida ecológico conectando a personas 
                            interesadas en reutilizar y reciclar artículos de forma responsable.
                        </p>

                        <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300 mt-8 mb-4">
                            Nuestro Equipo
                        </h2>
                        <p className="text-lg leading-relaxed">
                            Formado por apasionados del medio ambiente y la tecnología, nuestro equipo está comprometido 
                            con el desarrollo de soluciones innovadoras para un futuro más verde. Creemos en el poder de 
                            la comunidad para generar un impacto positivo.
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;
