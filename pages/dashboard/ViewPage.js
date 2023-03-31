import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import DashboardLayout from "../../containers/DashboardLayout/DashboardLayout";
import { Button, Input, Upload, message } from "antd";
import UploadImage from "../../components/utility/imageUploading";
import { API, Amplify, graphqlOperation } from "aws-amplify";
import { getAllUsers } from "../../src/graphql/queries";
import { useDispatch, useSelector } from "react-redux";
import { InboxOutlined } from "@ant-design/icons";

import { tokenAuth } from "../../redux/userlogin/userSlice";
import Router from "next/router";
export default function ViewImage() {
  const [excelFile, setExcelFile] = useState(null);
  const [excelFileError, setExcelFileError] = useState(null);
  const [view, setView] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const { Dragger } = Upload;

  const token = useSelector((state) => state.userReducer.token);
  Amplify.configure({
    API: {
      graphql_headers: async () => ({
        token: token,
      }),
    },
  });
  const dispatch = useDispatch();

  const props = {
    name: "file",
    multiple: false,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        if(info.file.type ==="text/csv"){
        message.success(`${info.file.name} file uploaded successfully.`);
        fetchArrayFromCSV(info?.file?.originFileObj);
        }else{
          status = "error";
          message.error(`${info.file.name} Invalid File Format. Only CSV file Accepted`);
        }
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      fetchArrayFromCSV(e?.dataTransfer?.files[0]);
    },
  };

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
  const fileType = ["application/vnd.ms-excel"];
  const fetchArrayFromCSV = (selectedFile) => {
    let reader = new FileReader();
    reader.readAsArrayBuffer(selectedFile);
    reader.onload = (e) => {
      console.log("e.target.result => ",e.target.result)
      setExcelFileError(null);
      setExcelFile(e.target.result);
    };
  };
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
  const handleSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      let data = XLSX.utils.sheet_to_json(worksheet);
      data = data.slice(6);
      data.pop();
      setExcelData(data);
      console.log(excelData);
      setView(true);
    }
  };
  return (
    <DashboardLayout>
      {view === false ? (
        <div className="w-5/7 h-5/7 my-8 mx-10 bg-white font-extrabold align-middle rounded-md shadow-2xl overflow-hidden">
          <div className="flex pt-5 pb-0 px-4 overflow-hidden">
            <h1 className="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-gray-700 to-red-700">
              {" "}
              View Attendance
            </h1>
          </div>
          <div className="flex flex-row items center justify-center space-x-10">
            <div className="flex flex-col items-center justify-center mt-[15%] space-y-5">
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibited from
                  uploading company data or other banned files.
                </p>
              </Dragger>
              {/* <Input className="w-60"  type="file" onChange={handleFile}></Input> */}
              <Button type="button" onClick={handleSubmit}>
                Upload
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-5/7 h-5/7 my-8 mx-10 bg-white font-extrabold align-middle rounded-md shadow-2xl overflow-hidden">
          <div className="flex pt-5 pb-0 px-4 overflow-hidden">
            <h1 className="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-gray-700 to-red-700">
              {" "}
              View Attendance
            </h1>
          </div>
          <div className="flex flex-col h-50 w-full mt-[5%] border-black border-y-2">
            <thead>
              <tr className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <th
                  scope="col"
                  className="text-sm font-medium text-gray-900 pl-4 py-4 text-left"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="text-sm font-medium text-gray-900 pl-[12rem] py-4 text-left"
                >
                  RollNumber
                </th>
                <th
                  scope="col"
                  className="text-sm font-medium text-gray-900 pl-[14rem] py-4 text-left"
                >
                  Names
                </th>
                <th
                  scope="col"
                  className="text-sm font-medium text-gray-900 pl-[65%] py-4 text-left"
                >
                  Attendance
                </th>
              </tr>
            </thead>
          </div>
          <div className="min-w-full h-80  overflow-auto border-black border-y-1 border-x-1 border-b-2">
            <table className="min-w-full h-60 border-y-10">
              <tbody className="overflow-auto border-y-10">
                {excelData.map((User, index) => {
                  console.log(User.__EMPTY_1);
                  return (
                    <tr className="border-b">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
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
                  );
                })}
              </tbody>
            </table>

            <div />
          </div>
          <Button className="m-6" title="Back" onClick={() => setView(false)}>
            Back
          </Button>
        </div>
      )}
    </DashboardLayout>
  );
}
