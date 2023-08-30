import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Container, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

function RegisterPageComponent({ registerUserApiRequest, reduxDispatch, setReduxUserState }) {
  const [validated, setValidated] = useState(false);
  const [passwordsMatchState, setPasswordsMatchState] = useState(true);
  const [registerUserResponseState, setRegisterUserResponseState] = useState({ success: "", error: "", loading: false });

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget.elements;

    const name = form.name.value;
    const lastName = form.lastName.value;
    const email = form.email.value;
    const password = form.password.value;
    const phoneNumber = form.phoneNumber.value;
    const country = form.country.value;
    const city = form.city.value;
    const street = form.street.value;
    const homeNumber = form.homeNumber.value;
    const localNumber = form.localNumber.value;
    const zipCode = form.zipCode.value;

    if (event.currentTarget.checkValidity() === true && email && password && name && lastName && phoneNumber && country && zipCode && city && homeNumber && street && form.password.value === form.confirmPassword.value) {
      setRegisterUserResponseState({ loading: true });
      registerUserApiRequest(name, lastName, email, password, phoneNumber, country, city, street, homeNumber, localNumber, zipCode).then(data => {
        setRegisterUserResponseState({ success: data.success, loading: false });
        reduxDispatch(setReduxUserState(data.userCreated));
      }).catch(error => {
        setRegisterUserResponseState({ error: error.response.data.message ? error.response.data.message : error.response.data });
      });
    }

    setValidated(true);
  };

  const onChange = () => {
    const password = document.querySelector("input[name=password]");
    const confirmPassword = document.querySelector("input[name=confirmPassword]");
    if (password.value !== confirmPassword.value) {
      setPasswordsMatchState(false);
    }
    else {
      setPasswordsMatchState(true);
    }
  };

  return (
    <Container>
      <Row className="mt-5 justify-content-md-center">
        <Col md={6}>
          <h1>Register</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Enter your name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter your name"
                name="name"
              />
              <Form.Control.Feedback type="invalid">
                Please enter your name
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label>Enter your last name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter your last name"
                name="lastName"
              />
              <Form.Control.Feedback type="invalid">
                Please enter your last name
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>

              <Form.Control
                required
                type="email"
                placeholder="Enter your email address"
                name="email"
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid email address
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Password"
                name="password"
                minLength={8}
                isInvalid={!passwordsMatchState}
                onChange={onChange}
              />
              <Form.Control.Feedback type="invalid">Please enter a valid password</Form.Control.Feedback>
              <Form.Text className="text-muted">Password should have at least 8 characters</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPasswordRepeat">
              <Form.Label>Repeat password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Repeat password"
                name="confirmPassword"
                minLength={8}
                isInvalid={!passwordsMatchState}
                onChange={onChange}
              />
              <Form.Control.Feedback type="invalid">Both passwords should match</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
              <Form.Label>Enter your phone number</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter your phone number"
                name="phoneNumber"
                pattern="[0-9]{9}"
              />
              <Form.Control.Feedback type="invalid">Enter a valid phone number</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCountry">
              <Form.Label>Country</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter your country"
                name="country"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="City"
                name="city"
              />
              <Form.Control.Feedback type="invalid">Please enter city you live</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicStreet">
              <Form.Label>Street</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Street"
                name="street"
              />
              <Form.Control.Feedback type="invalid">Please enter street you live</Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicHomeNumber">
                  <Form.Label>Home number</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    placeholder="Enter your home number"
                    name="homeNumber"

                  />
                  <Form.Control.Feedback type="invalid">Please enter your home number</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicLocalNumber">
                  <Form.Label>Local number</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Local number"
                    name="localNumber"
                  />
                  <Form.Control.Feedback type="invalid">Please enter your local number</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formBasicZipCode">
              <Form.Label>ZipCode</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter your zip code"
                name="zipCode"
                pattern="[0-9]{2}-[0-9]{3}"
              />
              <Form.Control.Feedback type="invalid">Please enter a valid zip code </Form.Control.Feedback>
            </Form.Group>

            <Row className="pb-2">
              <Col>
                Do you have an account already?{" "}
                <Link to="/login">Login</Link>
              </Col>
            </Row>

            <Button type="submit">
              {registerUserResponseState && registerUserResponseState.loading === true && (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                </>
              )}
              Submit
            </Button>

            <Alert className="mt-3" variant="danger" show={registerUserResponseState && registerUserResponseState.error === "user exists"}>User with that email already exists!</Alert>
            <Alert className="mt-3" variant="success" show={registerUserResponseState && registerUserResponseState.success === "User created"}>User created</Alert>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPageComponent;
