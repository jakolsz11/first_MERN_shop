import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";
import { LinkContainer } from "react-router-bootstrap";
import { useState, useEffect } from "react";

import { logout } from "../../../redux/actions/userActions";
import { useDispatch } from "react-redux";

const ProductsPageComponent = ({fetchProducts, deleteProduct}) => {

  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [productDeleted, setProductDeleted] = useState(false);

  useEffect(() => {
    const abctrl = new AbortController();
    fetchProducts(abctrl).then(res => setProducts(res)).catch(error => {
      dispatch(logout());
      // setProducts([{name: error.response.data.message ? error.response.data.message : error.response.data}]);
    });

    return () => abctrl.abort();
  }, [productDeleted]);

  const deleteHandler = async (productId) => {
    if(window.confirm("Are you sure?")){
      const data = await deleteProduct(productId);
      if(data.message === "product removed"){
        setProductDeleted(!productDeleted);
      }
    };
  };

  return (
    <Container>
      <Row className="mt-5">

        <Col md={2}>
          <AdminLinksComponent />
        </Col>

        <Col md={10}>
          <h1>
            Product list{" "}
            <LinkContainer to="/admin/create-new-product">
              <Button variant="primary" size="lg">
                Create new
              </Button>
            </LinkContainer>
          </h1>


          <Table striped bordered hover responsive variant="dark">
            <thead>
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Edit/Delete</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>
                    <LinkContainer to={`/admin/edit-product/${product._id}`}>
                      <Button className="btn-sm">
                        <i className="bi bi-pencil-square"></i>
                      </Button>
                    </LinkContainer>
                    {" / "}
                    <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(product._id)}>
                      <i className="bi bi-x-circle"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

      </Row>
    </Container>

  )
};

export default ProductsPageComponent;