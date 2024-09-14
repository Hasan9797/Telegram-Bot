export const products = [
  { id: 1, name: "Product 1", price: 100 },
  { id: 2, name: "Product 2", price: 200 },
  { id: 3, name: "Product 3", price: 300 },
];

export const getProduct = (command) => {
  const productId = parseInt(command.split(" ")[1]);
  const product = products.find((p) => p.id === productId);
  return product;
};
