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
import { Fragment, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { changeCategory, setValuesForAttrFromDbSelectForm, setAttributesTableWrapper } from "./utils/utils";

const onHover = {
  cursor: "pointer",
  position: "absolute",
  left: "5px",
  top: "-10px",
  transform: "scale(2.7)",
};

const EditProductPageComponent = ({
  categories,
  fetchProduct,
  updateProductApiRequest,
  reduxDispatch,
  saveAttributeToCatDoc,
  imageDeleteHandler,
  uploadImagesApiRequest,
  uploadImagesCloudinaryApiRequest,
}) => {
  const [validated, setValidated] = useState(false);
  const [product, setProduct] = useState({});
  const [updateProductResponseState, setUpdateProductResponseState] = useState({
    success: "",
    error: "",
  });
  const [attributesFromDb, setAttributesFromDb] = useState([]);
  const [attributesTable, setAttributesTable] = useState([]);
  const [categoryChoosen, setCategoryChoosen] = useState("Choose category");
  const [newAttrKey, setNewAttrKey] = useState(false);
  const [newAttrValue, setNewAttrValue] = useState(false);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [isUploading, setIsUploading] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);

  const attrVal = useRef(null);
  const attrKey = useRef(null);
  const createNewAttrKey = useRef(null);
  const createNewAttrVal = useRef(null);



  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct(id)
      .then((product) => {
        setProduct(product);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id, imageRemoved, imageUploaded]);

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
      updateProductApiRequest(id, formInputs)
        .then((data) => {
          if (data.message === "product updated") {
            navigate("/admin/products");
          }
        })
        .catch((error) => {
          setUpdateProductResponseState({
            error: error.response.data.message
              ? error.response.data.message
              : error.response.data,
          });
        });
    }

    setValidated(true);
  };

  useEffect(() => {
    let categoryOfEditedProduct = categories.find(
      (item) => item.name === product.category
    );
    if (categoryOfEditedProduct) {
      const mainCategoryOfEditedProduct =
        categoryOfEditedProduct.name.split("/")[0];
      const mainCategoryOfEditedProductAllData = categories.find(
        (categoryOfEditedProduct) =>
          categoryOfEditedProduct.name === mainCategoryOfEditedProduct
      );
      if (
        mainCategoryOfEditedProductAllData &&
        mainCategoryOfEditedProductAllData.attrs.length > 0
      ) {
        setAttributesFromDb(mainCategoryOfEditedProductAllData.attrs);
      }
    }
    setCategoryChoosen(product.category);
    setAttributesTable(product.attrs);
  }, [product]);

  const attributeValueSelected = (e) => {
    if (e.target.value !== "Choose attribute value") {
      setAttributesTableWrapper(attrKey.current.value, e.target.value, setAttributesTable);
    }
  };

  const deleteAttribute = (key) => {
    setAttributesTable((table) => table.filter((item) => item.key !== key));
  };

  const checkKeyDown = (e) => {
    if (e.code === "Enter") {
      e.preventDefault();
    }
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
    if (e.keyCode && e.keyCode === 13) {
      if (newAttrKey && newAttrValue) {
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

  return (
    <Container>
      <Row className="mt-5 justify-content-md-center">
        <Col md={1}>
          <Link to="/admin/products" className="btn btn-info my-3">
            Go back
          </Link>
        </Col>

        <Col md={6}>
          <h1>Edit product</h1>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            onKeyDown={(e) => checkKeyDown(e)}
          >
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                name="name"
                type="text"
                defaultValue={product.name}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                required
                name="description"
                as="textarea"
                rows={3}
                defaultValue={product.description}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCount">
              <Form.Label>Count in stock</Form.Label>
              <Form.Control
                required
                name="count"
                type="number"
                defaultValue={product.count}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                required
                name="price"
                type="text"
                defaultValue={product.price}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCategory">
              <Form.Label>Category</Form.Label>
              <Form.Select
                required
                name="category"
                aria-label="Default select example"
                onChange={(e) => changeCategory(e, categories, setAttributesFromDb, setCategoryChoosen)}
              >
                <option value="Choose category">Choose category</option>
                {categories.map((category, idx) => {
                  return product.category === category.name ? (
                    <option selected value={category.name} key={idx}>
                      {category.name}
                    </option>
                  ) : (
                    <option value={category.name} key={idx}>
                      {category.name}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>

            {attributesFromDb.length > 0 && (
              <Row className="mt-5">
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formBasicAttributes">
                    <Form.Label>Choose attribute and set value</Form.Label>
                    <Form.Select
                      name="attrKey"
                      aria-label="Default select example"
                      ref={attrKey}
                      onChange={(e) => setValuesForAttrFromDbSelectForm(e, attrVal, attributesFromDb)}
                    >
                      <option value="Choose attribute">Choose attribute</option>
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
                      name="attrVal"
                      aria-label="Default select example"
                      ref={attrVal}
                      onChange={attributeValueSelected}
                    >
                      <option>Choose attribute value</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Row>
              {attributesTable && attributesTable.length > 0 && (
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
                          <CloseButton
                            onClick={() => deleteAttribute(item.key)}
                          />
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
                    disabled={categoryChoosen === "Choose category"}
                    placeholder="First choose or create category"
                    name="newAttrKey"
                    type="text"
                    onKeyUp={newAttrKeyHandler}
                    required={newAttrValue}
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
                    disabled={categoryChoosen === "Choose category"}
                    placeholder="First choose or create category"
                    name="newAttrValue"
                    type="text"
                    onKeyUp={newAttrValueHandler}
                    required={newAttrKey}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Alert variant="primary" show={newAttrKey && newAttrValue}>
              After typing attribute and value press enter on one of the field
            </Alert>

            <Form.Group className="mb-3 mt-3" controlId="formFileMultiple">
              <Form.Label>Images</Form.Label>
              <Row>
                {product.images &&
                  product.images.map((image, idx) => (
                    <Col key={idx} style={{ position: "relative" }} xs={3}>
                      <Image
                        crossOrigin="anonymous"
                        src={image.path ?? null}
                        fluid
                      />
                      <i style={onHover} onClick={() => {
                        imageDeleteHandler(image.path, id).then(data => setImageRemoved(!imageRemoved))
                      }} className="bi bi-x text-danger"></i>
                    </Col>
                  ))}
              </Row>

              <Form.Control required multiple type="file" className="mt-3" onChange={e => {
                setIsUploading("Upload files in progress...");
                if(process.env.NODE_ENV !== "production"){ // to do: change to !==
                  uploadImagesApiRequest(e.target.files, id).then(data => {
                    setIsUploading("Upload file completed");
                    setImageUploaded(!imageUploaded);
                  }).catch(error => {
                    setIsUploading(error.response.data.message ? error.response.data.message : error.response.data);
                  })
                }
                else{
                  uploadImagesCloudinaryApiRequest(e.target.files, id);
                  setIsUploading("Upload files completed. Wait for the result take effect, refresh also if neccassary");
                  setTimeout(() => {
                    setImageUploaded(!imageUploaded);
                  }, 5000);
                }
              }} />
              {isUploading}
            </Form.Group>

            <Button type="submit" variant="primary">
              UPDATE
            </Button>

            {updateProductResponseState.error ?? ""}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProductPageComponent;
