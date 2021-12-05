import { Card, Carousel, Col, Container, Row, Button } from "react-bootstrap";
import EmptyAnalysis from "../components/EmptyAnalysis";
import NavigationBar from "../components/Navbar";
import "../styles/analysis.css";
import "../styles/feature.css";

export default function Analysis() {
  let cartData = JSON.parse(localStorage.getItem("cart"));
  if (!cartData) {
    cartData = [];
  }
  console.log(cartData);

  return (
    <div className="root" id="analysis__root">
      <NavigationBar />
      <h1 id="title">Your top directors</h1>

      {cartData.length === 0 && <EmptyAnalysis />}

      {cartData.length !== 0 && (
        <Container className="directors__wrapper" fluid>
          <Row>
            {cartData.map((item, index) => (
              <Col key={item.name + index}>
                <Card>
                  <Card.Body>
                    <Card.Title className="directorName">
                      {item.name}
                    </Card.Title>
                    <Card.Text>{item.movieCnt} passing movies</Card.Text>
                    {/* <Carousel fade variant="dark">
                      {item.movies.map((movieObj) => (
                        <Carousel.Item key={movieObj.Title}>
                          <img
                            className="d-block w-100"
                            src={movieObj.Poster}
                            alt="First slide"
                          />
                          <h4>{movieObj.Title}</h4>
                          <p>{movieObj.BoxOffice}</p>
                          <p>{movieObj.Awards}</p>
                          <p>{movieObj.Genre}</p>
                          <Button variant="outline-secondary"> Remove </Button>
                        </Carousel.Item>
                      ))}
                    </Carousel> */}

                    <div
                      id="carouselExampleControls"
                      className="carousel slide"
                      data-ride="carousel"
                    >
                      <div className="carousel-inner">
                        {item.movies.map((movieObj, index) => (
                          <div
                            className={
                              index === 0
                                ? "carousel-item active"
                                : "carousel-item"
                            }
                            key={movieObj.Title}
                          >
                            <img
                              className="d-block w-100"
                              src={movieObj.Poster}
                              alt="First slide"
                            />
                          </div>
                        ))}
                      </div>
                      <ol class="carousel-indicators">
                        <li
                          data-target="#carouselExampleIndicators"
                          data-slide-to="0"
                          class="active"
                        ></li>
                        <li
                          data-target="#carouselExampleIndicators"
                          data-slide-to="1"
                        ></li>
                        <li
                          data-target="#carouselExampleIndicators"
                          data-slide-to="2"
                        ></li>
                      </ol>
                      <a
                        className="carousel-control-prev"
                        href="#carouselExampleControls"
                        role="button"
                        data-slide="prev"
                      >
                        <span
                          className="carousel-control-prev-icon"
                          aria-hidden="true"
                        ></span>
                        <span className="sr-only">Previous</span>
                      </a>
                      <a
                        className="carousel-control-next"
                        href="#carouselExampleControls"
                        role="button"
                        data-slide="next"
                      >
                        <span
                          className="carousel-control-next-icon"
                          aria-hidden="true"
                        ></span>
                        <span className="sr-only">Next</span>
                      </a>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      )}
    </div>
  );
}
