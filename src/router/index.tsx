import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import routerMap from "./config";


const RouterView = () => {
  return (

    <Router>
      <Redirect to="/home"></Redirect>
      <Switch>
        {routerMap.map((item, index) => (
          <Route key={index} path={item.path} component={item.page} />
        ))}
      </Switch>
    </Router>
  
  );
};

export default RouterView;
