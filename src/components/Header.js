import React, { Component, Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'

import { AUTH_TOKEN } from '../constants'

class Header extends Component {
  logout = () => {
    localStorage.removeItem(AUTH_TOKEN)
    this.props.history.push('/')
  }

  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <Link
          className="navbar-brand" to="/"
        >
          Code Tutorials
        </Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <Link
              className="nav-item nav-link active"
              to="/"
            >
              Courses
            </Link>
            <Link
              className="nav-item nav-link active"
              to="/search"
            >
              Search Courses
            </Link>
            {authToken && (
              <Link
                className="nav-item nav-link active"
                to="/create"
              >
                Create Course
              </Link>
            )}
          </div>
          <div className="navbar-nav ml-auto">
            {authToken ? (
              <div
                className="nav-item nav-link active"
                onClick={this.logout}
                style={{ cursor: 'pointer' }}
              >
                Logout
              </div>
            ) : (
              <Fragment>
                <Link
                    className="nav-item nav-link active"
                    to="/signup"
                  >
                    Signup
                </Link>
                <Link
                  className="nav-item nav-link active"
                  to="/login"
                >
                  Login
                </Link>
              </Fragment>
            )}
          </div>
        </div>
      </nav>
    )
  }
}

export default withRouter(Header)
