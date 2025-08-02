

import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard'; // adjust path if needed


const AllProducts = () => {
  const { products, searchQuery } = useContext(AppContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
console.log("Products from context:", products);

  useEffect(() => {
    if(searchQuery.length>0){
      setFilteredProducts(products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) 
      ));
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);

  return (
    <div className='mt-16 flex flex-col px-4'>
      <div className='flex flex-col items-end w-max'>
        <p className='text-2xl font-medium uppercase'>All Products</p>
        <div className='w-16 h-[2px] bg-primary rounded-full'></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-8">
        {filteredProducts.filter((product) => product.inStock).map((product, index) => (
            <ProductCard key={index} product={product}></ProductCard>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;