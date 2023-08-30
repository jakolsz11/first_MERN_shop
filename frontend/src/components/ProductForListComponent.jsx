import { Button, Card, Row, Col } from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import { LinkContainer } from "react-router-bootstrap";

const ProductForListComponent = ({product}) => {
  return (
    <Card style={{ marginTop: "30px", marginBottom: "50px" }}>
      <Row>
        <Col lg={5}>
          <Card.Img crossOrigin="anonymous" variant="top" src={product.images[0] ? product.images[0].path : ""} />
        </Col>
        <Col lg={7}>
          <Card.Body>
            <Card.Title>{product.name}</Card.Title>
            <Card.Text>{product.description}</Card.Text>
            <Card.Text>
              <Rating readonly size={20} initialValue={product.rating} /> ({product.reviewsNumber})
            </Card.Text>
            <Card.Text className="h4">
              ${product.price}{" "}
              <LinkContainer to={`/product-details/${product._id}`}>
                <Button variant="danger">See product</Button>
              </LinkContainer>
            </Card.Text>
          </Card.Body>
        </Col>
      </Row>

    </Card>
  );
};

export default ProductForListComponent;