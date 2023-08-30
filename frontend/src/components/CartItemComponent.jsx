import { Row, Col, ListGroup, Image, Form, Button } from "react-bootstrap";
import RemoveFromCartComponent from "./RemoveFromCartComponent";

const CartItemComponent = ({
  item,
  orderCreated = false,
  changeCount = false,
  removeFromCartHandler = false,
}) => {
  return (
    <ListGroup.Item className="mb-2">
      <Row>
        <Col md={2}>
          <Image
            crossOrigin="anonymous"
            src={item.image ? item.image.path ?? null : null}
            fluid
          />
        </Col>

        <Col md={2}>{item.name}</Col>
        <Col md={2}>
          <b>${item.price}</b>
        </Col>

        <Col md={3}>
          <Form.Select
            value={item.quantity}
            disabled={orderCreated}
            onChange={
              changeCount
                ? (e) => changeCount(item.productId, e.target.value)
                : undefined
            }
          >
            {[...Array(item.count).keys()].map((idx) => (
              <option key={idx + 1} value={idx + 1}>
                {idx + 1}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col md={3}>
          <RemoveFromCartComponent
            orderCreated={orderCreated}
            productId={item.productId}
            quantity={item.quantity}
            price={item.price}
            removeFromCartHandler={removeFromCartHandler ? removeFromCartHandler : undefined}
          />
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

export default CartItemComponent;
