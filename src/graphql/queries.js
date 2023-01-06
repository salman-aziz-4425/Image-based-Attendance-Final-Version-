/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($rollNumber: String!) {
    getUser(rollNumber: $rollNumber) {
      id
      rollNumber
      name
      qualification
      image
      userType
    }
  }
`;
export const getAllUsers = /* GraphQL */ `
  query GetAllUsers {
    getAllUsers {
      id
      rollNumber
      name
      qualification
      image
      userType
    }
  }
`;

export const getS3Url = `
  query GetS3Url {
    getS3Url {
      s3Url
      key
  }
  }
`;
