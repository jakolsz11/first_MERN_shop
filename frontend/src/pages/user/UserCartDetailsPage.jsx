import UserCartDetailsPageComponent from "./components/UserCartDetailsPageComponent";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/actions/cartActions";

import axios from "axios";

const UserCartDetailsPage = () => {

  const { cartItems, itemsCount, cartSubtotal } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.userRegisterLogin);

  const reduxDispatch = useDispatch();

  const getUser = async () => {
    const { data } = await axios.get(`/api/users/profile/${userInfo._id}`);
    return data;
  };

  const createOrder = async (orderData) => {
    const { data } = await axios.post("/api/orders", {...orderData});
    return data;
  };

  return (
    <UserCartDetailsPageComponent
      cartItems={cartItems}
      itemsCount={itemsCount}
      cartSubtotal={cartSubtotal}
      userInfo={userInfo}
      addToCart={addToCart}
      removeFromCart={removeFromCart}
      reduxDispatch={reduxDispatch}
      getUser={getUser}
      createOrder={createOrder}
    />
  );
};

export default UserCartDetailsPage;
