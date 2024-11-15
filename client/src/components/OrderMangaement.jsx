import { useState } from 'react';

const OrderManagement = (Base_url) => {


  const [order, setOrder] = useState({ productId: '', status: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${Base_url}/orders/place-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      if (response.ok) {
        setMessage('Order created successfully!');
        setOrder({ productId: '', status: '' });
      } else {
        setMessage('Failed to create order.');
      }
    } catch (error) {
      setMessage('Error connecting to server.', error);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="mb-4 text-lg font-bold">Order Management</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="productId"
          placeholder="Product ID"
          value={order.productId}
          onChange={(e) => setOrder({ ...order, productId: e.target.value })}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="text"
          name="status"
          placeholder="Order Status"
          value={order.quantity}
          onChange={(e) => setOrder({ ...order, status: e.target.value })}
          className="w-full px-4 py-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
          Create Order
        </button>
      </form>
      {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
    </div>
  );
};

export default OrderManagement;
