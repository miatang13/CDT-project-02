import NavigationBar from "../components/Navbar";
import complete_data from "../data/final-data.json";
import "../styles/catalog.css";

export default function Catalog() {
  return (
    <div>
      <NavigationBar activeKey={2} color="rgb(130, 75, 219)" />

      <div id="catalog__content"></div>
      <h1 className="title">Catalog</h1>
    </div>
  );
}
