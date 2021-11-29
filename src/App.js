import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import data from "./data/response(0-200).json";
import Data from "./pages/Data";
import FetchData from "./pages/FetchData";
//import FetchData from "./pages/FetchData";
import Landing from "./pages/Landing";
import Main from "./pages/Main";
import ParseData from "./pages/ParseData";
//import data from "./data/bechdel-test-test.json";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route>
          <Switch>
            <Route exact path="/" component={Main} />
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

/* 
      <BrowserRouter>
        <Route>
          <Switch>
            <Route exact path="/" component={Landing} />
          </Switch>
        </Route>
      </BrowserRouter>
      */
