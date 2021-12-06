import NavigationBar from "../components/Navbar";
import "../styles/info.css";

export default function Info() {
  return (
    <div>
      <NavigationBar color={"black"} activeKey={3} />
      <div>
        <h1 className="title">Info</h1>
      </div>
    </div>
  );
}
