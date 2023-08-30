import OrdersPageComponent from "./components/OrdersPageComponent";
import axios from "axios";

const fetchOrders = async () => {
  const { data } = await axios.get("/api/orders/admin");
  return data;
};

const AdminOrdersPage = () => {
 return <OrdersPageComponent fetchOrders={fetchOrders} />
};

export default AdminOrdersPage;
