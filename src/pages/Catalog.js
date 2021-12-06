import Button from "@restart/ui/esm/Button";
import { useState } from "react";
import {
  Col,
  Row,
  Container,
  ButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import NavigationBar from "../components/Navbar";
import complete_data from "../data/final-data.json";
import "../styles/catalog.css";

export default function Catalog() {
  const [sortByBO, setSort] = useState(false);
  const [displayData, setData] = useState(complete_data);
  let sortedData = [...complete_data].sort(function (a, b) {
    return b.boxOfficeAvg - a.boxOfficeAvg;
  }); // descending order
  let lastMovieCnt = 0;

  const handleSort = () => {
    const sort = !sortByBO;
    setSort(sort);
    if (sort) {
      setData(sortedData);
    } else {
      setData(complete_data);
    }
  };

  return (
    <div>
      <NavigationBar activeKey={2} color="rgb(130, 75, 219)" />

      <div id="catalog__content" className="content__wrapper">
        <h1 className="title">Catalog</h1>
        <p className="page__description">
          This is as comprehensive catalog of {complete_data.length} directors
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
          <Row>
            {displayData.map((director, index) => {
              let nameJsx = (
                <Col md={4}>
                  <span className="directorName">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-file-person"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12 1a1 1 0 0 1 1 1v10.755S12 11 8 11s-5 1.755-5 1.755V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z" />
                      <path d="M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                    </svg>{" "}
                    {director.name}
                  </span>
                </Col>
              );
              let finalJsx = nameJsx;
              if (sortByBO) {
                if (index % 11 === 0) {
                  let label = (
                    <div>
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
                    <div>
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
