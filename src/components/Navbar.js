import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { baseUrl } from "../utility/file";

export default function NavigationBar(props) {
  const handleSelect = (eventKey) => console.log(`selected ${eventKey}`);
  const svgParams = {
    width: 20,
    height: 20,
  };

  return (
    <Nav
      className="justify-content-end"
      style={{ borderBottom: "1px solid rgb(130, 75, 219)" }}
      activeKey={props.activeKey}
      // onSelect={handleSelect}
    >
      <Nav.Item>
        <Link
          style={{ color: props.color }}
          className={props.activeKey === 1 ? "active" : ""}
          eventKey="1"
          to={baseUrl + "/"}
        >
          Gallery
        </Link>
      </Nav.Item>
      <Nav.Item>
        <Link
          style={{ color: props.activeKey === 2 ? "white" : props.color }}
          eventKey="2"
          to={baseUrl + "/catalog"}
          className={props.activeKey === 2 ? "active" : ""}
        >
          Catalog
        </Link>
      </Nav.Item>
      <Nav.Item>
        <Link
          to={baseUrl + "/info"}
          className={props.activeKey === 3 ? "active" : ""}
          style={{ color: props.activeKey === 3 ? "white" : props.color }}
          eventKey="3"
        >
          Info
        </Link>
      </Nav.Item>
      <Nav.Item>
        <Link
          to={baseUrl + "/analysis"}
          className={props.activeKey === 4 ? "active" : ""}
          eventKey="4"
          style={{ color: props.activeKey === 4 ? "white" : props.color }}
        >
          Analysis
        </Link>
      </Nav.Item>
    </Nav>
  );
}
