import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import routers, { root } from "./config";


const RouterView = () => {
  return (

    <Router>
      <Switch>
        {routers.map((item, index) => {
          if (index === 0) {
            return <Route key={index} path={item.path} component={item.page} />
          } 
          return <Route key={index} path={item.path + ''} component={item.page} />
        })}
        {/* {
          routers.map((item, index) => {
            console.log(item);
          })
        } */}
      </Switch>
      <Redirect to={root + "/home"} />

    </Router>

  );
};

export default RouterView;
