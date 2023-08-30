import * as actionTypes from "../constants/cartConstants";
import axios from "axios";

export const addToCart = (productId, quantity) => async (dispatch, getState) => {

  const { data } = await axios.get(`/api/products/get-one/${productId}`);
  dispatch({
    type: actionTypes.ADD_TO_CART,
    payload: {
      productId: data._id,
      name: data.name,
      price: data.price,
      image: data.images[0] ?? null,
      count: data.count,
      quantity: quantity
    }
  });

  localStorage.setItem("cart", JSON.stringify(getState().cart.cartItems));

};


export const removeFromCart = (productId, quantity, price) => async (dispatch, getState) => {
  dispatch({
    type: actionTypes.REMOVE_FROM_CART,
    payload: {
      productId: productId,
      quantity: quantity,
      price: price
    }
  });
  localStorage.setItem("cart", JSON.stringify(getState().cart.cartItems));
}