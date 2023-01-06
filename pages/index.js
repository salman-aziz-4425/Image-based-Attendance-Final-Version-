import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Loginpic from "../assets/Loginpic.jpg";
import googleIcon from "../assets/google.png";
import styles from "../style/Home.module.css";
import Arrow from "../assets/right-arrow.png";
import Input from "../components/uielements/input";
import { Loginuser } from "../src/graphql/mutations";
import { API, graphqlOperation, withSSRContext } from "aws-amplify";
import { tokenAuth } from "../redux/userlogin/userSlice";
import { useSelector, useDispatch } from "react-redux";
import Router from "next/router";
export default function Login() {
  const [RollNo, setRoll] = useState("");
  const [password, setpassword] = useState("");
  useEffect(() => {
    localStorage.setItem("Token", "");
  }, []);
  const dispatch = useDispatch();
  const emailHandler = (event) => {
    setRoll(event.target.value);
  };
  const passwordHandler = (event) => {
    setpassword(event.target.value);
  };
  const submitHandler = async () => {
    event.preventDefault();
    const variables = {
      data: {
        rollNumber: RollNo,
        password: password,
      }, // key is "input" based on the mutation above
    };
    await API.graphql(graphqlOperation(Loginuser, variables))
      .then((result) => {
        const token = JSON.parse(result.data.loginUser.token);
        let finalToken = token.split("=");
        finalToken = finalToken[1].split("Max-Age");
        finalToken = "Bearer " + finalToken[0];
        finalToken = finalToken.split(";");
        finalToken = finalToken[0];
        dispatch(tokenAuth(finalToken));
        localStorage.setItem("Token", finalToken);
        Router.push("/dashboard");
      })
      .catch((error) => {
        console.log(error);
        console.log("error");
        alert("data not found");
      });
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Admin Panel</title>
      </Head>
      <div className="flex flex-row mt-10 mx-40 h-5/6">
        <div className="bg-white pt-12 px-20 rounded-l-lg">
          <h1 className="font-semibold text-3xl ml-20">Welcome Back</h1>
          <div className="flex flex-row w-80 justify-items-center rounded-md space-x-8 py-2 px-4 mt-6 ml-10 ... ring-2 ring-gray-100 ring-inset">
            <h1 className="border-black pl-1/2 font-semibold text-sm whitespace-nowrap">
              Image-based Attendane system
            </h1>
          </div>
          <div className="relative flex py-4 items-center w-4/5 ml-10 mt-2">
            <div className="flex-grow-[1] border-t border-gray-400"></div>
            <span className="flex-shrink mx-2 text-gray-400 text-sm mb-1">
              Login with Email
            </span>
            <div className="flex-grow-[1] border-t border-gray-400"></div>
          </div>

          <div className="flex flex-col w-4/5 ml-10 py-1">
            <Input
              id="inputUserName"
              size="large"
              placeholder="19F-000"
              defaultValue="19F-"
              onChange={emailHandler}
            />
            <Input
              id="inpuPassword"
              size="large"
              type="password"
              placeholder="Password"
              defaultValue="admin"
              className="my-2"
              onChange={passwordHandler}
            />
            <div className="flex flex-row mt-2">
              <p className="text-sm flex-1 ">Keep me logged in</p>
              <p className="text-sm">Forgot Password</p>
            </div>
          </div>
          <button
            className="flex ml-10 mt-2 flex-row items-center justify-center px-2 text-white rounded-md flex-1 bg-blue-900 w-4/5"
            onClick={() => submitHandler()}
          >
            <p className="flex-1">Log in</p>
            <Image
              src={Arrow}
              alt="Image"
              width={20}
              height={40}
              priority
              className="rounded-r-lg"
            />
          </button>
        </div>
        <Image
          src={Loginpic}
          alt="Image"
          width={400}
          height={500}
          priority
          className="rounded-r-lg md:hidden lg:hidden"
        />
      </div>
    </div>
  );
}
