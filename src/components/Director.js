export default function Director(props) {
  return (
    <div>
      <h1> Single director component </h1>
      <h4> Director name: {props.director_name}</h4>
      {props.movies.map((movie, i) => (
        <div>
          <h3> Movie Name: {movie.Title} </h3>
          <h3> Movie Year: {movie.Year} </h3>
        </div>
      ))}
      {/* <p> {props.movies} </p> */}
    </div>
  );
}
