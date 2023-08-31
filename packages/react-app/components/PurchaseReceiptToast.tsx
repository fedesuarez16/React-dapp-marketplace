import React from 'react';

// Importing Address from 'viem' (this seems to be unused in the provided code, so you might want to check if it's needed)
import { Address } from 'viem';

// Define the props interface for the component
interface PurchaseReceiptProps {
  productName: string;       
  productPrice: number;      
  productSeller: string;    
  transactionHash: string;   
}

const PurchaseReceiptToast = ({ 
  productName, 
  productPrice, 
  ProductSeller,  
  transactionHash 
}: any) => {    
  return (
    <div>
      {/* Display product information and transaction details */}
      
      {/* Display the product name */}
      <p>Product Name: {productName}</p>
      
      {/* Display the product price */}
      <p>Product Price: {productPrice} cUSD</p>
      
      {/* Display the product seller */}
      <p>product seller: {ProductSeller} </p>
      
      {/* Display the blockchain transaction hash */}
      <p>Transaction Hash: {transactionHash}</p>
    </div>
  );
};

export default PurchaseReceiptToast;
