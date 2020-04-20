import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Route, withRouter } from "react-router-dom";
import { useAuth0 } from "../react-auth0-spa";

const PrivateRoute = ({ component: Component, path, ...rest }) => {
  const { loading, isAuthenticated, loginWithRedirect, user } = useAuth0();

  useEffect(() => {
    if (loading || isAuthenticated) {
      return;
    }
    
    const fn = async () => {
      const id = (new URLSearchParams(window.location.search)).get("id");
      const url = `/?id=${id}`;
      await loginWithRedirect({
        appState: { targetUrl: url }
      });
    };

    fn();
  }, [loading, isAuthenticated, loginWithRedirect, path]);

  const render = props => isAuthenticated === true ? <Component {...props} user={user} /> : null;

  return <Route path={path} render={render} {...rest} />;
};

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
  path: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired
};

export default withRouter(PrivateRoute);