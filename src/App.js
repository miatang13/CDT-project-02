import { BrowserRouter, Route, Switch } from "react-router-dom";
import Data from "./pages/Data";
import FetchData from "./pages/FetchData";
import Landing from "./pages/Landing";
import Main from "./pages/Main";
import ParseData from "./pages/ParseData";
import "./App.css";
import "./styles/typeface.css";
import Analysis from "./pages/Analysis";
import Info from "./pages/Info";
import Catalog from "./pages/Catalog";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route>
          <Switch>
            <Route exact path="/CDT-project-02/" component={Main} />
            <Route path="/CDT-project-02/analysis" component={Analysis} />
            <Route path="/CDT-project-02/catalog" component={Catalog} />
            <Route path="/CDT-project-02/info" component={Info} />
            <Route path="/data" component={Data} />
            <Route path="/fetch-data" component={FetchData} />
            <Route path="/parse-data" component={ParseData} />
          </Switch>
        </Route>
      </BrowserRouter>
    </div>
  );
}

export default App;
