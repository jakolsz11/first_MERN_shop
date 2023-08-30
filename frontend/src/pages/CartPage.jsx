import CartPageComponent from "./components/CartPageComponent";

import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../redux/actions/cartActions";

const CartPage = () => {

  const { cartItems, cartSubtotal } = useSelector(state => state.cart);
  const reduxDispatch = useDispatch();

  return <CartPageComponent addToCart={addToCart} removeFromCart={removeFromCart} cartItems={cartItems} cartSubtotal={cartSubtotal} reduxDispatch={reduxDispatch} />
}

export default CartPage;