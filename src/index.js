import React from 'react'
import ReactDOM from 'react-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'

import { AUTH_TOKEN } from './constants'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
    // if a token exist in localStorage
    const token = localStorage.getItem(AUTH_TOKEN)
    // Add token "authorization" header, or send null or empty otherwise
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : null
      }
    })
  },
  onError: ({ graphQLErrors, networkError }) => {
    // Remove token from localStorage on error
    if (graphQLErrors) {
      console.log(graphQLErrors)
    }
    if (networkError) {
      // Logout user if token has expired
      if (networkError.statusCode === 401) {
        localStorage.removeItem(AUTH_TOKEN)
      }
    }
  },
  // clientState: {
  //   defaults: {
  //     isConnected: true
  //   },
  //   resolvers: {
  //     Mutation: {
  //       updateNetworkStatus: (_, { isConnected }, { cache }) => {
  //         cache.writeData({ data: { isConnected }});
  //         return null;
  //       }
  //     }
  //   }
  // },
  // cacheRedirects: {
  //   Query: {
  //     movie: (_, { id }, { getCacheKey }) =>
  //       getCacheKey({ __typename: 'Movie', id });
  //   }
  // },
})

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
