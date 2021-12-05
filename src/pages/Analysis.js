import { useState } from "react";
import { Card, Carousel, Col, Container, Row, Button } from "react-bootstrap";
import EmptyAnalysis from "../components/EmptyAnalysis";
import NavigationBar from "../components/Navbar";
import "../styles/analysis.css";
import "../styles/feature.css";
import complete_data from "../data/main-data.json";

export default function Analysis() {
  let initialCart = JSON.parse(localStorage.getItem("cart"));
  if (!initialCart) {
    initialCart = [];
    localStorage.setItem("cart", JSON.stringify([])); // shouldn't happen
  }
  const [cartData, setCart] = useState(initialCart);

  function handleRemove(directorName) {
    console.log("removing director", directorName);
    let newCart = cartData.filter(function (el) {
      return el.name !== directorName;
    });
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCart(newCart);
  }

  let recommendationIdx =
    Math.floor(Math.random() * complete_data.length - 3) + 2;
  console.log(recommendationIdx);
  let recommendations = [];
  for (let i = 0; i < 3; i++) {
    recommendations.push(complete_data[i + recommendationIdx]);
  }

  return (
    <div id="analysis__root">
      <NavigationBar activeKey={4} color="0x000000" />

      <div id="analysis__content" className="min-vh-100">
        <h1 className="title">Your top directors</h1>

        {cartData.length === 0 && <EmptyAnalysis />}

        {cartData.length !== 0 && (
          <div>
            <Container id="directors__wrapper" fluid>
              <Row className="justify-content-md-center">
                {cartData.map((item, index) => (
                  <Col key={item.name + index}>
                    <Card style={{ width: "15rem" }} bg="light">
                      <Card.Body>
                        <Card.Title className="directorName">
                          {item.name}
                        </Card.Title>
                        <Card.Text>{item.movieCnt} passing movies</Card.Text>
                        <Carousel variant="dark" indicators={false}>
                          {item.movies.map((movieObj) => (
                            <Carousel.Item key={movieObj.Title}>
                              <img
                                className="d-block w-100"
                                src={movieObj.Poster}
                                alt="First slide"
                                style={{ marginBottom: "1vh", height: "350px" }}
                              />
                              <h4 className="movieTitle">{movieObj.Title}</h4>
                              <p className="movieBoxoffice roundedBg">
                                💰 {movieObj.BoxOffice}
                              </p>
                              <p className="movieAwards roundedBg">
                                🏆 {movieObj.Awards}
                              </p>
                              <p className="roundedBg">
                                🎬 {movieObj.Released}
                              </p>
                              <p className="movieGenre">{movieObj.Genre}</p>
                            </Carousel.Item>
                          ))}
                        </Carousel>
                      </Card.Body>
                      <Card.Footer>
                        <Button
                          variant="outline-secondary"
                          onClick={() => handleRemove(item.name)}
                        >
                          Remove
                        </Button>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Container>
            {/* <hr style={{ marginTop: "2vh" }} /> */}
          </div>
        )}
        <Container
          className="justify-content-md-center min-vw-100"
          id="recommendation__wrapper"
          style={{ textAlign: "center" }}
        >
          <h1 className="sub__title">You May Also Like: </h1>
          <Row>
            {recommendations.map((rec) => (
              <Col>
                <span className="rec__name"> 📽️ {rec.name}</span>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </div>
  );
}
