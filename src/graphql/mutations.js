/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser($data: AddUserInput!) {
    createUser(data: $data) {
      id
      rollNumber
      name
      qualification
      image
      userType
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser($data: UpdateUserInput!) {
    updateUser(data: $data) {
      id
      rollNumber
      name
      qualification
      image
      userType
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser($rollNumber: String!) {
    deleteUser(rollNumber: $rollNumber) {
      rollNumber
    }
  }
`
export const Loginuser=`
 mutation loginUser($data:LoginInput!){
   loginUser(data:$data){
    token
   }
}
`
;
