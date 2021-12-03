import { Nav, Navbar } from "react-bootstrap";

export default function NavigationBar() {
  return (
    <Navbar className="border-bottom">
      <Nav.Item>
        <Nav.Link href="/">What is the Bechdel Test?</Nav.Link>{" "}
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/">View All</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/">Box Office</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/">Key</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/analysis">Chosen</Nav.Link>
      </Nav.Item>
    </Navbar>
  );
}
