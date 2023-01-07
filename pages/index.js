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
import attendance from '../assets/Picture1.png'
import { getS3Url } from "../src/graphql/queries";
import Router from "next/router";
export default function Login() {
  let token = useSelector((state) => state.userReducer.token);
  const [RollNo, setRoll] = useState("");
  const [password, setpassword] = useState("");
  const [error,seterror]=useState('')
  useEffect(() => {
    const Data=JSON.parse(localStorage.getItem('Token'))
    if(Data.Auth===true){
      Router.push('/dashboard')
    }
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
    console.log(variables)
    await API.graphql(graphqlOperation(Loginuser, variables))
      .then(async (result) => {
        const token = JSON.parse(result.data.loginUser.token);
        let finalToken = token.split("=");
        finalToken = finalToken[1].split("Max-Age");
        finalToken = "Bearer " + finalToken[0];
        finalToken = finalToken.split(";");
        finalToken = finalToken[0];
        dispatch(tokenAuth( {
          id:result.data.loginUser.user.id,
          token:finalToken,
          name:result.data.loginUser.user.name,
          email:result.data.loginUser.user.email,
          image:result.data.loginUser.user.image,
          qualification:result.data.loginUser.user.qualification,
          rollNumber:result.data.loginUser.user.rollNumber,
          Auth:true
        }));
        localStorage.setItem("Token",JSON.stringify({
          id:result.data.loginUser.user.id,
          token:finalToken,
          name:result.data.loginUser.user.name,
          email:result.data.loginUser.user.email,
          image:result.data.loginUser.user.image,
          rollNumber:result.data.loginUser.user.rollNumber,
          qualification:result.data.loginUser.user.qualification,
          Auth:true
        }));
        Router.push("/dashboard");
      })
      .catch((error) => {
        console.log(error);
        console.log("error");
        seterror('Invalid password or RollNo')
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
          <div className="flex flex-row items-center w-80 justify-items-center rounded-md space-x-8 py-2 px-4 mt-6 ml-10 ... ring-2 ring-gray-100 ring-inset">
            <Image
            src={attendance}
            width={35}
            height={35}
            className="object-fit"
            />
            <div className="flex">
            <h1 className="pl-1/2 text-transparent font-semibold text-sm whitespace-nowrap bg-clip-text bg-gradient-to-r from-gray-700 to-red-700">
              Image-based Attendance system
            </h1>
            </div>
          </div>
          <div className="relative flex py-4 items-center w-4/5 ml-10 mt-2">
            <div className="flex-grow-[1] border-t border-gray-400"></div>
            <span className="flex-shrink mx-2 text-gray-400 text-sm mb-1">
              Login with Email
            </span>
            <div className="flex-grow-[1] border-t border-gray-400"></div>
          </div>

          <div className="flex flex-col w-4/5 ml-10 py-1">
          <p className="text-red-600">{error}</p>
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
            <div className="flex flex-row justify-end mt-2">

              <Link href="/dashboard/forgotPage" color="inherit">
              Forgot my password
              </Link>
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
