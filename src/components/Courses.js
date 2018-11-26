import React, { Component, Fragment } from 'react'
import { Mutation, Query } from 'react-apollo'
import { gql } from 'apollo-boost'
import { Link } from 'react-router-dom';

import { AUTH_TOKEN, COURSES_PER_PAGE } from '../constants'
import ErrorMessage from './ErrorMessage'
import Spinner from './Spinner/Spinner'

class Courses extends Component {
  state = {
    page: 1,
  }

  getQueryVariables = () => {
    const first = COURSES_PER_PAGE
    const skip = (this.state.page - 1) * COURSES_PER_PAGE

    return {
      first,
      skip,
      orderBy: 'createdAt_DESC',
    }
  }

  nextPage = data => e => {
    const { page } = this.state
    if (page <= (data.courseFeed.count / COURSES_PER_PAGE)) {
      this.setState(prevState => ({
        page: prevState.page + 1
      }))
    }
  }

  prevPage = data => e => {
    const { page } = this.state
    if (page > 1) {
      this.setState(prevState => ({
        page: prevState.page - 1
      }))
    }
  }

  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    return (
      <div>
        <Query
          query={COURSE_FEED_QUERY}
          variables={this.getQueryVariables()}
        >
          {({ data, error, loading }) => {
            if (loading) return <Spinner />
            if (error) return <ErrorMessage error={error} />

            return (
              <Fragment>
                {
                  data.courseFeed.courses.map(({ name, description, id, isPublished, }) => (
                    <div
                      className="card container"
                      key={id}
                    >
                      <div className="card-body">
                        <h5 className="card-title">{name}</h5>
                        <p className="card-text">{description}</p>
                        {authToken && (
                          <Fragment>
                            <Link
                              className="btn btn-primary"
                              to={`/course/${id}/edit`}
                            >
                              Edit Course
                            </Link>
                            <Mutation
                              mutation={DELETE_COURSE_MUTATION}
                              variables={{ id, }}
                              update={(cache, { data: { deleteCourse } }) => {
                                //fetch the courseFeed from the cache
                                const { page } = this.state
                                const variables = {
                                  first: COURSES_PER_PAGE,
                                  skip: (page - 1) * COURSES_PER_PAGE,
                                  orderBy: 'createdAt_DESC',
                                }

                                const data = cache.readQuery({
                                  query: COURSE_FEED_QUERY,
                                  variables
                                })

                                const index = data.courseFeed.courses.findIndex(course => course.id === deleteCourse.id)
                                data.courseFeed.courses.splice(index, 1)

                                //update the courseFeed from the cache
                                cache.writeQuery({
                                  query: COURSE_FEED_QUERY,
                                  data,
                                  variables,
                                })
                              }}
                            >
                              {(deleteCourse, { data, error, loading }) => {
                                return (
                                  <button
                                    className="btn btn-danger"
                                    onClick={async () => await deleteCourse()}
                                    style={{marginLeft: '.5rem'}}
                                  >
                                    Delete
                                  </button>
                                )
                              }}
                            </Mutation>
                          </Fragment>
                        )}
                      </div>
                    </div>
                  ))
                }
                <nav aria-label="Page navigation example">
                  <ul className="pagination justify-content-center">
                    <li className="page-item">
                    <div
                      aria-label="Next"
                      className="page-link"
                      onClick={this.prevPage(data)}
                      style={{cursor: 'pointer'}}
                    >
                        <span aria-hidden="true">«</span>
                        <span className="sr-only">Previous</span>
                      </div>
                    </li>
                    <li className="page-item">
                      <div
                        aria-label="Next"
                        className="page-link"
                        onClick={this.nextPage(data)}
                        style={{cursor: 'pointer'}}
                      >
                        <span aria-hidden="true">»</span>
                        <span className="sr-only">Next</span>
                      </div>
                    </li>
                  </ul>
                </nav>
              </Fragment>
            )
          }}
        </Query>
      </div>
    )
  }
}

const COURSE_FEED_QUERY = gql`
  query CourseFeed($filter: String, $first: Int, $skip: Int, $orderBy: CourseOrderByInput) {
    courseFeed(filter: $filter, first: $first, skip: $skip, orderBy: $orderBy) {
      courses {
        name
        description
        id
        isPublished
        createdAt
      }
      count
    }
  }
`
const DELETE_COURSE_MUTATION = gql`
  mutation DeleteCourse($id: ID!) {
     deleteCourse(id: $id) {
       id
       name
     }
  }
`

export default Courses
