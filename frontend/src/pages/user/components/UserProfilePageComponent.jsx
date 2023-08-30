import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Container, Alert } from "react-bootstrap";

const UserProfilePageComponent = ({
  updateUserApiRequest,
  fetchUser,
  userInfoFromRedux,
  setReduxUserState,
  reduxDispatch,
  localStorage,
  sessionStorage
}) => {
  const [validated, setValidated] = useState(false);
  const [passwordsMatchState, setPasswordsMatchState] = useState(true);
  const [updateUserResponseState, setUpdateUserResponseState] = useState({
    success: "",
    error: "",
  });
  const [user, setUser] = useState({});

  useEffect(() => {
    fetchUser(userInfoFromRedux._id)
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userInfoFromRedux._id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget.elements;

    const name = form.name.value;
    const lastName = form.lastName.value;
    const password = form.password.value;
    const phoneNumber = form.phoneNumber.value;
    const country = form.country.value;
    const city = form.city.value;
    const street = form.street.value;
    const homeNumber = form.homeNumber.value;
    const localNumber = form.localNumber.value;
    const zipCode = form.zipCode.value;

    if (
      event.currentTarget.checkValidity() === true &&
      form.password.value === form.confirmPassword.value
    ) {
      updateUserApiRequest(
        name,
        lastName,
        password,
        phoneNumber,
        country,
        city,
        street,
        homeNumber,
        localNumber,
        zipCode
      )
        .then((data) => {
          setUpdateUserResponseState({ success: data.success, error: "" });
          reduxDispatch(setReduxUserState({ doNotLogout: userInfoFromRedux.doNotLogout, ...data.userUpdated}));
          if(userInfoFromRedux.doNotLogout){
            localStorage.setItem("userInfo", JSON.stringify({ doNotLogout: true, ...data.userUpdated}));
          }
          else{
            sessionStorage.setItem("userInfo", JSON.stringify({ doNotLogout: false, ...data.userUpdated}));
          }
        })
        .catch((error) => {
          setUpdateUserResponseState({
            error: error.response.data.message
              ? error.response.data.message
              : error.response.data,
          });
        });
    }
    setValidated(true);
  };

  const onChange = () => {
    const password = document.querySelector("input[name=password]");
    const confirmPassword = document.querySelector(
      "input[name=confirmPassword]"
    );
    if (password.value !== confirmPassword.value) {
      setPasswordsMatchState(false);
    } else {
      setPasswordsMatchState(true);
    }
  };

  return (
    <Container>
      <Row className="mt-3 justify-content-md-center">
        <Col md={6}>
          <h1>Change your profile</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Enter your name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter your name"
                defaultValue={user.name}
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
                defaultValue={user.lastName}
                name="lastName"
              />
              <Form.Control.Feedback type="invalid">
                Please enter your last name
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>

              <Form.Control
                disabled
                value={
                  user.email +
                  " if you want to change email, remove account and create new one with new email address"
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
              <Form.Label>Phone number</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter your phone number"
                defaultValue={user.phoneNumber}
                name="phoneNumber"
                pattern="[0-9]{9}"
              />
              <Form.Control.Feedback type="invalid">
                Enter a valid phone number
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCountry">
              <Form.Label>Country</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter your country"
                defaultValue={user.country}
                name="country"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter your city name"
                defaultValue={user.city}
                name="city"
              />
              <Form.Control.Feedback type="invalid">
                Please enter city you live
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicStreet">
              <Form.Label>Street</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter street name you live"
                defaultValue={user.street}
                name="street"
              />
              <Form.Control.Feedback type="invalid">
                Please enter street you live
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicHomeNumber">
                  <Form.Label>Home number</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    placeholder="Enter your home number"
                    defaultValue={user.homeNumber}
                    name="homeNumber"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your home number
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicLocalNumber">
                  <Form.Label>Local number</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Local number"
                    defaultValue={user.localNumber}
                    name="localNumber"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your local number
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formBasicZipCode">
              <Form.Label>ZipCode</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter your Zip code"
                defaultValue={user.zipCode}
                name="zipCode"
                pattern="[0-9]{2}-[0-9]{3}"
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid zip code{" "}
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
              <Form.Control.Feedback type="invalid">
                Please enter a valid password
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Password should have at least 8 characters
              </Form.Text>
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
              <Form.Control.Feedback type="invalid">
                Both passwords should match
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit">
              Update
            </Button>

            <Alert
              className="mt-3"
              variant="danger"
              show={
                updateUserResponseState && updateUserResponseState.error !== ""
              }
            >
              Something went wrong
            </Alert>
            <Alert
              className="mt-3"
              variant="success"
              show={
                updateUserResponseState &&
                updateUserResponseState.success === "user updated"
              }
            >
              User updated
            </Alert>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfilePageComponent;
