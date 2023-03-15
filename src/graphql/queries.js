/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($rollNumber: String!) {
    getUser(rollNumber: $rollNumber) {
      id
      rollNumber
      name
      email
      qualification
      password
      image
      userType
      phoneNo
    }
  }
`;
export const getAllUsers = /* GraphQL */ `
  query GetAllUsers {
    getAllUsers {
      id
      rollNumber
      name
      email
      qualification
      password
      image
      userType
      phoneNo
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
`
export const analyzeImage=`
query analyzeImage($rollNumber: String,$imageS3Key:String!) {
  analyzeImage(rollNumber:$rollNumber,imageS3Key:$imageS3Key){
    rollNumber
    faceConf
  }
}
`

export const comparingFaces=`
query comparingFaces($rollNumbers:[String],$trgImage:String!){
  comparingFaces(rollNumbers:$rollNumbers,trgImage:$trgImage){
    msg
  }
}
`
export const LastComparison=`
query receiverSqsComparison{
  receiverSqsComparison{
    msg
    resp{
      rollNumber
      faceConf
    }
  }
}
`
;
