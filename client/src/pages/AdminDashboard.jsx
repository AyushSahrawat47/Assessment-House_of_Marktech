import{ useState } from 'react';
import ProductForm from '../components/ProductForm';
import ProductInventory from '../components/ProductInventory';
import OrderManagement from '../components/OrderMangaement';


const AdminDashboard = () => {
    const [productListUpdated, setProductListUpdated] = useState(false);

    const Base_url = import.meta.env.BASE_URL

    const handleProductAdded = () => {
        // This function will be called after a product is added or updated
        setProductListUpdated(!productListUpdated);
      };

  return (
    <div>
      <ProductForm onProductAdded={handleProductAdded} Base_url={Base_url}/>
      <ProductInventory Base_url={Base_url}/>
      <OrderManagement Base_url={Base_url}/>
    </div>
  )
}

export default AdminDashboard
