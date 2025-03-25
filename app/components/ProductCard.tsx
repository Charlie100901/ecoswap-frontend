import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  title: string;
  description: string;
  imageProduct?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div
    key={product.id}
    className={`bg-white animate-fade-up 
      dark:hover:shadow-lg dark:hover:bg-gray-900 dark:hover:shadow-lime-400 
      dark:bg-neutral-800 border border-gray-200 rounded-lg shadow-lg p-4 
      transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl 
      opacity-0 translate-y-4 w-full sm:w-1/2 lg:w-11/12 flex flex-col justify-between min-h-[450px]`} 
  >


      
      
      <a href="#" className="flex-shrink-0">
        <Image
          className="rounded-lg max-h-[250px] min-h-[250px] w-full object-cover"
          src={product.imageProduct || "/img/default-product.jpeg"}
          alt={product.title}
          width={340}
          height={300}
          
        />
      </a>
      <div className="flex-grow">
        <h3 className="text-xl font-bold mt-4 dark:text-white uppercase">
          {product.title}
        </h3>
        <p className="text-sm text-gray-700 mt-2 dark:text-white">
          {product.description}
        </p>
      </div>
      <div className="mt-auto">
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
  );
};

export default ProductCard;
