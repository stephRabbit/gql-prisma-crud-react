import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import { gql } from 'apollo-boost'

import ErrorMessage from './ErrorMessage'
import Spinner from './Spinner/Spinner'

class EditCourse extends Component {
  state = {
    name: '',
    description: '',
  }

  onChangeHandler = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(() => ({ [name]: value }))
  }

  redirectHome = () => {
    this.props.history.push('/')
  }

  render() {
    const { name, description } =  this.state
    return (
      <div>
        <Query
          query={COURSE_BY_ID_QUERY}
          variables={{ id: this.props.match.params.id }}
        >
          {({ data: { course }, error, loading }) => {
            if (loading) return <Spinner />
            if (error) return <ErrorMessage error={error} />

            return (
              <Mutation
                mutation={UPDATE_COURSE_MUTATION}
                variables={{
                  name,
                  description
                }}
                onCompleted={this.redirectHome}
              >
                {(updateCourse, { data, error, loading }) => {
                  if (loading) return <Spinner />
                  if (error) return <ErrorMessage error={error} />

                  return (
                    <div className="container">
                      <div className="card">
                        <div className="card-title">
                          <h3>Create Course</h3>
                        </div>
                        <div className="card-body">
                          <form onSubmit={async e => {
                              e.preventDefault()
                              try {
                                await updateCourse({
                                  variables: {
                                    id: this.props.match.params.id,
                                    name,
                                    description,
                                    isPublished: false,
                                  },
                                  optimisticResponse: {
                                    __typename: 'Mutation',
                                    updateCourse: {
                                      id: this.props.match.params.id,
                                      name,
                                      description,
                                      isPublished: false,
                                      __typename: 'Course',
                                    },
                                  },
                                })
                              }
                              catch(e) {
                                console.log('updateCourse: ', e)
                              }
                            }}
                          >
                            <div className="form-group">
                              <label htmlFor="name">Name</label>
                              <input
                                type="text"
                                className="form-control"
                                name="name"
                                placeholder="Enter name"
                                defaultValue={course.name}
                                onChange={this.onChangeHandler}
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="description">Description</label>
                              <textarea
                                className="form-control"
                                name="description"
                                placeholder="Enter description"
                                rows="3"
                                defaultValue={course.description}
                                onChange={this.onChangeHandler}
                              />
                            </div>
                            <button
                              type="submit"
                              className="btn btn-primary btn-block"
                            >
                              Save
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  )
                }}
              </Mutation>
            );
          }}
        </Query>
      </div>
    );
  }
}

const COURSE_BY_ID_QUERY = gql`
  query Course($id: ID!) {
    course(id: $id) {
      id
      description
      isPublished
      name
    }
  }
`
const UPDATE_COURSE_MUTATION = gql`
  mutation UpdateCourse($id: ID!, $name: String, $description: String) {
    updateCourse(id: $id, name: $name, description: $description) {
      id
      description
      isPublished
      name
    }
  }
`

export default EditCourse
