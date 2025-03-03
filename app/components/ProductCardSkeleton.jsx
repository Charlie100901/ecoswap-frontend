import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div
      className={`bg-white animate-fade-up 
        dark:bg-neutral-800 border border-gray-200 rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out 
        opacity-0 translate-y-4 w-full sm:w-1/2 lg:w-11/12 flex flex-col justify-between`}
    >
      <div className="flex-shrink-0 bg-gray-300 dark:bg-gray-700 rounded-lg max-h-[250px] min-h-[250px] w-full"></div>
      <div className="flex-grow mt-4">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
      <div className="mt-auto">
        <div className="inline-flex items-center px-3 py-2 text-sm font-medium text-center bg-gray-300 dark:bg-gray-700 rounded-lg w-32"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;