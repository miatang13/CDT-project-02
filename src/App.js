import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Data from "./pages/Data";
import FetchData from "./pages/FetchData";
import Landing from "./pages/Landing";
import Main from "./pages/Main";
import ParseData from "./pages/ParseData";
import "./App.css";
import Analysis from "./pages/Analysis";
import NavigationBar from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route path="/analysis" component={Analysis} />
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
