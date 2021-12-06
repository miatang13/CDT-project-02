import { useState } from "react";
import {
  Card,
  Carousel,
  Col,
  Container,
  Row,
  Button,
  Accordion,
} from "react-bootstrap";
import EmptyAnalysis from "../components/EmptyAnalysis";
import NavigationBar from "../components/Navbar";
import "../styles/analysis.css";
import complete_data from "../data/main-data.json";
import { rand } from "../webgl/helper/rand";

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

  let recommendations = [];
  for (let i = 0; i < 3; i++) {
    recommendations.push(rand(complete_data));
  }

  return (
    <div id="analysis__root">
      <NavigationBar activeKey={4} color="rgb(130, 75, 219)" />

      <div id="analysis__content" className="content__wrapper">
        <h1 className="title">Your top directors</h1>

        {cartData.length === 0 && <EmptyAnalysis />}

        {cartData.length !== 0 && (
          <Container id="directors__wrapper" fluid>
            <Row>
              {cartData.map((item, index) => (
                <Col sm={3} key={item.name + index}>
                  <Card style={{ borderColor: "rgb(130, 75, 219)" }}>
                    <Card.Body>
                      <Card.Title className="directorName">
                        {item.name}
                      </Card.Title>
                      <Card.Text>✔️ {item.movieCnt} passing movies</Card.Text>
                      <Card.Text>
                        💰 Avg box office: $
                        {new Intl.NumberFormat().format(item.boxOfficeAvg)}
                      </Card.Text>
                      <Carousel
                        interval={5000000}
                        variant="dark"
                        indicators={false}
                      >
                        {item.movies.map((movieObj) => (
                          <Carousel.Item key={movieObj.Title}>
                            <img
                              className="d-block w-100"
                              src={movieObj.Poster}
                              alt="First slide"
                              style={{ marginBottom: "1vh" }}
                            />
                            <Accordion>
                              <Accordion.Item eventKey="0">
                                <Accordion.Header className="movieTitle">
                                  {movieObj.Title}
                                </Accordion.Header>
                                <Accordion.Body>
                                  <p className="movieBoxoffice roundedBg">
                                    💰 {movieObj.BoxOffice}
                                  </p>
                                  <p className="movieAwards roundedBg">
                                    🏆 {movieObj.Awards}
                                  </p>
                                  <p className="roundedBg">
                                    🎬 {movieObj.Released}
                                  </p>
                                  <p className="movieGenre">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-hash"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                    </svg>
                                    {movieObj.Genre}
                                  </p>
                                </Accordion.Body>
                              </Accordion.Item>
                            </Accordion>
                          </Carousel.Item>
                        ))}
                      </Carousel>
                    </Card.Body>
                    <Card.Footer
                      style={{ backgroundColor: " rgb(231, 206, 255)" }}
                    >
                      <Button
                        style={{
                          borderColor: "rgb(130, 75, 219)",
                          backgroundColor: "white",
                          color: "rgb(130, 75, 219)",
                        }}
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
        )}
        <Container
          className="justify-content-md-center min-vw-100"
          id="recommendation__wrapper"
          style={{ textAlign: "center" }}
        >
          <h1 className="sub__title">You May Also Like: </h1>
          <Row>
            {recommendations.map((rec) => (
              <Col key={rec.name}>
                <span className="rec__name"> 📽️ {rec.name}</span>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </div>
  );
}
