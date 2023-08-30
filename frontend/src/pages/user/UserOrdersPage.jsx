import UserOrdersPageComponent from "./components/UserOrdersPageComponent";
import axios from "axios";
import { useSelector } from "react-redux";

const getOrders = async () => {
  const { data } = await axios.get("/api/orders");
  return data;
};

const UserOrdersPage = () => {

  const {userInfo} = useSelector(state => state.userRegisterLogin);

  return <UserOrdersPageComponent getOrders={getOrders} userInfo={userInfo} />
}

export default UserOrdersPage;