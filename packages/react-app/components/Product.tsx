'use client'
/* eslint-disable @next/next/no-img-element */
// This component displays and enables the purchase of a product

// Importing the dependencies
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
// Import ethers to format the price of the product correctly
import { ethers } from "ethers";
// Import the useConnectModal hook to trigger the wallet connect modal
import { useConnectModal } from "@rainbow-me/rainbowkit";
// Import the useAccount hook to get the user's address
import { useAccount } from "wagmi";
// Import the toast library to display notifications
import { toast } from "react-toastify";
// Import our custom identicon template to display the owner of the product
import { identiconTemplate } from "@/helpers";
// Import our custom hooks to interact with the smart contract
import { useContractApprove } from "@/hooks/contract/useApprove";
import { useContractCall } from "@/hooks/contract/useContractRead";
import { useContractSend } from "@/hooks/contract/useContractWrite";
import PurchaseReceiptToast from "./PurchaseReceiptToast";
import ProductDetailModal from "./ProductDetailModal";


// Define the interface for the product, an interface is a type that describes the properties of an object
export interface Product {
  name: string;
  price: number;
  owner: string;
  image: string;
  description: string;
  location: string;
  sold: boolean;
}

// Define the Product component which takes in the id of the product and some functions to display notifications
const Product = ({ id, setError, setLoading, clear }: any) => {
  const [purchased, setPurchased] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);

    // Use the useAccount hook to store the user's address
    const { address } = useAccount();
    // Use the useContractCall hook to read the data of the product with the id passed in, from the marketplace contract
    const { data: rawProduct }: any = useContractCall("readProduct", [id], true);
    // Use the useContractSend hook to purchase the product with the id passed in, via the marketplace contract
    const { writeAsync: purchase } = useContractSend("buyProduct", [Number(id)]);

  const [product, setProduct] = useState<Product | null>(null);


  // Use the useContractApprove hook to approve the spending of the product's price, for the ERC20 cUSD contract
  const { writeAsync: approve } = useContractApprove(
    product?.price?.toString() || "0"
  );
  // Use the useConnectModal hook to trigger the wallet connect modal
  const { openConnectModal } = useConnectModal();
  // Format the product data that we read from the smart contract
  const getFormatProduct = useCallback(() => {
    if (!rawProduct) return null;
    setProduct({
      owner: rawProduct[0],
      name: rawProduct[1],
      image: rawProduct[2],
      description: rawProduct[3],
      location: rawProduct[4],
      price: Number(rawProduct[5]),
      sold: rawProduct[6].toString(),
    });
  }, [rawProduct]);

  // Call the getFormatProduct function when the rawProduct state changes
  useEffect(() => {
    getFormatProduct();
  }, [getFormatProduct]);

  // Define the handlePurchase function which handles the purchase interaction with the smart contract
  const handlePurchase = async () => {
    if (!approve || !purchase) {
      throw "Failed to purchase this product";
    }
    // Approve the spending of the product's price, for the ERC20 cUSD contract
    const approveTx = await approve();
    // Wait for the transaction to be mined, (1) is the number of confirmations we want to wait for
    await approveTx.wait(1);
    setLoading();
    // Once the transaction is mined, purchase the product via our marketplace contract buyProduct function
    const res = await purchase();
    // Wait for the transaction to be mined
    const receipt = await res.wait();
    
    if (receipt.status === 1) { // Checking the status of the receipt to decide what to do
        setPurchased(true); // Set purchased state to true after successful purchase
        setTransactionHash(res.hash); // Set the transaction hash after successful purchase
        toast.success(
            <PurchaseReceiptToast 
                productName={product?.name}
                productPrice={productPriceFromWei}
                ProductSeller={product?.owner}
                transactionHash={res.hash} 
            />, 
            {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 5000,
                hideProgressBar: true,
                closeButton: true,
                progressClassName: 'toast-progress-bar-success',
            }
        );

    } else {
        // Handle the failed transaction scenario
        throw new Error("Transaction failed");
    }
};

  // Define the purchaseProduct function that is called when the user clicks the purchase button
  const purchaseProduct = async () => {
    setLoading();
    clear();

    try {
      // If the user is not connected, trigger the wallet connect modal
      if (!address && openConnectModal) {
        openConnectModal();
        return;
      }
      // If the user is connected, call the handlePurchase function and display a notification
      await toast.promise(handlePurchase(), {
        pending: "Purchasing product...",
        success: "Product purchased successfully",
        error: "Failed to purchase product",
      });

      // If there is an error, display the error message
    } catch (e: any) {
      console.log({ e });
      // setError(e?.reason || e?.message || "Something went wrong. Try again.");
      // Once the purchase is complete, clear the loading state
    } finally {
      setLoading(null);
      clear();
    }
  };

  // If the product cannot be loaded, return null
  if (!product) return null;

  // Format the price of the product from wei to cUSD otherwise the price will be way too high
  const productPriceFromWei = ethers.utils.formatEther(
    product.price.toString()
  );

  // Return the JSX for the product component
  return (

    <div>

    <div className={"shadow-lg relative rounded-b-lg"}>
      <p className="group">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-white xl:aspect-w-7 xl:aspect-h-8 ">
          {/* Show the number of products sold */}
          <span
            className={
              "absolute z-10 right-0 mt-4 bg-amber-400 text-black p-1 rounded-l-lg px-4"
            }
          >
            {product.sold} sold
          </span>
          {/* Show the product image */}
          <img
            src={product.image}
            alt={"image"}
            className="w-full h-80 rounded-t-md  object-cover object-center group-hover:opacity-75"
          />
          {/* Show the address of the product owner as an identicon and link to the address on the Celo Explorer */}
          <Link
            href={`https://explorer.celo.org/alfajores/address/${product.owner}`}
            className={"absolute -mt-7 ml-6 h-16 w-16 rounded-full"}
          >
            {identiconTemplate(product.owner)}
          </Link>
        </div>

        <div className={"m-5"}>
          <div className={"pt-1"}>
            {/* Show the product name */}
            <p className="mt-4 text-2xl font-bold">{product.name}</p>
          
            {/* Buy button that calls the purchaseProduct function on click */}
            <button
              onClick={purchaseProduct}
              className="mt-4 h-14 w-full border-[1px] border-gray-500 text-black p-2 rounded-lg hover:bg-black hover:text-white"
            >
              {/* Show the product price in cUSD */}
              Buy for {productPriceFromWei} cUSD
            </button>

            <button
              onClick={() => setShowDetailModal(true)}
              className="mt-4 mb-4 h-14 w-full border-[1px] border-gray-500 text-black p-2 rounded-lg hover:bg-black hover:text-white"
            >
              View Details
            </button>
  
          </div>
        </div>
      </p>  
   
    </div>
    <div>
  {showDetailModal && (
    <ProductDetailModal 
      product={product}
      onClose={() => setShowDetailModal(false)}
      handlePurchase={handlePurchase} // Pass the handlePurchase function

    />
  )}
</div> 
    </div>
    
  );
};

export default  Product;