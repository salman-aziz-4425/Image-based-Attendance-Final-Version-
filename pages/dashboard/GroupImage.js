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
import checkmark from '../../assets/checkmark.png'
import cross from '../../assets/cross.png'
// import { saveAs } from "file-saver";
export default function GroupImage() {
const [excelFile, setExcelFile]=useState(null);
const [excelFileError, setExcelFileError]=useState(null);  
const [images, setImages] = React.useState([]);
const [rollNumbers,setrollNumbers]=useState([])
const [loading,setloading]=useState("Mark Attendance")
const [updated,setupdatedRollno]=useState([])
const [allUsers,setAllUsers]=useState([])
const [flag,setFlag]=useState(false)
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
const storeImageToS3Bucket = async (GroupImage) => {
  if (images === undefined || images.length < 1) {
    alert("no pic image");
    setError({ ...error, image: "Kindly upload your picture" });
    return;
  }
  console.log("Image List => ", GroupImage?.data_url);
  const image = GroupImage?.file;
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
// function exportSheet() {
//   const spread = _spread;
//   const fileName = "SalesData.xlsx";
//   const sheet = spread.getSheet(0);
//   const excelIO = new IO();
//   const json = JSON.stringify(spread.toJSON({ 
//       includeBindingSource: true,
//       columnHeadersAsFrozenRows: true,
//   }));
//   excelIO.save(json, (blob) => {
//       saveAs(blob, fileName);
//   }, function (e) {  
//       alert(e);  
//   });     
// }
const conversion=async (array,rollNumbers)=>{
  array=array.filter((user)=>{
    let index=rollNumbers.findIndex((user1)=>{
      return user.rollNumber===user1&&user.faceConf>80
    })
    return index!=-1
  })
  return array
}
//remove duplicate
const removal=async (finalresponse)=>{
  const res=[]
  console.log("In removal",finalresponse)
  console.log("In removal",finalresponse.length)
  for(let i=0;i<finalresponse.length;i++) {
    let el=finalresponse[i]
    console.log(el)
    const index = res.findIndex(obj => {
       return obj['rollNumber'] === el.rollNumber;
    });
    if(index === -1){
       res.push({
          "rollNumber": el.rollNumber,
          "faceConf":el.faceConf,
          "count": 1
       })
    }
    else{
       res[index]["count"]++;
    };
  }
 return res
}
// submit function
const handleSubmit=async (e)=>{
  setloading("Loading....")
  setFlag(false)
  let finalresponse=[]
  e.preventDefault();
  //Excel to array
  if(excelFile!==null){
    const workbook = XLSX.read(excelFile,{type:'buffer'});
    const worksheetName = workbook.SheetNames[0];
    const worksheet=workbook.Sheets[worksheetName];
    let data = XLSX.utils.sheet_to_json(worksheet);
    data=data.slice(6)
    data.pop()
    //______________________________
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
      await new Promise(async (r,e)=>{
        for(let i=0;i<images.length;i++){
          console.log(i)
          let imageKey=await storeImageToS3Bucket(images[i])
          let variables={
            rollNumbers:rollNumber,
            trgImage:imageKey
          }
          let responseComparison=await API.graphql(graphqlOperation(comparingFaces,variables))
          console.log(responseComparison)
          await new Promise(r => setTimeout(r,8500));
          await API.graphql(graphqlOperation(LastComparison)).then((result)=>{
            if(!result?.data?.receiverSqsComparison?.resp){
              throw "Error"
            }
            console.log(result)
            console.log("response1",result?.data?.receiverSqsComparison?.resp)
           conversion(result?.data?.receiverSqsComparison?.resp,rollNumber).then((result)=>{
              console.log("response2",result)
              finalresponse=finalresponse.concat(result)
            })
          }).catch((error)=>alert("error"))
        }
        r(finalresponse)
      }
      ).then(async (result)=>{
        console.log("response3",result.length)
        if(result.length==0){
          throw "Error"
        }
            //Removal of duplication
    removal(result).then((result)=>{
      if(result.length<1){
        throw "Error"
      }
      console.log("response4")
    setupdatedRollno(result)
    setloading("Attendance Marked")
   })
      }).catch((error)=>setloading("Something went Wrong"))
     //___________________________________________
      //ends here
    }catch{
      alert("Invalid properties")
      setloading("Something went Wrong")
    }
  
  }
  else{
    setExcelData(null);
  }
}
useEffect(()=>{
  if(updated.length>1){
    console.log("inloop",updated)
    setFlag(true)
  }
},[updated])
  return (
    <DashboardLayout>
      <div className="w-5/7 h-5/7 my-8 mx-10 bg-white font-extrabold align-middle rounded-md shadow-2xl overflow-hidden">
      <div className="flex pt-5 pb-0 px-4 overflow-hidden">
          <h1 className="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-gray-700 to-red-700">
            {" "}
            {loading}
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
        <div style={{position:"relative"}} className="flex flex-row space-x-5 mt-[10%] mx-[4%] overflow-auto">
          {

            flag===false?allUsers.map((user)=>(
              <div class="mb-4 md:mb-0">
              <div class="relative w-60 object-contain overflow-hidden bg-cover bg-no-repeat ">
                <img
                  src={user.image}
                  className="h-40 w-80 mb-4 object-cover"
                  alt="Louvre" />
              </div>
            </div> 
            )):
            allUsers.map((user)=>{
              const index=updated.findIndex((pUser)=>user?.rollNumber==pUser.rollNumber)
              const faceConf=index!=-1?updated[index]?.faceConf:0
              return(
              <div class="mb-4 md:mb-0">
              <div class="relative w-60 object-contain overflow-hidden bg-cover bg-no-repeat ">
                <img
                  src={user.image}
                  className="h-40 w-80 mb-4 object-cover rounded-md"
                  alt="Louvre" />
                  {
                    faceConf>80?
                    <div>
                     <img style={{zIndex:1,opacity:1,position:"absolute",marginTop:"-70%"}} className="h-20 w-20" src={checkmark}/>
                     <div  className="absolute top-0 right-0 bottom-2 left-0 mb-2 h-full w-full overflow-hidden bg-green-400 bg-fixed transition duration-300 ease-in-out opacity-40 rounded-md">
                    </div>
                    </div>
                    :
                    <>
                     <img style={{zIndex:2,opacity:1,position:"absolute",marginTop:"-70%"}} className="h-20 w-20" src={cross}/>
                    <div
                    className="absolute top-0 right-0 bottom-2 left-0  mb-2 h-full w-full overflow-hidden bg-red-400 bg-fixed transition duration-300 ease-in-out opacity-40 rounded-md">
                    </div>
                    </>
                  }
              </div>
            </div> 
              )
         })
          }
        </div>
      </div>
    </DashboardLayout>
  );
}
