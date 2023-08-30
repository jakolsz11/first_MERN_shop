import { Button } from "react-bootstrap";

const RemoveFromCartComponent = ({ productId, orderCreated, quantity, price, removeFromCartHandler = false}) => {
  return (
    <Button disabled={orderCreated} variant="secondary" type="button" onClick={removeFromCartHandler ? () => removeFromCartHandler(productId, quantity, price) : undefined} >
      <i className="bi bi-trash" ></i>
    </Button>
  )
};

export default RemoveFromCartComponent;