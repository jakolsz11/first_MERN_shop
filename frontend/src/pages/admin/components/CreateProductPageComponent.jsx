import {
  Container,
  Row,
  Col,
  Form,
  Table,
  CloseButton,
  Alert,
  Image,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { Fragment, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { changeCategory, setValuesForAttrFromDbSelectForm, setAttributesTableWrapper } from "./utils/utils";

const onHover = {
  cursor: "pointer",
  position: "absolute",
  left: "5px",
  top: "-10px",
  transform: "scale(2.7)",
};

const CreateProductPageComponent = ({
  createProductApiRequest,
  uploadImagesApiRequest,
  uploadImagesCloudinaryApiRequest,
  categories,
  reduxDispatch,
  newCategory,
  deleteCategory,
  saveAttributeToCatDoc
}) => {

  const [validated, setValidated] = useState(false);
  const [attributesTable, setAttributesTable] = useState([]);
  const [attributesFromDb, setAttributesFromDb] = useState([]);
  const [images, setImages] = useState(false);
  const [isCreating, setIsCreating] = useState("");
  const [createProductResponseState, setCreateProductResponseState] = useState({
    success: "",
    error: "",
  });
  const [categoryChoosen, setCategoryChoosen] = useState("Choose category");

  const [newAttrKey, setNewAttrKey] = useState(false);
  const [newAttrValue, setNewAttrValue] = useState(false);

  const attrVal = useRef(null);
  const attrKey = useRef(null);
  const createNewAttrKey = useRef(null);
  const createNewAttrVal = useRef(null);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget.elements;

    const formInputs = {
      name: form.name.value,
      description: form.description.value,
      count: form.count.value,
      price: form.price.value,
      category: form.category.value,
      attributesTable: attributesTable,
    };

    if (event.currentTarget.checkValidity() === true) {
      if (images.length > 5) {
        setIsCreating("Too many files");
        return
      }
      createProductApiRequest(formInputs)
        .then((data) => {
          if (images) {
            if (process.env.NODE_ENV !== "production") { // to do: change to !==
              uploadImagesApiRequest(images, data.productId)
                .then((res) => { })
                .catch((error) => {
                  setIsCreating(
                    error.response.data.message
                      ? error.response.data.message
                      : error.response.data
                  );
                });
            } else {
              uploadImagesCloudinaryApiRequest(images, data.productId);
            }
          }
          if (data.message === "product created") navigate("/admin/products");
        })
        .catch((error) => {
          setCreateProductResponseState({
            error: error.response.data.message
              ? error.response.data.message
              : error.response.data,
          });
        });
    }

    setValidated(true);
  };

  const uploadHandler = (images) => {
    setImages(images);
  };

  const newCategoryHandler = (e) => {
    if (e.keyCode && e.keyCode === 13 && e.target.value) {
      reduxDispatch(newCategory(e.target.value));
      setTimeout(() => {
        let element = document.getElementById("cats");
        setCategoryChoosen(e.target.value);
        element.value = e.target.value;
        e.target.value = "";
      }, 500);

    }
  };

  const deleteCategoryHandler = () => {
    let element = document.getElementById("cats");
    reduxDispatch(deleteCategory(element.value));
    setCategoryChoosen("Choose category");
  };

  const attributeValueSelected = (e) => {
    if(e.target.value !== "Choose attribute value"){
      setAttributesTableWrapper(attrKey.current.value, e.target.value, setAttributesTable);
    }
  };

  const deleteAttribute = (key) => {
    setAttributesTable((table) => table.filter((item) => item.key !== key));
  };

  const newAttrKeyHandler = (e) => {
    e.preventDefault();
    setNewAttrKey(e.target.value);
    addNewAttributeManually(e);
  };

  const newAttrValueHandler = (e) => {
    e.preventDefault();
    setNewAttrValue(e.target.value);
    addNewAttributeManually(e);
  };

  const addNewAttributeManually = (e) => {
    if(e.keyCode && e.keyCode === 13){
      if(newAttrKey && newAttrValue){
        reduxDispatch(saveAttributeToCatDoc(newAttrKey, newAttrValue, categoryChoosen));
        setAttributesTableWrapper(newAttrKey, newAttrValue, setAttributesTable);
        e.target.value = "";
        createNewAttrKey.current.value = "";
        createNewAttrVal.current.value = "";
        setNewAttrKey(false);
        setNewAttrValue(false);
      }
    }
  };

  const checkKeyDown = (e) => {
    if(e.code === "Enter") e.preventDefault();
  };

  return (
    <Container>
      <Row className="mt-5 justify-content-md-center">
        <Col md={1}>
          <Link to="/admin/products" className="btn btn-info my-3">
            Go back
          </Link>
        </Col>

        <Col md={6}>
          <h1>Create a new product</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit} onKeyDown={(e) => checkKeyDown(e)}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                name="name"
                type="text"
                placeholder="Enter a product name"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                required
                name="description"
                as="textarea"
                rows={3}
                placeholder="Write a description"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCount">
              <Form.Label>Count in stock</Form.Label>
              <Form.Control
                required
                name="count"
                type="number"
                placeholder="Enter product count"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                required
                name="price"
                type="text"
                placeholder="Enter product price"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCategory">
              <Form.Label>
                Category
                <CloseButton onClick={deleteCategoryHandler} />(<small>remove selected</small>)
              </Form.Label>
              <Form.Select
                id="cats"
                required
                name="category"
                aria-label="Default select example"
                onChange={(e) => changeCategory(e, categories, setAttributesFromDb, setCategoryChoosen)}
              >
                <option value="Choose category">Choose category</option>
                {categories.map((category, idx) => {
                  return (
                    <option value={category.name} key={idx}>
                      {category.name}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicNewCategory">
              <Form.Label>
                Or create a new category (e.g Computers/Laptops/Acer){" "}
              </Form.Label>
              <Form.Control name="newCategory" type="text" onKeyUp={newCategoryHandler} />
            </Form.Group>

            {attributesFromDb.length > 0 && (
              <Row className="mt-3">
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formBasicAttributes">
                    <Form.Label>Choose attribute and set value</Form.Label>
                    <Form.Select
                      name="attrKey"
                      aria-label="Default select example"
                      ref={attrKey}
                      onChange={(e) => setValuesForAttrFromDbSelectForm(e, attrVal,attributesFromDb)}
                    >
                      <option>Choose attribute</option>
                      {attributesFromDb.map((item, idx) => (
                        <Fragment key={idx}>
                          <option value={item.key}>{item.key}</option>
                        </Fragment>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group
                    className="mb-3"
                    controlId="formBasicAttributeValue"
                  >
                    <Form.Label>Attribute value</Form.Label>
                    <Form.Select
                      onChange={attributeValueSelected}
                      name="attrVal"
                      aria-label="Default select example"
                      ref={attrVal}
                    >
                      <option>Choose attribute value</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Row>
              {attributesTable.length > 0 && (
                <Table hover>
                  <thead>
                    <tr>
                      <th>Attribute</th>
                      <th>Value</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attributesTable.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.key}</td>
                        <td>{item.value}</td>
                        <td>
                          <CloseButton onClick={() => deleteAttribute(item.key)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicNewAttribute">
                  <Form.Label>Create new attribute</Form.Label>
                  <Form.Control
                    ref={createNewAttrKey}
                    disabled={["", "Choose category"].includes(categoryChoosen)}
                    placeholder="first choose or create category"
                    name="newAttrKey"
                    type="text"
                    required={newAttrValue}
                    onKeyUp={newAttrKeyHandler}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group
                  className="mb-3"
                  controlId="formBasicNewAttributeValue"
                >
                  <Form.Label>Attribute value</Form.Label>
                  <Form.Control
                    ref={createNewAttrVal}
                    disabled={["", "Choose category"].includes(categoryChoosen)}
                    placeholder="first choose or create category"
                    name="newAttrValue"
                    type="text"
                    required={newAttrKey}
                    onKeyUp={newAttrValueHandler}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Alert show={newAttrKey && newAttrValue} variant="primary">
              After typing attribute and value press enter on one of the field
            </Alert>

            <Form.Group className="mb-3 mt-3" controlId="formFileMultiple">
              <Form.Label>Images</Form.Label>

              <Form.Control
                required
                multiple
                type="file"
                className="mt-3"
                onChange={(e) => uploadHandler(e.target.files)}
              />
              {isCreating}
            </Form.Group>

            <Button type="submit" variant="primary">
              Create
            </Button>
            {createProductResponseState.error ?? ""}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateProductPageComponent;
