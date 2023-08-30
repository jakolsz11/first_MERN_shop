import OrderDetailsPageComponent from "./components/OrderDetailsPageComponent";
import axios from "axios";

const fetchOrder = async (orderId) => {
  const { data } = await axios.get(`/api/orders/user/${orderId}`);
  return data;
};

const markAsDelivered = async (orderId) => {
  const { data } = await axios.put(`/api/orders/delivered/${orderId}`);
  if(data){
    return data;
  }
};

const AdminOrderDetailsPage = () => {
  return <OrderDetailsPageComponent fetchOrder={fetchOrder} markAsDelivered={markAsDelivered} />
};

export default AdminOrderDetailsPage;