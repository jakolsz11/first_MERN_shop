import {
  Container,
  Row,
  Col,
  Image,
  ListGroup,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import AddedToCartMessageComponent from "../../components/AddedToCartMessageComponent";
import ImageZoom from "js-image-zoom";
import { useEffect, useState, useRef } from "react";

import { useParams } from "react-router-dom";

const ProductDetailsPageComponent = ({
  addToCartReduxAction,
  reduxDispatch,
  getProductDetails,
  userInfo,
  writeReviewApiRequest
}) => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [showCartMessage, setShowCartMesage] = useState(false);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [productReviewed, setProductReviewed] = useState(false);

  const messagesEndRef = useRef(null);

  const addToCartHandler = () => {
    reduxDispatch(addToCartReduxAction(id, quantity));
    setShowCartMesage(true);
  };

  useEffect(() => {
    if(productReviewed){
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({behavior: "smooth"});
      })
    }
  }, [productReviewed]);

  useEffect(() => {
    if (product.images) {
      var options = {
        scale: 2,
        offset: { vertical: 0, horizontal: 0 },
      };

      product.images.map(
        (image, idx) =>
          new ImageZoom(document.getElementById(`imageId${idx + 1}`), options)
      );
    }
  });

  useEffect(() => {
    getProductDetails(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(
          error.response.data.message
            ? error.response.data.message
            : error.response.data
        );
      });
  }, [id, productReviewed]);

  const sendReviewHandler = (e) => {
    e.preventDefault();
    const form = e.currentTarget.elements;
    const formInputs = {
      comment: form.comment.value,
      rating: form.rating.value,
    };

    if (e.currentTarget.checkValidity() === true) {
      writeReviewApiRequest(product._id, formInputs).then(data => {
        if(data === "review created"){
          setProductReviewed("You successfully reviewed the product!")
        }
      }).catch(error => {
        setProductReviewed(error.response.data.message ? error.response.data.message : error.response.data);
      })
    }
  };

  return (
    <Container>
      <AddedToCartMessageComponent
        showCartMessage={showCartMessage}
        setShowCartMesage={setShowCartMesage}
      />
      <Row className="mt-5">
        {loading ? (
          <h2>Loading product details ...</h2>
        ) : error ? (
          <h2>{error}</h2>
        ) : (
          <>
            <Col md={4} style={{ zIndex: 1 }}>
              {product.images
                ? product.images.map((image, idx) => (
                    <div key={idx}>
                      <div key={idx} id={`imageId${idx + 1}`}>
                        <Image
                          crossOrigin="anonymous"
                          fluid
                          src={`${image.path ?? null}`}
                        />
                      </div>
                      <br />
                    </div>
                  ))
                : null}
            </Col>

            <Col md={8}>
              <Row>
                <Col md={8}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <h1>{product.name}</h1>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Rating
                        readonly
                        size={20}
                        initialValue={product.rating}
                      />{" "}
                      ({product.reviewsNumber})
                    </ListGroup.Item>

                    <ListGroup.Item>
                      Price: <span className="fw-bold">${product.price}</span>
                    </ListGroup.Item>

                    <ListGroup.Item>{product.description}</ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={4}>
                  <ListGroup>
                    <ListGroup.Item>
                      Status:{" "}
                      <span className="fw-bold">
                        {product.count > 0 ? "in stock" : "out of stock"}
                      </span>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      Price: <span className="fw-bold">${product.price}</span>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      Quantity:
                      <Form.Select
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        size="lg"
                        aria-label="Default select example"
                      >
                        {[...Array(product.count).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Select>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Button variant="danger" onClick={addToCartHandler}>
                        Add to cart
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
              <Row>
                <Col className="mt-5">
                  <h5>REVIEWS:</h5>
                  <ListGroup variant="flush">
                    {product.reviews &&
                      product.reviews.map((review, idx) => (
                        <ListGroup.Item key={idx}>
                          {review.user.name}
                          <br />
                          <Rating
                            readonly
                            size={20}
                            initialValue={review.rating}
                          />
                          <br />
                          {review.createdAt.substring(0, 10)}
                          <br />
                          {review.comment}
                        </ListGroup.Item>
                      ))}
                    <div ref={messagesEndRef} />
                  </ListGroup>
                </Col>
              </Row>

              <hr />

              {!userInfo.name && (
                <Alert variant="danger">Login first to write a review</Alert>
              )}

              <Form onSubmit={sendReviewHandler}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleFormControlTextarea"
                >
                  <Form.Label>Write a review</Form.Label>
                  <Form.Control
                    name="comment"
                    required
                    as="textarea"
                    rows={3}
                    disabled={!userInfo.name}
                  />
                </Form.Group>
                <Form.Select
                  name="rating"
                  required
                  aria-label="Default select example"
                  disabled={!userInfo.name}
                >
                  <option value="">Your rating</option>
                  <option value="5">5 (very good)</option>
                  <option value="4">4 (good)</option>
                  <option value="3">3 (average)</option>
                  <option value="2">2 (bad)</option>
                  <option value="1">1 (awful)</option>
                </Form.Select>
                <Button
                  disabled={!userInfo.name}
                  className="mb-3 mt-3"
                  variant="primary"
                  type="submit"
                >
                  Submit
                </Button>
                {productReviewed}
              </Form>
            </Col>
          </>
        )}
      </Row>
    </Container>
  );
};

export default ProductDetailsPageComponent;
