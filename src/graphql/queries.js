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
      notifiedUsers
      recievedRequests
      buddies
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
        notifiedUsers
        recievedRequests
        buddies
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getMessage = /* GraphQL */ `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
      id
      author
      recepient
      body
      buddyPair
      createdAt
      updatedAt
    }
  }
`;
export const listMessages = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        author
        recepient
        body
        buddyPair
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getLatestMessage = /* GraphQL */ `
  query GetLatestMessage($id: ID!) {
    getLatestMessage(id: $id) {
      id
      author
      recepient
      body
      buddyPair
      createdAt
      updatedAt
      seen
    }
  }
`;
export const listLatestMessages = /* GraphQL */ `
  query ListLatestMessages(
    $filter: ModelLatestMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLatestMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        author
        recepient
        body
        buddyPair
        createdAt
        updatedAt
        seen
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
        notifiedUsers
        recievedRequests
        buddies
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const messageByBuddyPair = /* GraphQL */ `
  query MessageByBuddyPair(
    $buddyPair: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messageByBuddyPair(
      buddyPair: $buddyPair
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        author
        recepient
        body
        buddyPair
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const latestMessageByBuddyPair = /* GraphQL */ `
  query LatestMessageByBuddyPair(
    $recepient: String
    $sortDirection: ModelSortDirection
    $filter: ModelLatestMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    latestMessageByBuddyPair(
      recepient: $recepient
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        author
        recepient
        body
        buddyPair
        createdAt
        updatedAt
        seen
      }
      nextToken
    }
  }
`;
export const searchMessages = /* GraphQL */ `
  query SearchMessages(
    $filter: SearchableMessageFilterInput
    $sort: SearchableMessageSortInput
    $limit: Int
    $nextToken: String
    $from: Int
  ) {
    searchMessages(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
    ) {
      items {
        id
        author
        recepient
        body
        buddyPair
        createdAt
        updatedAt
      }
      nextToken
      total
    }
  }
`;
