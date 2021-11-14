import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div>
      <h1> Landing </h1>
      <Link to="/fetch-data"> Fetch Data Page </Link>
      <Link to="/parse-data"> Parse Data Page </Link>
    </div>
  );
}
