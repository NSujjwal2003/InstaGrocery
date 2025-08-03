import React, { useContext } from 'react'
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const ProductCategory = () => {
    const { products } = useContext(AppContext);
    const {category} = useParams(); // Assuming you are using react-router-dom to get the category from the URL
   
    // Find the category object based on the category path
    const searchCategory =  categories.find((item)=> item.path.toLowerCase() === category);

    // If no category found, return null or handle it as needed
    const filteredProducts = products.filter((product) => product.category.toLowerCase() === category);

  return (
    <div className='mt-16'>
      {
        searchCategory &&(
      <div className='flex flex-col items-end w-max '>
        <p className='text-2xl font-medium'>{searchCategory.text.toUpperCase()}</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'>

        </div>
      </div>

        )}
        {
          filteredProducts.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6'>
            {/* maps and dispays all the products with index as key and product as prop */}
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className='text-center text-gray-500 mt-10'>No products found in this category.</p>
          )
        }
      
    </div>
  )
}

export default ProductCategory