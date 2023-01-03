import Head from "next/head";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Loginpic from "../assets/Loginpic.jpg";
import googleIcon from "../assets/google.png";
import styles from "../style/Home.module.css";
import Arrow from "../assets/right-arrow.png";
import Input from "../components/uielements/input";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const emailHandler = (event) => {
    setEmail(event.target.value);
  };
  const passwordHandler = (event) => {
    setpassword(event.target.value);
  };
  const submitHandler = () => {
    // var validRegex =
    //   /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    // if (!email.match(validRegex) || password.length < 5) {
    // }
    // window.location.href("/dashboard");
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Admin Panel</title>
      </Head>
      <div className="flex flex-row mt-10 mx-40 h-5/6">
        <div className="flex-1 bg-white pt-12 px-20 rounded-l-lg">
          <h1 className="font-semibold text-3xl ml-20">Welcome Back</h1>
          <div className="flex flex-row w-80 justify-items-center rounded-md space-x-8 py-2 px-4 mt-6 ml-10 ... ring-2 ring-gray-100 ring-inset">
            <Image src={googleIcon} alt="Image" width={20} height={3} />
            <h1 className="border-black pl-1/2 font-semibold text-sm whitespace-nowrap">
              Image-based Attendane system
            </h1>
          </div>
          <div className="relative flex py-4 items-center w-4/5 ml-10 mt-2">
            <div className="flex-grow-[1] border-t border-gray-400"></div>
            <span className="flex-shrink mx-2 text-gray-400 text-sm mb-1">
              Or Login with Email
            </span>
            <div className="flex-grow-[1] border-t border-gray-400"></div>
          </div>

          <div className="flex flex-col w-4/5 ml-10 py-1">
            <Input
              id="inputUserName"
              size="large"
              placeholder="Username"
              defaultValue="demo@gmail.com"
            />
            <Input
              id="inpuPassword"
              size="large"
              type="password"
              placeholder="Password"
              defaultValue="demodemo"
              className="my-2"
            />
            <div className="flex flex-row mt-2">
              <p className="text-sm flex-1 ">Keep me logged in</p>
              <p className="text-sm">Forgot Password</p>
            </div>
          </div>
          <Link href="/dashboard">
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
          </Link>
        </div>
        <Image
          src={Loginpic}
          alt="Image"
          width={400}
          height={500}
          priority
          className="rounded-r-lg"
        />
      </div>
    </div>
  );
}
