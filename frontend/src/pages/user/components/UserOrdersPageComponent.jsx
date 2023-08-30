import { Table, Container } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const UserOrdersPageComponent = ({getOrders, userInfo}) => {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders().then(orders => {
      setOrders(orders);
    }).catch(error => {
      console.log(error);
    });
  }, []);

  return (
    <Container className="mt-5">
      <h1>My orders</h1>
      <Table className="mt-2" striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Date</th>
            <th>Total</th>
            <th>Delivered</th>
            <th>Order details</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr>
              <td>{idx + 1}</td>
              <td>{userInfo.name} {userInfo.lastName}</td>
              <td>{order.createdAt.substring(0, 10)}</td>
              <td>${order.orderTotal.cartSubtotal}</td>
              <td>
                {order.isDelivered ? <i className="bi bi-check-lg text-success"></i> : <i className="bi bi-x-lg text-danger"></i>}
              </td>
              <td>
                <Link to={`/user/order-details/${order._id}`}>
                  Go to order
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default UserOrdersPageComponent;