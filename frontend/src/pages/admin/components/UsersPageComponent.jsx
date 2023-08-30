import { Container, Row, Col, Table, Button } from "react-bootstrap";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";
import { LinkContainer } from "react-router-bootstrap";
import { useState, useEffect } from "react";

import { logout } from "../../../redux/actions/userActions";
import { useDispatch } from "react-redux";

const UsersPageComponent = ({fetchUsers, deleteUser}) => {

  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [userDeleted, setUserDeleted] = useState(false);

  const deleteHandler = async (userId) => {
    if(window.confirm("Are you sure?")){
      const data = await deleteUser(userId);
      if(data === "user removed"){
        setUserDeleted(!userDeleted);
      }
    };
  };

  useEffect(() => {
    const abctrl = new AbortController();
    fetchUsers(abctrl).then(res => setUsers(res)).catch(error => {
      dispatch(logout());
      // console.log(
      //   error.response.data.message ? error.response.data.message : error.response.data
      // );
    });
    return () => abctrl.abort();
  }, [userDeleted]);

  return (
    <Container>
      <Row className="mt-5">
        <Col md={2}>
          <AdminLinksComponent />
        </Col>
        <Col md={10}>
          <h1>Admin Users Page</h1>
          <Table striped bordered hover responsive variant="dark">
            <thead>
              <tr>
                <th>#</th>
                <th>First name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Is Admin</th>
                <th>Edit / Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={idx}>
                <td>{idx+1}</td>
                <td>{user.name}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>
                  {user.isAdmin ? <i className="bi bi-check-lg text-success"></i> : <i className="bi bi-x-lg text-danger"></i>}
                                   
                </td>
                <td>
                  <LinkContainer to={`/admin/edit-user/${user._id}`}>
                    <Button variant="primary" className="btn-sm">
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                  </LinkContainer>
                  {" / "}
                  <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(user._id)}>
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

export default UsersPageComponent;