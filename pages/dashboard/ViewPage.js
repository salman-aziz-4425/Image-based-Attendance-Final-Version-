import React, { useEffect, useState } from "react";
import * as XLSX from 'xlsx'
import DashboardLayout from "../../containers/DashboardLayout/DashboardLayout";
import { Button,Input } from "antd";
import UploadImage from "../../components/utility/imageUploading";
import { API, Amplify, graphqlOperation } from "aws-amplify";
import { getAllUsers } from "../../src/graphql/queries";
import { useDispatch,useSelector } from "react-redux";
import { tokenAuth } from "../../redux/userlogin/userSlice";
import Router from "next/router";
export default function ViewImage() {
const [excelFile, setExcelFile]=useState(null);
const [excelFileError, setExcelFileError]=useState(null);  
const [view,setView]=useState(false)
const [excelData, setExcelData]=useState([]);
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
// it will contain array of objects
// useEffect(async () => {
//   const Data =
//     localStorage.getItem("Token") &&
//     JSON.parse(localStorage.getItem("Token"));
//   if (Data?.Auth === false || !localStorage.getItem("Token")) {
//     Router.push("/");
//   } else {
//     dispatch(
//       tokenAuth({
//         id: Data?.id,
//         token: Data?.token,
//         name: Data?.name,
//         email: Data?.email,
//         image: Data?.image,
//         qualification: Data?.qualification,
//         rollNumber: Data?.rollNumber,
//         Auth: true,
//       })
//     );
//   }
// },[]);
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
const handleSubmit=(e)=>{
  e.preventDefault();
  if(excelFile!==null){
    const workbook = XLSX.read(excelFile,{type:'buffer'});
    const worksheetName = workbook.SheetNames[0];
    const worksheet=workbook.Sheets[worksheetName];
    let data = XLSX.utils.sheet_to_json(worksheet);
    data=data.slice(6)
    data.pop()
    setExcelData(data)
    console.log(excelData)
    setView(true)
  }
}
    return (
        <DashboardLayout>
          {
            view===false?<div className="w-5/7 h-5/7 my-8 mx-10 bg-white font-extrabold align-middle rounded-md shadow-2xl overflow-hidden">
          <div className="flex pt-5 pb-0 px-4 overflow-hidden">
              <h1 className="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-gray-700 to-red-700">
                {" "}
                View Attendance
              </h1>
            </div>
            <div className="flex flex-row items center justify-center space-x-10">
            <div className="flex flex-col items-center justify-center mt-[15%] space-y-5">
            <Input className="w-60"  type="file" onChange={handleFile}></Input>
              <Button type="button" onClick={handleSubmit}>Upload</Button>
            </div>
            </div>
          </div>:
           <div className="w-5/7 h-5/7 my-8 mx-10 bg-white font-extrabold align-middle rounded-md shadow-2xl overflow-hidden">
             <div className="flex pt-5 pb-0 px-4 overflow-hidden">
              <h1 className="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-gray-700 to-red-700">
                {" "}
                View Attendance
              </h1>
            </div>
           <div className="flex flex-col h-50 w-full mt-[5%] border-black border-y-2">
                             <thead >
                             <tr className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                     <th scope="col" className="text-sm font-medium text-gray-900 pl-4 py-4 text-left">
                       #
                     </th>
                     <th scope="col" className="text-sm font-medium text-gray-900 pl-[12rem] py-4 text-left">
                       RollNumber
                     </th>
                     <th scope="col" className="text-sm font-medium text-gray-900 pl-[14rem] py-4 text-left">
                       Names
                     </th>
                     <th scope="col" className="text-sm font-medium text-gray-900 pl-[65%] py-4 text-left">
                       Attendance
                     </th>
                   </tr>
                   </thead>
                   </div>   
                   <div className="min-w-full h-80  overflow-auto border-black border-y-1 border-x-1 border-b-2">
               <table className="min-w-full h-60 border-y-10">
               <tbody className='overflow-auto border-y-10'>
                   {
                     excelData.map((User,index)=>{
                     console.log(User.__EMPTY_1)
                       return(
                         <tr className="border-b">
                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                           {index+1}
                           </td>
                         <td className="text-sm text-gray-900 font-light px-2 py-4 whitespace-nowrap">
                           {User.__EMPTY_1}
                         </td>
                         <td className="text-sm text-gray-900 font-light px-1 py-4 whitespace-nowrap">
                         {User.__EMPTY_2}
                         </td>
                         <td className="text-sm text-gray-900 font-light px-1 py-4 whitespace-nowrap">
                         {User.__EMPTY_20}%
                         </td>
                       </tr>
                       )
       
                     }
       
                
                     )
         
       }
                 </tbody> 
                   </table>
                  
               <div/>

           </div>
           <Button className="m-6" title="Back" onClick={()=>setView(false)}>Back</Button>
           </div>
          }
        </DashboardLayout>
      );


}