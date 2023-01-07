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
      email
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
    user{
      id
      rollNumber
      name
      email
      qualification
      image
      userType
    }
   }
}
`
export const optCode = /* GraphQL */ `
  mutation getOtpCode($data:OptCodeInput!) {
    getOtpCode(data:$data) {
      optCode
    }
  }
`
export const updatepassword = /* GraphQL */ `
  mutation updatePassword($data: UpdateUserInput!) {
    updatePassword(data: $data) {
      password
      id
      rollNumber
      name
      qualification
      image
      userType
      email
    }
  }
`;
;
