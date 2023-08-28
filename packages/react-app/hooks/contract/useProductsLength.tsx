// Import the necessary dependencies
import { useContractRead } from 'wagmi';

// Import the Marketplace ABI(Interface)
import MarketplaceInstance from '../../abi/Marketplace.json';

// Create a custom hook to read the length of products on the marketplace
export const useProductsLength = () => {
  // Use the useContractRead hook to read the length of products
  const { data, isLoading } = useContractRead({
    address: MarketplaceInstance.address as `0x${string}`,
    abi: MarketplaceInstance.abi,
    functionName: 'getProductsLength',
    args: [],
    onError: (err) => {
      console.log({ err });
    },
  });

  // Return the data and isLoading flag
  return { productsLength: data?.toString(), isLoading };
};
