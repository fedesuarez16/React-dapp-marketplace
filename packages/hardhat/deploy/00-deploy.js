const { ethers, upgrades } = require("hardhat");

async function main() {
  // Deploying the Marketplace contract
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await upgrades.deployProxy(Marketplace);
  await marketplace.deployed();
  console.log("Marketplace contract deployed to:", marketplace.address);

  // Deploying the upgradeable proxy for the cUSD token (Mock for demonstration purposes)
  const MockCUSDToken = await ethers.getContractFactory("MockCUSDToken");
  const mockCUSDToken = await MockCUSDToken.deploy();
  await mockCUSDToken.deployed();
  console.log("MockCUSDToken deployed to:", mockCUSDToken.address);

  // ... (additional deployments if needed)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
