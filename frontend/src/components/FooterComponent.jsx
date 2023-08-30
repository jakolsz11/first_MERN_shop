import { Container, Row, Col, Badge } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector } from "react-redux";

const pCss = {
  cursor: "pointer",
  marginBottom: "0",
}

const FooterComponent = () => {

  const { userInfo } = useSelector(state => state.userRegisterLogin);
  const { itemsCount } = useSelector(state => state.cart);

  return (
    <footer>
      <Container fluid className="bg-dark text-center">
        <Container className="bg-dark text-secondary text-center">
          <Row style={{ paddingTop: "1.5rem" }}>
            <Col ms={6}>
              {userInfo.isAdmin ? (
                <Row style={{ padding: "0.15rem 12px" }}>
                  <LinkContainer className="link-to" style={pCss} to="/admin/orders">
                    <p>Admin</p>
                  </LinkContainer>
                </Row>
              ) : userInfo.name && !userInfo.isAdmin ? (
                <Row style={{ padding: "0.25rem 12px" }}>
                  <LinkContainer className="link-to" style={pCss} to="/user">
                    <p>{`${userInfo.name} ${userInfo.lastName}`}</p>
                  </LinkContainer>
                </Row>
              ) : (
              <>
                <Row style={{ padding: "0.25rem 12px" }}>
                  <LinkContainer className="link-to" style={pCss} to="/login">
                    <p>Login</p>
                  </LinkContainer>
                </Row>
                <Row style={{ padding: "0.25rem 12px" }}>
                  <LinkContainer className="link-to" style={pCss} to="/register">
                    <p>Register</p>
                  </LinkContainer>
                </Row>
              </>
              )}

              <Row style={{ padding: "0.25rem 12px" }}>
                <LinkContainer className="link-to" style={pCss} to="/cart">
                  <p>
                    <Badge pill bg="danger">
                      {itemsCount === 0 ? "" : itemsCount}
                    </Badge>
                    {" "}<i className="bi bi-cart"></i>{" "}
                    Cart
                  </p>
                </LinkContainer>
              </Row>
            </Col>
            <Col ms={6}>
              <Row style={{ padding: "0.25rem 12px" }}>
                <p style={{ marginBottom: "0" }}>Contact me:</p>
              </Row>
              <Row style={{ padding: "0.25rem 12px" }}>
                <p style={{ marginBottom: "0" }}>olszanecki.jakub@gmail.com</p>
              </Row>
              <Row style={{ padding: "0.25rem 12px", marginBottom: "0" }}>
                <a target="_blank" href="https://github.com/jakubolszanecki">
                  <p style={{ marginBottom: "0" }}>
                    <i className="bi bi-github"></i>{" "}
                    GitHub
                  </p>
                </a>
              </Row>
              <Row style={{ padding: "0.25rem 12px" }}>
                <a target="_blank" href="https://www.linkedin.com/in/jakub-olszanecki-56370a232/">
                  <p style={{ marginBottom: "0" }}>
                    <i className="bi bi-linkedin"></i>{" "}
                    LinkedIn
                  </p>
                </a>
              </Row>
            </Col>
          </Row>
          <Row style={{ minHeight: "60px", padding: "1rem 0 1rem 0", fontSize: "1rem" }}>
            <Col style={{ alignSelf: "center" }}>
              Copyright &copy; My First Shop. Built by Jacob Olszanecki
            </Col>
          </Row>
        </Container>

      </Container >
    </footer >
  )
}

export default FooterComponent;