import { useEffect, useState } from 'react';

const ProductInventory = (Base_url) => {


  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${Base_url}/list`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setMessage('Failed to fetch products.',error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${Base_url}/delete/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setMessage('Product deleted!');
        fetchProducts();
      } else {
        setMessage('Failed to delete product.');
      }
    } catch (error) {
      setMessage('Error connecting to server.',error);
    }
  };

  useEffect(() => {
    fetchProducts();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="mb-4 text-lg font-bold">Product Inventory</h2>
      <table className="w-full border-collapse table-auto">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">Stock</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b">
              <td className="p-2">{product.name}</td>
              <td className="p-2">{product.price}</td>
              <td className="p-2">{product.stock}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
    </div>
  );
};

export default ProductInventory;
