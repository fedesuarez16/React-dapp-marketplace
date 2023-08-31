import React from 'react';
import { useState } from 'react';
import { Product } from './Product';
import { ethers } from 'ethers';

// Define the props interface for the component
interface ModalProps {
  product: Product; // The product to display in the modal
  onClose: () => void; // Function to close the modal
  handlePurchase: () => Promise<void>; // Function to handle the purchase action
}

// ProductDetailModal component
const ProductDetailModal = ({ product, onClose, handlePurchase }: ModalProps) => {
  // Format the product price from wei to cUSD
  const productPriceFromWei = ethers.utils.formatEther(product.price.toString());

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Background overlay */}
      <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        {/* Modal content */}
        <div className="inline-block w-full max-w-5xl px-8 pt-5 pb-6 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:w-full sm:p-6">
          <div className="flex h-96">
            {/* Product image */}
            <img src={product.image} alt={product.name} className="w-1/2 h-full object-cover rounded-lg shadow-md" />
            
            <div className="ml-6 w-1/2">
              {/* Product details */}
              <h3 className="text-2xl font-semibold text-gray-900">{product.name}</h3>
              <p className="mt-4 text-sm text-gray-600">{product.description}</p>
              <p className="mt-3 font-semibold text-lg">{`${productPriceFromWei} cUSD`}</p>
              <p className="mt-1 text-gray-700">{`Location: ${product.location}`}</p>

              {/* Purchase button */}
              <button
                onClick={handlePurchase}
                className="mt-4 h-14 w-full border-[1px] border-gray-500 text-black p-2 rounded-lg hover:bg-black hover:text-white"
              >
                Buy for {ethers.utils.formatEther(product.price.toString())} cUSD
              </button>

              {/* Close button */}
              <div className="mt-6">
                <button
                  type="button"
                  className=" h-14 w-full border-[1px] border-gray-500 text-black p-2 rounded-lg hover:bg-gray-300 hover:text-white"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;
