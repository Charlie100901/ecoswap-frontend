"use client";

const CategoriesAside = ({ categories, selectedCategory, onCategorySelect }) => {
  return (
    <aside className="md:w-1/4 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg mb-4 md:mb-0 animate-fade-up border border-gray-100 dark:border-zinc-700">
      <h3 className="font-bold text-xl mb-6 dark:text-gray-200 border-b pb-4 dark:border-zinc-700">
        Categorías
      </h3>
      <div className="space-y-2">
        <button
          onClick={() => onCategorySelect(null)}
          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
            selectedCategory === null
              ? "bg-blue-500 text-white font-medium shadow-md"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
          }`}
        >
          📦 Todas las categorías
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
              selectedCategory === category
                ? "bg-blue-500 text-white font-medium shadow-md"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
            }`}
          >
            <span>{getCategoryIcon(category)}</span>
            <span>{category}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

// Función auxiliar para obtener el ícono según la categoría
const getCategoryIcon = (category) => {
  const icons = {
    "Electrónica y Tecnología": "💻",
    "Hogar y Muebles": "🏠",
    "Juguetes y Accesorios": "🎮",
    "Libros y Entretenimiento": "📚",
    "Deportes y Aire Libre": "⚽",
    "Ropa y Accesorios": "👕",
    "Mascotas": "🐾",
    "Oficina y Papelería": "📝",
    "Salud y Belleza": "💄",
    "Joyería y Relojes": "💍"
  };
  return icons[category] || "•";
};

export default CategoriesAside;