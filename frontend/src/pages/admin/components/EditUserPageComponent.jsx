import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const EditUserPageComponent = ({ updateUserApiRequest, fetchUser }) => {
  const [validated, setValidated] = useState(false);
  const [user, setUser] = useState([]);
  const [isAdminState, setIsAdminState] = useState(false);
  const [updateUserResponseState, setUpdateUserResponseState] = useState({ message: "", error: ""});

  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget.elements;

    const name = form.name.value;
    const lastName = form.lastName.value;
    const email = form.email.value;
    const isAdmin = form.isAdmin.checked;

    if (event.currentTarget.checkValidity() === true) {
      updateUserApiRequest(id, name, lastName, email, isAdmin).then(data => {
        if(data === "user updated"){
          navigate("/admin/users");
        }
      }).catch(error => {
        setUpdateUserResponseState({error: error.response.data.message ? error.response.data.message : error.response.data});
      })
    }

    setValidated(true);
  };

  useEffect(() => {
    fetchUser(id).then(data => {
      setUser(data);
      setIsAdminState(data.isAdmin);
    }).catch(error => {
      console.log(error.response.data.message ? error.response.data.message : error.response.data)
    });
  }, [id])

  return (
    <Container>
      <Row className="mt-5 justify-content-md-center">
        <Col md={1}>
          <Link to="/admin/users" className="btn btn-info my-3">
            Go back
          </Link>
        </Col>
        <Col md={6}>
          <h1>Edit user</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label>First name</Form.Label>
              <Form.Control
                required
                type="text"
                defaultValue={user.name}
                name="name"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                required
                type="text"
                defaultValue={user.lastName}
                name="lastName"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                required
                type="email"
                defaultValue={user.email}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check 
                label="Is admin"
                type="checkbox"
                name="isAdmin"
                checked={isAdminState}
                onChange={(e) => setIsAdminState(e.target.checked)}
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              Update
            </Button>
            {updateUserResponseState.error ?? ""}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditUserPageComponent;
