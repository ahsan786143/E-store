import axios from 'axios'
import Image from 'next/image'
import React from 'react'
import ProductDetails from './ProductDetails'

const ProductPage = async ({params,searchParams }) => {
  const {slug}= await params
  const {color, size}= await searchParams

   let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/details/${slug}`
    if (color && size) {
      url += `?color=${color}&size=${size}`
    }
  
    const { data : getProduct } = await axios.get(url);

    if(!getProduct.success){
      return (
        <div className='items-center flex justify-center '>
          <Image 
            src="/assets/images/404-product.jpg"
            width={400}
            height={400}
            alt="Product Placeholder"
            title="Product Placeholder"
            
          />
          <h1
          className='text-2xl font-semibold'>Data Not Found</h1>
        </div>
      )
    } else{
      return (
        <ProductDetails  
        product={getProduct?.data?.product}
        variant={getProduct?.data?.variant}
        colors={getProduct?.data?.colors}
        sizes={getProduct?.data?.sizes}
        reviewCount={getProduct?.data?.reviewCount}
        
        />
  )
    }
   
}

export default ProductPage
 