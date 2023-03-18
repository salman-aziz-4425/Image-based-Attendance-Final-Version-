import React, { useEffect, useState } from "react";
import * as XLSX from 'xlsx'
import DashboardLayout from "../../containers/DashboardLayout/DashboardLayout";
import { Button,Input } from "antd";
import UploadImage from "../../components/utility/imageUploading";
import { API, Amplify, graphqlOperation } from "aws-amplify";
import { getAllUsers } from "../../src/graphql/queries";
import { useDispatch,useSelector } from "react-redux";
import { tokenAuth } from "../../redux/userlogin/userSlice";
import { getS3Url } from "../../src/graphql/queries";
import { comparingFaces } from "../../src/graphql/queries";
import { LastComparison } from "../../src/graphql/queries";
export default function GroupImage() {
const [excelFile, setExcelFile]=useState(null);
const [excelFileError, setExcelFileError]=useState(null);  
const [images, setImages] = React.useState([]);
const [rollNumbers,setrollNumbers]=useState([])
const [allUsers,setAllUsers]=useState([])
const token=useSelector(state=>state.userReducer.token)
Amplify.configure({
  API: {
    graphql_headers: async () => ({
      token: token,
    }),
  },
});
const dispatch=useDispatch()
// submit
const [excelData, setExcelData]=useState(null);
// it will contain array of objects
useEffect(async () => {
  const Data =
    localStorage.getItem("Token") &&
    JSON.parse(localStorage.getItem("Token"));
  if (Data?.Auth === false || !localStorage.getItem("Token")) {
    Router.push("/");
  } else {
    dispatch(
      tokenAuth({
        id: Data?.id,
        token: Data?.token,
        name: Data?.name,
        email: Data?.email,
        image: Data?.image,
        qualification: Data?.qualification,
        rollNumber: Data?.rollNumber,
        Auth: true,
      })
    );
  }
},[]);
useEffect(async ()=>{
  await API.graphql({
    query: getAllUsers,
    authToken:token,
  }).then((result) => {
    setAllUsers(result?.data?.getAllUsers)
  });
},[])

const storeImageToS3Bucket = async () => {
  if (images === undefined || images.length < 1) {
    alert("no pic image");
    setError({ ...error, image: "Kindly upload your picture" });
    return;
  }
  console.log("Image List => ", images[0]?.data_url);
  const image = images[0]?.file;
  //  Get Secure URL from our server
  const res = await API.graphql(graphqlOperation(getS3Url));
  //  Post the image directly to S3 bucket
  console.log("Res => ", res);
  const s3obj = res.data.getS3Url;
  console.log("Url :- ", s3obj);
  await fetch(s3obj?.s3Url, {
    method: "PUT",
    headers: {
      ContentType: "multipart/form-data",
    },
    body: image,
  })
    .then((res) => {
      console.log("Bucket Res ", res, " s3obj ", s3obj?.key);
    })
    .catch((err) => {
      console.log("Error => ", err);
      return undefined;
    });
  return s3obj?.key;
};
// handle File
const fileType=['application/vnd.ms-excel'];
const handleFile = (e)=>{
  console.log("hello")
  let selectedFile = e.target?.files[0];
  // if(selectedFile){
    console.log(selectedFile?.type);
    // if(selectedFile&&fileType.includes(selectedFile.type)){
      let reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile);
      reader.onload=(e)=>{
        setExcelFileError(null);
        setExcelFile(e.target.result);
      } 
    }
//   //   else{
//   //     setExcelFileError('Please select only excel file types');
//   //     setExcelFile(null);
//   //   }
//   // }
//   // else{
//   //   console.log('plz select your file');
//   // }
// }

// submit function
const handleSubmit=async (e)=>{
  e.preventDefault();
  if(excelFile!==null){
    const workbook = XLSX.read(excelFile,{type:'buffer'});
    const worksheetName = workbook.SheetNames[0];
    const worksheet=workbook.Sheets[worksheetName];
    let data = XLSX.utils.sheet_to_json(worksheet);
    data=data.slice(6)
    data.pop()
    // console.log(data)
    console.log(data[0]?.__EMPTY_1?.includes("F"))
    try{
      let rollNumber=[]
      data.map((user)=>{
        rollNumber.push(user?.__EMPTY_1)
      })
      // rollNumbers.pop()
      setrollNumbers(rollNumber)
      console.log(rollNumber)
      //for loop to get keys

      const imageKey=await storeImageToS3Bucket()
      const variables={
        rollNumbers:rollNumber,
        trgImage:imageKey
      }
      console.log(variables)
      const responseComparison=await API.graphql(graphqlOperation(comparingFaces,variables))
      console.log(responseComparison)
      await new Promise(r => setTimeout(r, 20000));
      const lastResponse=await API.graphql(graphqlOperation(LastComparison))
      console.log(lastResponse)
      // rollNumbers=lastResponse.data.receiverSqsComparison.resp.filter((user)=>{
      //   let index=rollNumbers.findIndex((user1)=>{
      //     return user.rollNumber===user1
      //   })
      //   return index!=-1
      // })
      // setrollNumbers(rollNumbers)
      // console.log(rollNumbers)
      //ends here
    }catch{
      alert("Invalid properties")
    }
  
  }
  else{
    setExcelData(null);
  }
}
  return (
    <DashboardLayout>
      <div className="w-5/7 h-5/7 my-8 mx-10 bg-white font-extrabold align-middle rounded-md shadow-2xl overflow-hidden">
      <div className="flex pt-5 pb-0 px-4 overflow-hidden">
          <h1 className="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-gray-700 to-red-700">
            {" "}
            Mark Attendance
          </h1>
        </div>
        <div className="flex flex-row items center justify-center space-x-10">
        <div className="flex flex-col items-center justify-center mt-[15%] space-y-5">
        <Input className="w-60"  type="file" onChange={handleFile}></Input>
          <Button type="button" onClick={handleSubmit}>Upload</Button>
        </div>
        <div className="mt-[15%] w-[30%]">
        <UploadImage setImagesFunc={setImages} />
        </div>
        </div>
        <div className="flex flex-row space-x-5 mt-[10%] mx-[4%] overflow-auto">
          {
            allUsers.map((user)=>(
              <img className="h-40 w-60 rounded-md mb-8" src={user.image} alt="hello"/>
            ))
          }
        </div>
      </div>
    </DashboardLayout>
  );
}
