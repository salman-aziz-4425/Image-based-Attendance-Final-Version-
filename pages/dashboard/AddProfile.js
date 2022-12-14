import React, { useEffect, useState } from "react";
import DashboardLayout from "../../containers/DashboardLayout/DashboardLayout";
import Input from "antd/lib/input/Input";
import Image from "next/image";
import { StickerWidgetImgUploadIcon } from "../../config/icon.config";
import Upload from "antd/lib/upload/Upload";
export default function AddProfile() {
  const [type, setType] = useState("");
  return (
    <DashboardLayout>
      <div className="w-5/7 h-5/7 my-6 mx-10 bg-white font-extrabold align-middle rounded-md shadow-2xl overflow-hidden">
        <div className="flex pt-5 pb-0 px-4 overflow-hidden">
          <h1 className="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-gray-700 to-red-700">
            {" "}
            Add User
          </h1>
        </div>
        <div className="flex flex-row items-center w-full px-6 py-8 overflow-hidden">
          <div className="flex-1 flex flex-col w-5/12 justify-start items-center">
            <Input className="my-2 w-5/6" placeholder="Student Name"></Input>
            <Input className="my-2 w-5/6" placeholder="Student Email"></Input>
            <Input
              className="my-2 w-5/6"
              type="number"
              placeholder="Student Phone No"
            ></Input>
          </div>
          <div className="w-5/12">
            <Image
              src="https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=2250&q=80"
              alt="Image"
              width={200}
              height={160}
              priority
              className="object-contain"
            />
          </div>
          {/* <div className="flex flex-col items-center w-1/5 h-full ml-40 overflow-hidden">
            <div className="mr-90">
              
              <label for="cars">Type:</label>
              <select
                name="cars"
                id="cars"
                onClick={(e) => {
                  if (e.target.value == "Student") {
                    setType("Student");
                  } else if (e.target.value == "Teacher") {
                    setType("Teacher");
                  } else {
                    setType("");
                  }
                }}
              >
                <option value="Type"></option>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
              </select>
              {type === "Student" && (
                <form className="overflow-hidden">
                  <Input
                    className="mt-2 w-5/6"
                    placeholder="Current Semester"
                  ></Input>
                  <Input
                    className="mt-2 w-5/6"
                    placeholder="Current Gpa"
                  ></Input>
                </form>
              )}
            </div>
          </div> */}
        </div>
        <div className="flex flex-row px-6 py-8 space-x-4 flex-wrap items-center">
          <Input className="my-2 w-2/6" type="file"></Input>
          <Input className="my-2 w-3/6" type="file"></Input>
          <Input className="my-2 w-2/6" type="file"></Input>
        </div>
      </div>
    </DashboardLayout>
  );
}
