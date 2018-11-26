import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';

import ErrorMessage from './ErrorMessage'
import Spinner from './Spinner/Spinner'
import { COURSES_PER_PAGE } from '../constants';

class CreateCourse extends Component {
  state = {
    name: '',
    description: '',
  }

  onChangeHandler = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(() => ({ [name]: value }));
  }

  updateCache = (cache, { data: { createCourse } }) => {
    //fetch the courseFeed from the cache
    const variables = {
      first: COURSES_PER_PAGE,
      skip: 0,
      orderBy: 'createdAt_DESC',
    }

    let data = cache.readQuery({
      query: COURSE_FEED_QUERY,
      variables,
    })

    data.courseFeed.courses.unshift(createCourse)

    //update the courseFeed from the cache
    cache.writeQuery({
      query: COURSE_FEED_QUERY,
      data,
      variables,
    })
  }

  onSubmit = createCourse => e => {
    e.preventDefault();
    const { name, description } = this.state
    if (name.length && description.length) {
      createCourse().then(({ data }) => {
        this.props.history.push('/')
      })
    }
  }

  render() {
    const { name, description } = this.state

    return (
      <Mutation
        mutation={CREATE_COURSE_MUTATION}
        update={this.updateCache}
        variables={{
          name,
          description,
        }}
      >
        {(createCourse, { data, error, loading }) => {
          if (loading) return <Spinner />
          if (error) return <ErrorMessage error={error} />

          return (
            <div className="container">
              <div className="card">
                <div className="card-title">
                  <h3>Create Course</h3>
                </div>
                <div className="card-body">
                  <form
                    onSubmit={this.onSubmit(createCourse)}
                  >
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        placeholder="Enter name"
                        value={name}
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
                        value={description}
                        onChange={this.onChangeHandler}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">
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
      }
      count
    }
  }
`
const CREATE_COURSE_MUTATION = gql`
  mutation CreateCourse($name: String!, $description: String!) {
    createCourse(name: $name, description: $description) {
      id
      description
      isPublished
      name
    }
  }
`

export default CreateCourse