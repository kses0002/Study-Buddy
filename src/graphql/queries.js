/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getStudent = /* GraphQL */ `
  query GetStudent($id: ID!) {
    getStudent(id: $id) {
      id
      email
      firstName
      lastName
      aboutMe
      degree
      units
      studyMode
      createdAt
      updatedAt
    }
  }
`;
export const listStudents = /* GraphQL */ `
  query ListStudents(
    $filter: ModelStudentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStudents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        email
        firstName
        lastName
        aboutMe
        degree
        units
        studyMode
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const studentByEmail = /* GraphQL */ `
  query StudentByEmail(
    $email: String
    $sortDirection: ModelSortDirection
    $filter: ModelStudentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    studentByEmail(
      email: $email
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        email
        firstName
        lastName
        aboutMe
        degree
        units
        studyMode
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
