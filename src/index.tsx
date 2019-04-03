import * as React from "react";
import * as ReactDOM from "react-dom";
import {BrowserRouter as Router, Route, withRouter, Switch} from "react-router-dom";
import "./index.css";
import App from "./App";
import * as initReactFastclick from "react-fastclick";
/*import createHistory from "history/createBrowserHistory";
const history = createHistory();*/

initReactFastclick();

ReactDOM.render(
    <Router>
        <Switch>
            <Route path="/" component={App}/>
        </Switch>
    </Router>,
    document.getElementById("root") as HTMLElement
);
