// This component is used to display all the products in the marketplace

// Importing the dependencies
import { useState } from "react";
import { useEffect } from "react";
// Import the useContractCall hook to read how many products are in the marketplace via the contract
import { useContractCall } from "@/hooks/contract/useContractRead";
// Import the Product and Alert components
import Product from "./Product";
import ErrorAlert from "@/components/alerts/ErrorAlert";
import LoadingAlert from "@/components/alerts/LoadingAlert";
import SuccessAlert from "@/components/alerts/SuccessAlert";
import { useProductsLength } from '@/hooks/contract/useProductsLength';
import { useAccount, useBalance } from "wagmi";
// Import the erc20 contract abi to get the cUSD balance
import erc20Instance from "../abi/erc20.json";



// Define the ProductList component
const ProductList = () => {
    // Use the useContractCall hook to read how many products are in the marketplace contract
    const { data } = useContractCall("getProductsLength", [], true);
    // Convert the data to a number
    const productLength = data ? Number(data.toString()) : 0;
    // Define the states to store the error, success and loading messages
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState("");  
      // Use the useProductsLength hook to get the length of products
    const { productsLength, isLoading: productsLengthLoading } = useProductsLength();

    const [displayBalance, setDisplayBalance] = useState(false);

    // Get the user's address and balance
    const { address, isConnected } = useAccount();
    const { data: cusdBalance } = useBalance({
      address,
      token: erc20Instance.address as `0x${string}`,
    });
    
 
    // Define a function to clear the error, success and loading states
    const clear = () => {
      setError("");
      setSuccess("");
      setLoading("");
    };
    // Define a function to return the products
    const getProducts = () => {
      // If there are no products, return null
      if (!productLength) return null;
      const products = [];

      // Loop through the products, return the Product component and push it to the products array
      for (let i = 0; i < productLength; i++) {
        products.push(
          <Product
            key={i}
            product={products} // Pass the whole product data
            id={i}
            setSuccess={setSuccess}
            setError={setError}
            setLoading={setLoading}
            loading={loading}
            clear={clear}    
            
          />         
        );       
      }  
      
      return products
    };   

  return (
    <div>
    
      {/* If there is an alert, display it */}

      {error && <ErrorAlert message={error} clear={clear} />}
      {success && <SuccessAlert message={success} />}
      {loading && <LoadingAlert message={loading} />}

      
      {/* Display the products */}

      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
           {/* Display the user's cUSD balance */}
           {displayBalance && (
                <span
                  className="inline-block text-dark ml-4 px-6 py-2.5 font-medium text-md leading-tight rounded-2xl shadow-none "
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModalCenter"
                >
                  Balance: {Number(cusdBalance?.formatted || 0).toFixed(2)} cUSD
                </span>
              )}

        <h2 className="sr-only">Products</h2>
          <div className="mb-4 text-center border border-gray-400 rounded p-4">
            {/* display the products counter */}
            <p className="text-lg text-gray-600">
            {productsLengthLoading ? (
            <span>Loading products...</span>
                ) : (
                  <span>Total products: {productsLength} </span>
               )}
          </p>
      </div>
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {/* Loop through the products and return the Product component */}
          {getProducts()}
        </div>
      </div>
        
    
    </div>
  );
};

export default ProductList;