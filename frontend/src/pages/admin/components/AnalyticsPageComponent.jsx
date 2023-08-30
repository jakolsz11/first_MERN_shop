import { Container, Row, Col, Form } from "react-bootstrap";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from "react";


const AnalyticsPageComponent = ({ fetchOrdersForFirstDate, fetchOrdersForSecondDate, socketIOClient }) => {

  const [firstDateToCompare, setFirstDateToCompare] = useState(new Date().toISOString().substring(0, 10));
  var previousDay = new Date();
  previousDay.setDate(previousDay.getDate() - 1);
  const [secondDateToCompare, setSecondDateToCompare] = useState(new Date(previousDay).toISOString().substring(0, 10));

  const [dataForFirstSet, setDataForFirstSet] = useState([]);
  const [dataForSecondSet, setDataForSecondSet] = useState([]);

  useEffect(() => {
    const socket = socketIOClient();
    let today = new Date().toDateString();
    const handler = (newOrder) => {
      var orderDate = new Date(newOrder.createdAt).toLocaleString("en-US", { hour: "numeric", hour12: true, timeZone: "UTC"});
      if(new Date(newOrder.createdAt).toDateString() === today){
        if(today === new Date(firstDateToCompare).toDateString()){
          setDataForFirstSet(prev => {
            if(prev.length === 0){
              return [{name: orderDate, [firstDateToCompare]: newOrder.orderTotal.cartSubtotal}];
            }
            const length = prev.length;
            if(prev[length - 1].name === orderDate){
              prev[length - 1][firstDateToCompare] += newOrder.orderTotal.cartSubtotal;
              return [...prev];
            }
            else{
              var lastElem = {name: orderDate, [firstDateToCompare]: prev[length-1][firstDateToCompare] + newOrder.orderTotal.cartSubtotal};
              return [...prev, lastElem];
            }
          })
        }
        else if(today === new Date(secondDateToCompare).toDateString()){
          setDataForSecondSet(prev => {
            if(prev.length === 0){
              return [{name: orderDate, [secondDateToCompare]: newOrder.orderTotal.cartSubtotal}];
            }
            const length = prev.length;
            if(prev[length - 1].name === orderDate){
              prev[length - 1][secondDateToCompare] += newOrder.orderTotal.cartSubtotal;
              return [...prev];
            }
            else{
              var lastElem = {name: orderDate, [secondDateToCompare]: prev[length-1][secondDateToCompare] + newOrder.orderTotal.cartSubtotal};
              return [...prev, lastElem];
            }
          })
        }
      }
    }
    socket.on("newOrder", handler);
    return () => socket.off("newOrder", handler);
  }, [setDataForFirstSet, setDataForSecondSet, firstDateToCompare, secondDateToCompare])

  useEffect(() => {
    const abctrl = new AbortController();
    fetchOrdersForFirstDate(abctrl, firstDateToCompare).then(data => {
      let orderSum = 0;
      const orders = data.map((order) => {
        orderSum += order.orderTotal.cartSubtotal;
        var date = new Date(order.createdAt).toLocaleString("en-US", { hour: "numeric", hour12: true, timeZone: "UTC" });
        return { name: date, [firstDateToCompare]: orderSum };
      });
      setDataForFirstSet(orders);
    }).catch(error => {
      console.log(error.response.data.message ? error.response.data.message : error.response.data);
    });

    fetchOrdersForSecondDate(abctrl, secondDateToCompare).then(data => {
      let orderSum = 0;
      const orders = data.map((order) => {
        orderSum += order.orderTotal.cartSubtotal;
        var date = new Date(order.createdAt).toLocaleString("en-US", { hour: "numeric", hour12: true, timeZone: "UTC" });
        return { name: date, [secondDateToCompare]: orderSum };
      });
      setDataForSecondSet(orders);
    }).catch(error => {
      console.log(error.response.data.message ? error.response.data.message : error.response.data);
    });

    return () => abctrl.abort();
  }, [firstDateToCompare, secondDateToCompare]);

  const firstDateHandler = (e) => {
    setFirstDateToCompare(e.target.value);
  };

  const secondDateHandler = (e) => {
    setSecondDateToCompare(e.target.value);
  };

  return (
    <Container>
      <Row className="mt-5">
        <Col md={2}>
          <AdminLinksComponent />
        </Col>
        <Col md={10}>
          <h2>Analytics Page</h2>
          <h5>First date to compare: <b>{firstDateToCompare}</b></h5>
          <h5>Second date to compare: <b>{secondDateToCompare}</b></h5>

          <Form.Group controlId="firstDateToComapre">
            <Form.Label>Select first date to compare:</Form.Label>
            <Form.Control onChange={firstDateHandler} type="date" name="firstDateToCompare" placeholder="First date to compare" defaultValue={firstDateToCompare} />
          </Form.Group>

          <br />

          <Form.Group controlId="secondDateToComapre">
            <Form.Label>Select second date to compare:</Form.Label>
            <Form.Control onChange={secondDateHandler} type="date" name="secondDateToCompare" placeholder="Second date to compare" defaultValue={secondDateToCompare} />
          </Form.Group>

          <ResponsiveContainer width="100%" height={500} className="mt-4">
            <LineChart
              width={500}
              height={300}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" label={{ value: "TIME", offset: 50, position: "insideBottomRight" }} allowDuplicatedCategory={false} />
              <YAxis label={{ value: "REVENUE $", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend varticalAllign="top" height={36} />
              {dataForFirstSet.length > dataForSecondSet.length ? (
                <>
                  <Line data={dataForFirstSet} type="monotone" dataKey={firstDateToCompare} stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={3} />
                  <Line data={dataForSecondSet} type="monotone" dataKey={secondDateToCompare} stroke="#82ca9d" strokeWidth={3} />
                </>
              ) : (
                <>
                  <Line data={dataForSecondSet} type="monotone" dataKey={secondDateToCompare} stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={3} />
                  <Line data={dataForFirstSet} type="monotone" dataKey={firstDateToCompare} stroke="#82ca9d" strokeWidth={3} />
                </>
              )}

            </LineChart>
          </ResponsiveContainer>


        </Col>

      </Row>
    </Container>
  )
};

export default AnalyticsPageComponent;