import * as React from "react";
import "./App.css";
import {withRouter, Switch, Route, Redirect} from "react-router-dom";
import Diagram from "./containers/diagram/Diagram";
import Details from "./containers/details/Details";
import "antd/dist/antd.css";

interface AppProps {

}

interface AppState {

}

export default class App extends React.Component<AppProps, AppState> {

    constructor(props: AppProps) {
        super(props);
    }

    render() {
        return (
           <Switch>
               <Route path="/diagram" exact={false} component={Diagram}/>
               <Route path="/details/:id" exact={false} component={Details}/>
               <Redirect to="/diagram"/>
           </Switch>
        );
    }

}