/**
 * The beginning of the application starts here and it loads all the components. 
 * In the app component there are 7 routes that the app chooses from.
 * It starts with / and it redirects it automatically to /welcome
 * /welcome can direct to /login
 * /login can direct to one of the three dashboards: AdminDashboard, CustomerDashboard, CompanyDashboard.
 * 
 * 
 */
import { Fragment, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from './LoginComponents/Login/Login';
import Welcome from './LandingPage/Welcome';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { authActions } from './store/auth';
import CompanyDashBoard from './CompanyComponents/CompanyLayout/CompanyDashBoard';
import CustomerDashBoard from './CustomerComponents/CustomerLayout/CustomerDashBoard';
import AdminDashBoard from './AdminComponents/AdminLayout/AdminDashBoard';
import PageNotFound from './NotFoundPage/NotFoundPage';

export type Client = {
  email: String,
  password: String,
  clientType: String
}

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

  // uses the auth and checks if there is a user logged in
  useEffect(() => {
    dispatch(authActions.assert())
  }, [isAuth]);

  return (
    <Fragment>
      <main>
        <Switch>
          <Route path='/' exact>
            <Redirect to='/welcome' />
          </Route>
          <Route path='/welcome' exact>
            <Welcome />
          </Route>
          <Route path='/pageNotFound' exact>
            <PageNotFound />
          </Route>
          <Route path='/login' exact >
            <div>
              {!isAuth && <Login />}
              {isAuth && <Login />}
            </div>
          </Route>
          <Route path='/login/Company' exact >
            <div>
              {!isAuth && <Login />}
              {isAuth && <CompanyDashBoard />}
            </div>
          </Route>
          <Route path='/login/Customer' exact >
            <div>
              {!isAuth && <Login />}
              {isAuth && <CustomerDashBoard />}
            </div>
          </Route>
          <Route path='/login/Admin' exact >
            <div>
              {!isAuth && <Login />}
              {isAuth && <AdminDashBoard />}
            </div>
          </Route>
        </Switch>
      </main>
    </Fragment>
  );
}

export default App;