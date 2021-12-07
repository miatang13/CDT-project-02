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
  const size = "25px";
  const detailsSvgParams = {
    width: size,
    height: size,
    marginRight: ".5vw",
  };

  return (
    <div id="analysis__root">
      <NavigationBar activeKey={4} color="rgb(130, 75, 219)" />

      <div id="analysis__content" className="content__wrapper page__root">
        <h1 className="title">Your top directors</h1>

        {cartData.length === 0 && <EmptyAnalysis />}

        {cartData.length !== 0 && (
          <div>
            <Container id="directors__wrapper" fluid>
              <Row>
                {cartData.map((item, index) => (
                  <Col sm={3} key={item.name + index}>
                    <Card style={{ borderColor: "rgb(130, 75, 219)" }}>
                      <Card.Body>
                        <Card.Title className="directorName">
                          {item.name}
                        </Card.Title>
                        <Card.Text> {item.movieCnt} passing movies</Card.Text>
                        <Card.Text>
                          Average box office: $
                          {new Intl.NumberFormat().format(item.boxOfficeAvg)}
                        </Card.Text>
                        <Carousel interval={5000000} indicators={false}>
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
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        style={detailsSvgParams}
                                        fill="currentColor"
                                        className="bi bi-bank2"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M8.277.084a.5.5 0 0 0-.554 0l-7.5 5A.5.5 0 0 0 .5 6h1.875v7H1.5a.5.5 0 0 0 0 1h13a.5.5 0 1 0 0-1h-.875V6H15.5a.5.5 0 0 0 .277-.916l-7.5-5zM12.375 6v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zM8 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM.5 15a.5.5 0 0 0 0 1h15a.5.5 0 1 0 0-1H.5z" />
                                      </svg>{" "}
                                      {movieObj.BoxOffice}
                                    </p>
                                    <p className="movieAwards roundedBg">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        style={detailsSvgParams}
                                        fill="currentColor"
                                        className="bi bi-trophy-fill"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z" />
                                      </svg>{" "}
                                      {movieObj.Awards}
                                    </p>
                                    <p className="roundedBg">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        style={detailsSvgParams}
                                        fill="currentColor"
                                        className="bi bi-clock-fill"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                                      </svg>{" "}
                                      {movieObj.Released}
                                    </p>
                                    <p className="movieGenre">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        style={detailsSvgParams}
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            style={detailsSvgParams}
                            fill="currentColor"
                            className="bi bi-x-lg"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
                            />
                            <path
                              fill-rule="evenodd"
                              d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
                            />
                          </svg>
                        </Button>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Container>
            <Container
              className="justify-content-md-center min-vw-100"
              id="recommendation__wrapper"
              style={{ textAlign: "center" }}
            >
              <h1 className="sub__title">You May Also Like: </h1>
              <Row>
                {recommendations.map((rec) => (
                  <Col key={rec.name}>
                    <span className="rec__name">
                      {" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        style={detailsSvgParams}
                        fill="currentColor"
                        className="bi bi-camera-reels-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        <path d="M9 6a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                        <path d="M9 6h.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 7.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 16H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h7z" />
                      </svg>{" "}
                      {rec.name}
                    </span>
                  </Col>
                ))}
              </Row>
            </Container>
          </div>
        )}
      </div>
    </div>
  );
}
