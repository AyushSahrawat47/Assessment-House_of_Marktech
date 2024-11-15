import { useState } from 'react';

const ProductForm = (onProductAdded, Base_url ) => {

  const [product, setProduct] = useState({ name: '', price: '', stock: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = product.id ? `${Base_url}/update/${product.id}` : `${Base_url}/create`;
    const method = product.id ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (response.ok) {
        setMessage('Product saved successfully!');
        setProduct({ name: '', price: '', stock: '' });
        onProductAdded();
      } else {
        setMessage('Failed to save product.');
      }
    } catch (error) {
      setMessage('Error connecting to server.',error);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="mb-4 text-lg font-bold">{product.id ? 'Edit Product' : 'Add Product'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Product Price"
          value={product.price}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          value={product.stock}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
          Save Product
        </button>
      </form>
      {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
    </div>
  );
};

export default ProductForm;
