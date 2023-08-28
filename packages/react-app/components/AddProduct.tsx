// This component is used to render the AddProductModal component

// Importing the AddProductModal component
import AddProductModal from "./AddProductModal";

// Define the AddProduct component
const AddProduct = () => {
    return (
        <div className="flex justify-start">
            {/* Render the AddProductModal component */}
            <AddProductModal />
        </div>
    );
};

export default AddProduct;