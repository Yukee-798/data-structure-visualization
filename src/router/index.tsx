import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import routerMap from "./config";


const RouterView = () => {
  return (

    <Router>
      <Redirect to="/login"></Redirect>
      <Switch>
        {routerMap.map((item, index) => (
          <Route key={index} path={item.path} component={item.component}></Route>
        ))}
      </Switch>
    </Router>
  );
};

export default RouterView;
