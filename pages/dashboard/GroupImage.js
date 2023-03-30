import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import DashboardLayout from "../../containers/DashboardLayout/DashboardLayout";
import { Button, Input, Upload, message } from "antd";
import UploadImage from "../../components/utility/imageUploading";
import { API, Amplify, graphqlOperation } from "aws-amplify";
import { getAllUsers } from "../../src/graphql/queries";
import { useDispatch, useSelector } from "react-redux";
import { tokenAuth } from "../../redux/userlogin/userSlice";
import { InboxOutlined } from "@ant-design/icons";
import { getS3Url } from "../../src/graphql/queries";
import { comparingFaces, getUser } from "../../src/graphql/queries";
import { LastComparison } from "../../src/graphql/queries";
import checkmark from "../../assets/checkmark.png";
import Router from "next/router";
import cross from "../../assets/cross.png";
import MyExcelComponent from "./toExcel";
// import { saveAs } from "file-saver";
export default function GroupImage() {
  const [excelFile, setExcelFile] = useState(null);
  const [excelFileError, setExcelFileError] = useState(null);
  const [responseData,setresponeData] = useState(null);
  const [images, setImages] = React.useState([]);
  const [rollNumbers, setrollNumbers] = useState([]);
  const [loading, setloading] = useState("Mark Attendance");
  const [updated, setupdatedRollno] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [flag, setFlag] = useState(false);
  const { Dragger } = Upload;

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
        message.success(`${info.file.name} file uploaded successfully.`);
        setFlag(false);
        fetchArrayFromCSV(info?.file?.originFileObj);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      fetchArrayFromCSV(e?.dataTransfer?.files[0]);
    },
  };

  const token = useSelector((state) => state.userReducer.token);
  Amplify.configure({
    API: {
      graphql_headers: async () => ({
        token: token,
      }),
    },
  });
  const dispatch = useDispatch();
  // submit
  const [excelData, setExcelData] = useState(null);
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
  }, []);

  const fetchArrayFromCSV = async (selectedFile) => {
    let reader = new FileReader();
    reader.readAsArrayBuffer(selectedFile);
    reader.onload = async (e) => {
      console.log("e.target.result => ", e.target.result);
      setExcelFileError(null);
      setExcelFile(e.target.result);
      if (e.target.result != null) {
        const workbook = XLSX.read(e.target.result, { type: "buffer" });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        let data = XLSX.utils.sheet_to_json(worksheet);
        data = data.slice(6);
        data.pop();
        console.log("data => ", data);

        try {
          let rollNumber = [];
          let usersRecords = [];
          await Promise.all(
            data.length > 0 &&
              data.map(async (user) => {
                rollNumber.push(user?.__EMPTY_1);
                try {
                  const variable1 = {
                    rollNumber: user?.__EMPTY_1,
                  };
                  const response = await API.graphql(
                    graphqlOperation(getUser, variable1)
                  );
                  response?.data.getUser[0] &&
                    usersRecords.push(response?.data.getUser[0]);
                  console.log("Resp => data => ", response?.data.getUser[0]);
                } catch (err) {
                  console.log("err => ", err);
                }
              })
          );
          setrollNumbers(rollNumber);
          setAllUsers(usersRecords);
          console.log("usersRecords => ", usersRecords);
        } catch (err) {
          console.log("err => ", err);
        }
      }
    };
  };

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
  const fileType = ["application/vnd.ms-excel"];
  // const handleFile = async (e) => {
  //   console.log("hello");
  //   let selectedFile = e.target?.files[0];
  //   console.log("selected File => ", selectedFile);
  //   // if(selectedFile){
  //   console.log(selectedFile?.type);
  //   // if(selectedFile&&fileType.includes(selectedFile.type)){
  //   let reader = new FileReader();
  //   reader.readAsArrayBuffer(selectedFile);
  //   reader.onload = async (e) => {
  //     console.log("e.target.result => ", e.target.result);

  //     setExcelFileError(null);
  //     setExcelFile(e.target.result);
  //     if (e.target.result != null) {
  //       const workbook = XLSX.read(e.target.result, { type: "buffer" });
  //       const worksheetName = workbook.SheetNames[0];
  //       const worksheet = workbook.Sheets[worksheetName];
  //       let data = XLSX.utils.sheet_to_json(worksheet);
  //       data = data.slice(6);
  //       data.pop();
  //       console.log("data => ", data);

  //       try {
  //         let rollNumber = [];
  //         let usersRecords = [];
  //         await Promise.all(
  //           data.length > 0 &&
  //             data.map(async (user) => {
  //               rollNumber.push(user?.__EMPTY_1);
  //               try {
  //                 const variable1 = {
  //                   rollNumber: user?.__EMPTY_1,
  //                 };
  //                 const response = await API.graphql(
  //                   graphqlOperation(getUser, variable1)
  //                 );
  //                 response?.data.getUser[0] &&
  //                   usersRecords.push(response?.data.getUser[0]);
  //                 console.log("Resp => data => ", response?.data.getUser[0]);
  //               } catch (err) {
  //                 console.log("err => ", err);
  //               }
  //             })
  //         );
  //         setrollNumbers(rollNumber);
  //         setAllUsers(usersRecords);
  //         console.log("usersRecords => ", usersRecords);
  //       } catch (err) {
  //         console.log("err => ", err);
  //       }
  //     }
  //   };
  // };

  const conversion = async (array, rollNumbers) => {
    array = array.filter((user) => {
      let index = rollNumbers.findIndex((user1) => {
        return user.rollNumber === user1 && user.faceConf > 80;
      });
      return index != -1;
    });
    return array;
  };
  //remove duplicate
  const removal = async (finalresponse) => {
    const res = [];
    console.log("In removal", finalresponse);
    console.log("In removal", finalresponse.length);
    for (let i = 0; i < finalresponse.length; i++) {
      let el = finalresponse[i];
      console.log(el);
      const index = res.findIndex((obj) => {
        return obj["rollNumber"] === el.rollNumber;
      });
      if (index === -1) {
        res.push({
          rollNumber: el.rollNumber,
          faceConf: el.faceConf,
          count: 1,
        });
      } else {
        res[index]["count"]++;
      }
    }
    return res;
  };
  // submit function
  const handleSubmit = async (e) => {
    setFlag(false);
    let finalresponse = [];
    e.preventDefault();
    //Excel to array
    if (rollNumbers.length > 0 && images.length > 0) {
      setloading("Loading....");
      message.loading("Now comparing Started Plz wait")
      if (excelFile !== null) {
        await new Promise(async (r, e) => {
          console.log("next promise");
          for (let i = 0; i < images.length; i++) {
            console.log(i);
            let imageKey = await storeImageToS3Bucket(images[i]);
            let variables = {
              rollNumbers,
              trgImage: imageKey,
            };
            let responseComparison = await API.graphql(
              graphqlOperation(comparingFaces, variables)
            );
            console.log(responseComparison);
            await new Promise((r) => setTimeout(r, 8500));
            await API.graphql(graphqlOperation(LastComparison))
              .then((result) => {
                if (!result?.data?.receiverSqsComparison?.resp) {
                  throw "Error";
                }
                console.log(result);
                setresponeData(result?.data?.receiverSqsComparison?.resp)
                console.log(
                  "response1",
                  result?.data?.receiverSqsComparison?.resp
                );
                conversion(
                  result?.data?.receiverSqsComparison?.resp,
                  rollNumbers
                ).then((result) => {
                  console.log("response2", result);
                  finalresponse = finalresponse.concat(result);
                });
              })
              .catch((error) => alert("error"));
          }
          r(finalresponse);
        })
          .then(async (result) => {
            console.log("response3", result.length);
            if (result.length == 0) {
              throw "Error";
            }
            //Removal of duplication
            removal(result).then((result) => {
              if (result.length < 1) {
                throw "Error";
              }
              console.log("response4 ", result);
              setupdatedRollno(result);
              setloading("Attendance Marked");
              message.success('Hurrah! Attendance Marked')
            });
          })
          .catch((error) => {
            console.log("error => ", error);
            message.error(`OOPS! Something went Wrong`);
            setloading("Something went Wrong");
          });
        //___________________________________________
        //ends here
      } else {
        setExcelData(null);
      }
    } else {
      message.error(`Kindly Upload the Image or csv file to Mark Attendance`);
    }
  };
  useEffect(() => {
    if (updated.length > 0) {
      console.log("inloop", updated);
      setFlag(true);
    }
  }, [updated]);
  return (
    <DashboardLayout>
      <div className="overflow-y-auto w-5/7 h-5/7 my-8 mx-10 bg-white font-extrabold align-middle rounded-md shadow-2xl overflow-hidden">
        <div className="flex pt-5 pb-0 px-4 overflow-hidden">
          <h1 className="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-gray-700 to-red-700">
            {" "}
            {loading}
          </h1>
        </div>
        <div className="w-full">
          <UploadImage setImagesFunc={setImages} />
        </div>
        <div className="flex flex-row items center justify-center space-x-10">
          <div className="flex flex-col items-center justify-center mt-[5%] space-y-5">
            <Button
              type="primary"
              shape="round"
              className="bg-blue-900"
              onClick={handleSubmit}
              block
            >
              Mark Attendance
            </Button>
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
            {
              flag&& <MyExcelComponent users={responseData}/>
            }
          </div>
          {/* <div className="mt-[15%] w-[30%]">
            <UploadImage setImagesFunc={setImages} />
          </div> */}
        </div>
        <div
          style={{ position: "relative" }}
          className="flex flex-row space-x-5 mt-[10%] mx-[4%] overflow-auto m-4"
        >
          {flag === false
            ? allUsers?.length > 0 &&
              allUsers.map((user) => (
                <div class="mb-4 md:mb-0">
                  <div class="rounded-full relative w-full object-contain overflow-hidden bg-cover bg-no-repeat ">
                    <img
                      src={user.image}
                      className="w-[100px] h-[100px] object-cover"
                    />
                  </div>
                </div>
              ))
            : allUsers.map((user) => {
                const index = updated.findIndex(
                  (pUser) => user?.rollNumber == pUser.rollNumber
                );
                const faceConf = index != -1 ? updated[index]?.faceConf : 0;
                return (
                  <div class="mb-4 md:mb-0">
                    <div class="rounded-full relative w-full object-contain overflow-hidden bg-cover bg-no-repeat ">
                      <img
                        src={user.image}
                        className="w-[100px] h-[100px] object-cover"
                        // className="w-[100px] mb-4 object-cover rounded-md"
                      />
                      {faceConf > 80 ? (
                        <div>
                          <img
                            style={{
                              zIndex: 1,
                              opacity: 1,
                              position: "absolute",
                              marginTop: "-105px",
                            }}
                            className="h-28 w-60"
                            src={checkmark}
                          />
                          <div className="absolute top-0 right-0 bottom-2 left-0 mb-2 h-full w-full overflow-hidden bg-green-400 bg-fixed transition duration-300 ease-in-out opacity-40 rounded-md"></div>
                        </div>
                      ) : (
                        <>
                          <img
                            style={{
                              zIndex: 2,
                              opacity: 1,
                              position: "absolute",
                              marginTop: "-105px",
                            }}
                            className="h-28 w-60"
                            src={cross}
                          />
                          <div className="absolute top-0 right-0 bottom-2 left-0  mb-2 h-full w-full overflow-hidden bg-red-400 bg-fixed transition duration-300 ease-in-out opacity-40 rounded-md"></div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </DashboardLayout>
  );
}
