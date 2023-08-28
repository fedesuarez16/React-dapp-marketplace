import React from 'react';
import { Address } from 'viem';

interface PurchaseReceiptProps {
  productName: string;
  productPrice: number;
  productSeller: string;
  transactionHash: string;
}
const PurchaseReceiptToast = ({ productName, productPrice, ProductSeller, transactionHash }: any) => {
  return (
    <div>
      {/* Display the product name, price, and transaction hash */}
      <p>Product Name: {productName}</p>
      <p>Product Price: {productPrice} cUSD</p>
      <p>product seller: {ProductSeller} </p>
      <p>Transaction Hash: {transactionHash}</p>
    </div>
  );
};


export default PurchaseReceiptToast;
