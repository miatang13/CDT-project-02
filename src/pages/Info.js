import NavigationBar from "../components/Navbar";
import "../styles/info.css";

export default function Info() {
  return (
    <div>
      <NavigationBar color="rgb(130, 75, 219)" activeKey={3} />
      <div className="content__wrapper">
        <h1 className="title">Info</h1>
      </div>
    </div>
  );
}
