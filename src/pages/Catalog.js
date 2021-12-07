import Button from "@restart/ui/esm/Button";
import anime from "animejs";
import { useState } from "react";
import { Col, Row, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavigationBar from "../components/Navbar";
import complete_data from "../data/final-data.json";
import "../styles/catalog.css";
import { baseUrl } from "../utility/file";

export default function Catalog() {
  const boxOfficeBucket = 20;
  const [sortByBO, setSort] = useState(false);
  const [displayData, setData] = useState(complete_data);
  let sortedData = [...complete_data].sort(function (a, b) {
    return b.boxOfficeAvg - a.boxOfficeAvg;
  }); // descending order
  let lastMovieCnt = 0;

  const handleSort = () => {
    const sort = !sortByBO;
    const new_data = sort ? sortedData : complete_data;
    function callBack() {
      setSort(sort);
      setData(new_data);
    }

    anime
      .timeline({
        complete: callBack,
      })
      .add({
        targets: "#directors__wrapper",
        translateY: ["1.5em", 0],
        duration: 500,
      });
  };

  return (
    <div>
      <NavigationBar activeKey={2} color="rgb(130, 75, 219)" />

      <div id="catalog__content" className="content__wrapper page__root">
        <h1 className="title">Catalog</h1>
        <p className="page__description">
          This is a comprehensive catalog of {complete_data.length} directors
          displayed on this website.
          <br /> You can sort the list of directors by their movies' average box
          office.
          <br /> Clicking on a director's name brings you to the data
          visualization of that particular director.
        </p>

        <Container fluid>
          <Row className="justify-content-md-center">
            <Col>
              <Button
                type="checkbox"
                onClick={handleSort}
                style={{
                  backgroundColor: sortByBO ? "rgb(130, 75, 219)" : "white",
                  color: sortByBO ? "white" : "rgb(130, 75, 219)",
                }}
              >
                Sort By Average Box Office
              </Button>
            </Col>
          </Row>
          <Row id="directors__wrapper">
            {displayData.map((director, index) => {
              let newTo = {
                pathname: baseUrl + "/",
                directorIdx: director.unsortedIndex,
              };
              let nameJsx = (
                <Col md={4} className="director__wrapper">
                  <Link to={newTo} key={director.name + "_name"}>
                    <span className="directorName">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-arrow-right"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                        />
                      </svg>{" "}
                      {director.name}
                    </span>
                  </Link>
                </Col>
              );
              let finalJsx = nameJsx;
              if (sortByBO) {
                if (index % boxOfficeBucket === 0) {
                  let label = (
                    <div key={index + "_label"}>
                      <hr style={{ color: "rgb(130, 75, 219)" }} />
                      <h3 className="section__title">
                        Directors with average box office over $
                        {new Intl.NumberFormat().format(director.boxOfficeAvg)}:
                      </h3>
                    </div>
                  );
                  finalJsx = [label, nameJsx];
                }
              } else {
                if (director.movieCnt !== lastMovieCnt) {
                  lastMovieCnt = director.movieCnt;
                  let label = (
                    <div key={index + "_label"}>
                      <hr style={{ color: "rgb(130, 75, 219)" }} />
                      <h3 className="section__title">
                        Directors with {lastMovieCnt} movies:
                      </h3>
                    </div>
                  );
                  finalJsx = [label, nameJsx];
                }
              }
              return finalJsx;
            })}
          </Row>
        </Container>
      </div>
    </div>
  );
}
