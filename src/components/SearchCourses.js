import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import { gql } from 'apollo-boost'
import Proptypes from 'prop-types'

import Spinner from './Spinner/Spinner'

class SearchCourses extends Component {
  state = {
    courses: [],
    filter: '',
    loading: false
  }

  onChangeHandler = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(() => ({ [name]: value }))
  }

  triggerSearch = async e => {
    e.preventDefault()
    const { client } = this.props
    const { filter } = this.state

    if (!filter) return;

    this.setState(() => ({ loading: true }))

    const { data } = await client.query({
      query: SEARCH_QUERY,
      variables: {
        filter,
        loading: false,
      },
    })

    this.setState(() => ({
      courses: data.courseFeed.courses,
      loading: false,
    }))
  }

  render() {
    const { courses, filter, loading, } = this.state
    return (
      <div className="container" style={{paddingTop: '1rem'}}>
        <form onSubmit={this.triggerSearch}>
          <div className="form-row">
            <div className="col-10">
              <input
                className="form-control"
                name="filter"
                onChange={this.onChangeHandler}
                placeholder="Search"
                type="text"
                value={filter}
              />
            </div>
            <div className="col-2">
              <button className="btn btn-primary">
                Search
              </button>
            </div>
          </div>
        </form>
        { loading && <Spinner />}
        {
          courses.length > 0 && courses.map(({ description, id, name, }) => (
            <div
              className="card container"
              key={id}
            >
              <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">{description}</p>
              </div>
            </div>
          ))
        }
      </div>
    )
  }
}

SearchCourses.protoTypes = {
  client: Proptypes.object.isRequired
}

const SEARCH_QUERY = gql`
  query SearchCourse($filter: String!) {
    courseFeed(filter: $filter) {
      courses {
        name
        description
        id
      }
      count
    }
  }
`

export default withApollo(SearchCourses)
