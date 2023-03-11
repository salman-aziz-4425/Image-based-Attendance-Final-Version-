import React, { useEffect, useState } from "react";
import * as XLSX from 'xlsx'
import DashboardLayout from "../../containers/DashboardLayout/DashboardLayout";
import { Button } from "antd";

export default function GroupImage() {
const [excelFile, setExcelFile]=useState(null);
const [excelFileError, setExcelFileError]=useState(null);  

// submit
const [excelData, setExcelData]=useState(null);
// it will contain array of objects

// handle File
const fileType=['application/vnd.ms-excel'];
const handleFile = (e)=>{
  console.log("hello")
  let selectedFile = e.target.files[0];
  // if(selectedFile){
    console.log(selectedFile.type);
    // if(selectedFile&&fileType.includes(selectedFile.type)){
      let reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile);
      reader.onload=(e)=>{
        setExcelFileError(null);
        console.log(e.target.result)
        setExcelFile(e.target.result);
      } 
  //   }
  //   else{
  //     setExcelFileError('Please select only excel file types');
  //     setExcelFile(null);
  //   }
  // }
  // else{
  //   console.log('plz select your file');
  // }
}

// submit function
const handleSubmit=(e)=>{
  e.preventDefault();
  if(excelFile!==null){
    const workbook = XLSX.read(excelFile,{type:'buffer'});
    const worksheetName = workbook.SheetNames[0];
    const worksheet=workbook.Sheets[worksheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    setExcelData(data);
    console.log(excelData)
  }
  else{
    setExcelData(null);
  }
}
  return (
    <DashboardLayout>
      <div className="w-5/7 h-5/7 my-8 mx-10 bg-white font-extrabold align-middle rounded-md shadow-2xl overflow-hidden">
          <input type="file" onChange={handleFile}></input>
          <Button type="button" onClick={handleSubmit}>Upload</Button>
      </div>
    </DashboardLayout>
  );
}
