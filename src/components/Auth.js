import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'

import { AUTH_TOKEN } from '../constants'
import ErrorMessage from './ErrorMessage'
import Spinner from './Spinner/Spinner'
import './Auth.css'

class Auth extends Component {
  state = {
    email: '',
    password: '',
    loginPath: false,
  }

  static getDerivedStateFromProps(props) {
    const { path } = props.match
    if (path === '/login') {
      return { loginPath: true }
    }
    else {
      return { loginPath: false }
    }
  }

  onInputChange = e => {
    const { name, value } = e.target
    this.setState(() => ({ [name]: value }))
  }

  onSubmit = authMutate => async e => {
    e.preventDefault()
    try {
      const authResults = await authMutate()
      if (this.state.loginPath) {
        localStorage.setItem(AUTH_TOKEN, authResults.data.login.token)
      }
      else {
        localStorage.setItem(AUTH_TOKEN, authResults.data.signUp.token)
      }
      this.props.history.push('/')
    }
    catch(error) {
      console.log('Login mutation error: ', error)
    }
  }

  render() {
    const { email, password, loginPath } = this.state
    return (
      <Mutation
        mutation={loginPath ? LOGIN_MUTATION : SIGNUP_MUTATION}
        variables={{
          email,
          password,
        }}
      >
        {(authMutate, { data, error, loading }) => {
          if (error) return <ErrorMessage error={error} />
          if (loading) return <Spinner />
          return (
            <div className="auth-form">
              <form className="form-signin" onSubmit={this.onSubmit(authMutate)}>
                <h1 className="h3 mb-3 font-weight-normal">Please {loginPath ? 'login' : 'sign up'}</h1>
                <label htmlFor="inputEmail" className="sr-only">
                  Email address
                </label>
                <input
                  autoFocus
                  className="form-control"
                  name="email"
                  onChange={this.onInputChange}
                  placeholder="Email address"
                  type="email"
                  value={email}
                />
                <label htmlFor="inputPassword" className="sr-only">
                  Password
                </label>
                <input
                  className="form-control"
                  name="password"
                  onChange={this.onInputChange}
                  placeholder="Password"
                  type="password"
                  value={password}
                />
                <button
                  className="btn btn-lg btn-primary btn-block"
                  type="submit"
                >
                {loginPath ? 'Login' : 'Sign up'}
                </button>
              </form>
            </div>
          )
        }}
      </Mutation>
    )
  }
}

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`

const SIGNUP_MUTATION = gql`
  mutation SignUp($email: String!, $password: String!) {
    signUp(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`

export default Auth
