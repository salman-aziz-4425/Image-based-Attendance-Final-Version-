var validator = require("email-validator");
const emailValidator = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "aol.com",
  "hotmail.co.uk",
  "hotmail.fr",
  "mail.com",
  "edu.pk",
  "nu.edu.pk",
  ".pk",
];
export default function validation(type, User, typeAttributes, batch) {
  let count = 0;
  var format = /[!@#$%^&/*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  var nameRegex = /^[a-zA-Z\-]+$/;
  let usernameFormat = true;
  let error = {
    RollNo:"",
    Email: "",
    Name: "",
    type: "",
    password: "",
    PhoneNo: 0,
    Address: "",
    RollNo: "",
    Qualification: "",
  };
  const name = User.Name.replace(/\s/g, "");
  if (format.test(name) === true) {

    usernameFormat = false;
  } else {

    usernameFormat = true;
  }
  for (let i = 0; i < name.length; i++) {
    if (
      name.charCodeAt(i) != 32 &&
      (name.charCodeAt(i) < 65 || name.charCodeAt(i) > 122)
    ) {

      usernameFormat = false;
    }
  }
  if (name.length <= 2) {
    usernameFormat = false;
  }
  if (batch === "" && type === "Student") {
    error.type = "Invalid batch";
    count = count + 1;
  }
  if (type === "") {
    error.type = "Invalid Type";
    count = count + 1;
  }
  if (User.Email === "") {
    error.Email = "Invalid Email Format";
    count += 1;
  } else if (User.Email !== "") {
    let SplitEmail = User?.Email?.split("@")[1];
    if (!emailValidator.includes(SplitEmail)) {
      count = count + 1;
      error.Email = "Invalid Email Format";
    }

    // emailValidator.includes()
  } else if (!validator.validate(User.Email)) {
    error.Email = "Invalid Email Format";
    count += 1;
  }
  if (validator.validate(User.Email) && User.Email != "") {
    if (User.Email.charCodeAt(0) < 65 || User.Email.charCodeAt(0) > 122) {
      error.Email = "Invalid Email Format";
      count += 1;
    } else {
      for (let i = 0; i < User.Email.length; i++) {
        if (User.Email.charCodeAt(i) != 46) {
          if (User.Email.charCodeAt(i) < 48) {
            error.Email = "Invalid Email Format";
            count += 1;
          }
          if (User.Email.charCodeAt(i) > 122) {
            error.Email = "Invalid Email Format";
            count += 1;
          }
        }
      }
    }
  }
  console.log(User.RollNo.length)
  if(User.RollNo.length!=4){
    error.RollNo = "Invalid RollNo Field";
    count = count + 1;
  }
  if (User.Name === "") {
    error.Name = "Empty Name field";
    count = count + 1;
  } else if (usernameFormat === false) {
    error.Name = "Wrong Name format";
    count = count + 1;
  }
  if (User.password.length == 0) {
    error.password = "Empty password Field";
    count = count + 1;
  } else if (User.password.length < 5) {
    error.password = "password is too short";
    count = count + 1;
  }
  if (User.PhoneNo.length === 0) {
    error.PhoneNo = "Empty Phone no Field";
    count = count + 1;
  } else if (User.PhoneNo.length != 11) {
    error.PhoneNo = "Length of Phone No is not valid";
    count = count + 1;
  }
  if (typeAttributes.Address === "") {
    error.Address = "Empty Address Field";
    count = count + 1;
  }

  if (typeAttributes.Qualification === "") {
    error.Qualification = "Empty Qualification Field";
    count = count + 1;
  } else {
    for (let i = 0; i < typeAttributes.Qualification.length; i++) {
      if (
        typeAttributes.Qualification.charCodeAt(i) < 65 ||
        typeAttributes.Qualification.charCodeAt(i) > 122
      ) {
        error.Qualification = "Wrong Qualification Format";
        count = count + 1;
        break;
      }
    }
  }
  if(!User?.Address){
    error.Address="Invalid Address"
    count=count+1
}
else{
  if(!/^[#.0-9a-zA-Z\s,_]+$/.test(User.Address)){
    error.Address="Invalid Address"
    count=count+1
  }
}
  console.log(error);
  console.log(count);
  if (count === 0) {
    return {
      Flag: true,
      Error:{
        RollNo:"",
        Email:"",
        Name:"",
        type:"",
        password:"",
        PhoneNo:0,
        Address:"",
        RollNo:"",
        Qualification:""
      },
    };
  } else {
    return {
      Flag: false,
      Error: error,
    };
  }
}
