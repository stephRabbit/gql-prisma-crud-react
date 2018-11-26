import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { AuthRoute, UnauthRoute } from 'react-router-auth'

import { AUTH_TOKEN } from './constants'
import Auth from './components/Auth'
import Courses from './components/Courses'
import CreateCourse from './components/CreateCourse'
import EditCourse from './components/EditCourse'
import Header from './components/Header'
import NotFound from './components/NotFound'
import SearchCourses from './components/SearchCourses';

class App extends Component {
  render() {
    const isAuth = !!localStorage.getItem(AUTH_TOKEN)
    console.log(isAuth)
    return (
      <div>
        <Header />
        <Switch>
          <Route
            component={Courses}
            exact
            path="/"
          />
          <UnauthRoute
            component={Auth}
            path="/login"
            redirectTo="/"
            authenticated={isAuth}
          />
          <UnauthRoute
            component={Auth}
            path="/signup"
            redirectTo="/"
            authenticated={isAuth}
          />
          <AuthRoute
            authenticated={isAuth}
            component={CreateCourse}
            path="/create"
            redirectTo="/login"
          />
          <AuthRoute
            authenticated={isAuth}
            component={EditCourse}
            path="/course/:id/edit"
            redirectTo="/login"
          />
          <Route
            component={SearchCourses}
            path="/search"
          />
          <Route
            component={NotFound}
            path=""
          />
        </Switch>
      </div>
    )
  }
}

export default App
