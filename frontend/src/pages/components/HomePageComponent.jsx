import { Container, Row } from "react-bootstrap";
import ProductCarouselComponent from "../../components/ProductCarouselComponent";
import CategoryCardComponent from "../../components/CategoryCardComponent";
import { useEffect, useState } from "react";


const HomePageComponent = ({categories, getBestsellers}) => {

  const [mainCategories, setMainCategories] = useState([]);
  const [bestSellers, setBestsellers] = useState([]);

  useEffect(() => {
    getBestsellers().then(data => {
      setBestsellers(data);
    }).catch(error => {
      console.log(error.response.data.message ? error.response.data.message : error.response.data);
    })
    setMainCategories((cat) => categories.filter((item) => !item.name.includes("/")));
  }, [categories])

  return (
    <>
      <ProductCarouselComponent bestSellers={bestSellers} />
      <Container >
        <Row xs={1} md={2} className="g-4 mt-5">
          {mainCategories.map((category, idx) => (
            <CategoryCardComponent category={category} key={idx} idx={idx} />
          ))}
        </Row>
      </Container>
    </>
  )
}

export default HomePageComponent;