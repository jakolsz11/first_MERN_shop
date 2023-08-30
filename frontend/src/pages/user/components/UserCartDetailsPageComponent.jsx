import {
  Container,
  Row,
  Col,
  Form,
  Alert,
  ListGroup,
  Button,
} from "react-bootstrap";
import CartItemComponent from "../../../components/CartItemComponent";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const UserCartDetailsPageComponent = ({
  cartItems,
  itemsCount,
  cartSubtotal,
  userInfo,
  addToCart,
  removeFromCart,
  reduxDispatch,
  getUser,
  createOrder
}) => {

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [userAddress, setUserAddress] = useState(false);
  const [missingData, setMissingData] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("pp");

  const changeCount = (productId, count) => {
    reduxDispatch(addToCart(productId, count));
  };

  const navigate = useNavigate();

  const removeFromCartHandler = (productId, quantity, price) => {
    if (window.confirm("Are you sure?")) {
      reduxDispatch(removeFromCart(productId, quantity, price));
    }
  };

  useEffect(() => {
    getUser().then(data => {
      if (!(data.country && data.city && data.street && data.homeNumber && data.zipCode && data.phoneNumber)) {
        setButtonDisabled(true);
        setMissingData(" In order to make order, fill out your profile with correct data");
      }
      else {
        if (data.localNumber) {
          setUserAddress({
            country: data.country,
            city: data.city,
            street: data.street,
            finalAddressNumber: `${data.homeNumber}/${data.localNumber}`,
            zipCode: data.zipCode,
            phoneNumber: data.phoneNumber
          });
        }
        else {
          setUserAddress({
            country: data.country,
            city: data.city,
            street: data.street,
            finalAddressNumber: data.homeNumber,
            zipCode: data.zipCode,
            phoneNumber: data.phoneNumber
          });
        }
      }
    }).catch(error => {
      console.log(error.response.data.message ? error.response.data.message : error.response.data);
    });
  }, [userInfo._id]);

  const orderHandler = () => {
    const orderData = {
      orderTotal: {
        itemsCount: itemsCount,
        cartSubtotal: cartSubtotal,
      },
      cartItems: cartItems.map(item => {
        return {
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: { path: item.image ? (item.image.path ?? null) : null },
          quantity: item.quantity,
          count: item.count,
        }
      }),
      paymentMethod: paymentMethod,
    };
    createOrder(orderData).then(data => {
      if(data){
        navigate(`/user/order-details/${data._id}`);
      }
    }).catch(error => {
      console.log(error);
    })
  };

  const choosePayment = (e) => {
    setPaymentMethod(e.target.value);
  }

  return (
    <Container>
      <Row className="mt-3">
        <h1>Cart Details</h1>
        <Col className="mt-3" md={8}>
          <Row className="mb-3">
            <Col md={6}>
              <h2>Shipping</h2>
              <b>Name:</b> {userInfo.name} {userInfo.lastName} <br />
              <b>Address:</b> {userAddress.country} {userAddress.city} {userAddress.street} {userAddress.finalAddressNumber} {userAddress.zipCode} <br />
              <b>Phone:</b> {userAddress.phoneNumber}
            </Col>
            <Col md={6}>
              <h2>Payment method</h2>
              <Form.Select onChange={choosePayment} value={paymentMethod}>
                <option value="pp">PayPal</option>
                <option value="cod">Cash on Delivery</option>
              </Form.Select>
            </Col>
            <Row>
              <Col>
                <Alert className="mt-3" variant="danger">
                  Not delivered.
                  {missingData}
                </Alert>
              </Col>
              <Col>
                <Alert className="mt-3" variant="danger">
                  Not paid yet
                </Alert>
              </Col>
            </Row>
          </Row>
          <h2>Order items:</h2>
          <ListGroup variant="flush">
            {cartItems.map((item, idx) => (
              <CartItemComponent
                key={idx}
                item={item}
                removeFromCartHandler={removeFromCartHandler}
                changeCount={changeCount}
              />
            ))}
          </ListGroup>
        </Col>

        <Col md={4}>
          <ListGroup>
            <ListGroup.Item>
              <h3>Order summary:</h3>
            </ListGroup.Item>

            <ListGroup.Item>
              Items price (after tax):{" "}
              <span className="fw-bold">${cartSubtotal}</span>
            </ListGroup.Item>

            <ListGroup.Item>
              Shipping: <span className="fw-bold">included</span>
            </ListGroup.Item>

            <ListGroup.Item>
              Tax: <span className="fw-bold">included</span>
            </ListGroup.Item>

            <ListGroup.Item className="text-danger">
              Total price <span className="fw-bold">${cartSubtotal}</span>
            </ListGroup.Item>

            <ListGroup.Item>
              <div className="d-grid gap-2">
                <Button size="lg" onClick={orderHandler} variant="danger" type="button" disabled={buttonDisabled}>
                  Place order
                </Button>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default UserCartDetailsPageComponent;
