import React, { Suspense, Fragment, lazy } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";
import GuestGuard from "./components/GuestGuard";
import LoadingScreen from "./components/LoadingScreen";



export const renderRoutes = (routes = []) => (
 
  <Suspense fallback={<LoadingScreen />}>
    <Switch>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={(props) => (
              <Guard>
                <Layout>
                  {route.routes ? (
                    renderRoutes(route.routes)
                  ) : (
                    <Component {...props} />
                  )}
                </Layout>
              </Guard>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
);

const routes = [
  {
    exact: true,
    path: "/404",
    component: () => <Redirect to="/" />,
  },
  {
    exact: true,
    guard: GuestGuard,
    // layout: AuthLayout,

    path: "/login",
    component: lazy(() => import("./pages/Auth/login/index")),
  },
  {
    exact: true,
    guard: GuestGuard,
    // layout: AuthLayout,
    path: "/signup",
    component: lazy(() => import("./pages/Auth/signup/index")),
  },

  {
    path: "/",
    guard: AuthGuard,
    // layout: Mainlayout,
    routes: [
      {
        exact: true,
        path: "/chat",
        component: lazy(() => import("./pages/Chat/index")),
      },
      {
        path: "*",
        component: lazy(() => import("./pages/NotFound")),
      },
    ],
  },
];

export default routes;
