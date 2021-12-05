import NavigationBar from "../components/Navbar";

export default function Analysis() {
  const cartData = JSON.parse(localStorage.getItem("cart"));
  console.log(cartData);

  return (
    <div className="root">
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
