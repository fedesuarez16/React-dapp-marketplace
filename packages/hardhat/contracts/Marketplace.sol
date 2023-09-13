// SPDX-License-Identifier: MIT

// Version of Solidity compiler this program was written for
pragma solidity >=0.7.0 <0.9.0;

// Interface for the ERC20 token, in our case cUSD
interface IERC20Token {
    // Transfers tokens from one address to another
    function transfer(address, uint256) external returns (bool);

    // Approves a transfer of tokens from one address to another
    function approve(address, uint256) external returns (bool);

    // Transfers tokens from one address to another, with the permission of the first address
    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    // Returns the total supply of tokens
    function totalSupply() external view returns (uint256);

    // Returns the balance of tokens for a given address
    function balanceOf(address) external view returns (uint256);

    // Returns the amount of tokens that an address is allowed to transfer from another address
    function allowance(address, address) external view returns (uint256);

    // Event for token transfers
    event Transfer(address indexed from, address indexed to, uint256 value);
    // Event for approvals of token transfers
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

// Contract for the marketplace
contract Marketplace {
    // Keeps track of the number of products in the marketplace
    uint256 internal productsLength = 0;
    // Address of the cUSDToken
    address internal cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    // Structure for a product
    struct Product {
        // Address of the product owner
        address payable owner;
        // Name of the product
        string name;
        // Link to an image of the product
        string image;
        // Description of the product
        string description;
        // Location of the product
        string location;
        // Price of the product in tokens
        uint256 price;
        // Number of times the product has been sold
        uint256 sold;
    }

    // Define a mapping to store products with known keys (product IDs)
    mapping(uint256 => Product) public products;

    // Counter for generating unique product IDs
    uint256 public productIdCounter = 0;

    // Writes a new product to the marketplace
    function writeProduct(
        string memory _name,
        string memory _image,
        string memory _description,
        string memory _location,
        uint256 _price
    ) public {
        // Generate a unique product ID
        uint256 productId = productIdCounter++;

        // Create and store the product
        products[productId] = Product(
            payable(msg.sender),
            _name,
            _image,
            _description,
            _location,
            _price,
            0
        );
    }

    // Reads a product from the marketplace
    function readProduct(
        // Index of the product
        uint256 _index
    )
        public
        view
        returns (
            // Address of the product owner, payable because the owner can receive tokens
            address payable,
            string memory,
            string memory,
            string memory,
            string memory,
            uint256,
            uint256
        )
    {
        // Returns the details of the product
        return (
            products[_index].owner,
            products[_index].name,
            products[_index].image,
            products[_index].description,
            products[_index].location,
            products[_index].price,
            products[_index].sold
        );
    }

    function buyProduct(uint256 _index) public {
        // Ensure that the product index is valid
        require(_index < productsLength, "Invalid product index.");

        // Get the product being purchased
        Product storage product = products[_index];

        // Ensure that the buyer has enough tokens
        require(
            IERC20Token(cUsdTokenAddress).balanceOf(msg.sender) >=
                product.price,
            "Insufficient tokens to purchase the product."
        );

        // Transfer the tokens from the buyer to the seller
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                product.owner,
                product.price
            ),
            "Transfer failed."
        );

        // Increase the number of times the product has been sold
        product.sold++;
    }

    // Returns the number of products in the marketplace
    function getProductsLength() public view returns (uint256) {
        return (productsLength);
    }

    // Mapping to track favorite products for each user
    mapping(address => mapping(uint256 => bool)) private favoriteProducts;

    // Function to toggle the favorite status of a product
    function toggleFavorite(uint256 productId) public {
        require(productId < productsLength, "Invalid product ID.");
        favoriteProducts[msg.sender][productId] = !favoriteProducts[msg.sender][
            productId
        ];
    }

    // Function to check if a product is a favorite
    function isFavorite(uint256 productId) public view returns (bool) {
        require(productId < productsLength, "Invalid product ID.");
        return favoriteProducts[msg.sender][productId];
    }

    // Function to get a user's favorite products
    function getFavoriteProducts() public view returns (uint256[] memory) {
        uint256 count = 0;

        // Count the number of favorite products
        for (uint256 i = 0; i < productsLength; i++) {
            if (favoriteProducts[msg.sender][i]) {
                count++;
            }
        }

        // Gather the IDs of favorite products
        uint256[] memory productIds = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < productsLength; i++) {
            if (favoriteProducts[msg.sender][i]) {
                productIds[index] = i;
                index++;
            }
        }

        return productIds;
    }
}
