import NavigationBar from "../components/Navbar";
import "../styles/info.css";

export default function Info() {
  return (
    <div>
      <NavigationBar color="rgb(130, 75, 219)" activeKey={3} />
      <div className="content__wrapper">
        <h1 className="title">Info</h1>
        <div id="bechdel__info">
          <p className="page__description">
            {" "}
            This data display is inspired by the inequities of female
            representation in film. Using the framework set by the Bechdel test,
            we are highlighting directors that have made up to 2 movies that
            pass the Bechdel test’s 3 rules:
          </p>{" "}
          <ol>
            {" "}
            <li> At least two women are featured. </li>
            <li> These two women have a conversation. </li>{" "}
            <li> The conversation is about something other than a man.</li>
          </ol>
          <p className="page__description">
            *We acknowledge that the Bechdel Test is not the end all be all test
            of feminism, but it still begins to quantify the marginalization of
            women in film and thus starts a compelling conversation.{" "}
          </p>{" "}
        </div>
        <div id="howto_info">
          {" "}
          <h1 className="title">How to Use the (bech)ideal</h1>
          <p className="page__description">
            {" "}
            All the directors’ passing moviesare displayed, with different data
            points around them. If you are interested in learning more about a
            director, you can add up to 4 directors to your shopping cart and
            compare them. You can also see what others in media are saying about
            a given director through linked New York Times articles.{" "}
          </p>
        </div>
      </div>
    </div>
  );
}
