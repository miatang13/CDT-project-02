import { useSelector } from "react-redux";
import NavigationBar from "../components/Navbar";
import complete_data from "../data/ranked-directors(>2).json";

export default function Analysis() {
  const cartData = JSON.parse(localStorage.getItem("cart"));
  console.log(cartData);

  return (
    <div>
      <NavigationBar />
      {cartData.map((item, index) => (
        <div key={item.name + index}>
          <h1> Director {item.name}</h1>
          <h4> Movies </h4>
          {item.movies.map((movieObj) => (
            <span> {movieObj.Title} </span>
          ))}
          <hr></hr>
        </div>
      ))}
    </div>
  );
}
