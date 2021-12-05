import { Dropdown, Nav, Navbar, NavDropdown } from "react-bootstrap";

export default function NavigationBar(props) {
  console.log(props);
  const handleSelect = (eventKey) => console.log(`selected ${eventKey}`);
  const svgParams = {
    width: 25,
    height: 25,
  };
  const dropdownColor = props.color === "white" ? "black" : "white";

  return (
    // <Navbar className="border-bottom">
    //   <Nav.Item>
    //     <span> Website Name</span>
    //   </Nav.Item>
    //   <Nav.Item>
    //     <Nav.Link href="/">View All</Nav.Link>
    //   </Nav.Item>
    //   <Nav.Item>
    //     <Nav.Link href="/info">Info</Nav.Link>
    //   </Nav.Item>
    //   <Nav.Item>
    //     <Nav.Link href="/analysis">
    //       <svg
    //         xmlns="http://www.w3.org/2000/svg"
    //         width="25"
    //         height="25"
    //         fill={props.color}
    //         className="bi bi-cart4"
    //         viewBox="0 0 16 16"
    //       >
    //         <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
    //       </svg>
    //     </Nav.Link>
    //   </Nav.Item>
    // </Navbar>
    <Nav
      className="justify-content-end border-bottom"
      // variant="tabs"
      activeKey={props.activeKey}
      onSelect={handleSelect}
    >
      <Nav.Item>
        <Nav.Link style={{ color: props.color }} eventKey="1" href="/">
          View All
        </Nav.Link>
      </Nav.Item>
      <NavDropdown
        style={{ color: dropdownColor }}
        title="Sort"
        id="nav-dropdown"
      >
        <NavDropdown.Item style={{ color: props.color }} eventKey="2.1">
          Box Office 1
        </NavDropdown.Item>
        <NavDropdown.Item style={{ color: props.color }} eventKey="2.2">
          Box Office 2
        </NavDropdown.Item>
        <NavDropdown.Item style={{ color: props.color }} eventKey="2.3">
          Box Office 3
        </NavDropdown.Item>
      </NavDropdown>
      <Nav.Item>
        <Nav.Link href="/info" eventKey="3" title="Item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={svgParams.width}
            height={svgParams.height}
            fill={props.color}
            className="bi bi-info-square"
            viewBox="0 0 16 16"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/analysis" eventKey="4" title="Analysis">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={svgParams.width}
            height={svgParams.height}
            fill={props.color}
            className="bi bi-cart4"
            viewBox="0 0 16 16"
          >
            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
          </svg>
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
