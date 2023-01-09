import * as EmailValidator from 'email-validator'; 
var validator = require("email-validator");
const emailValidator = ['gmail.com','yahoo.com','hotmail.com','aol.com','hotmail.co.uk','hotmail.fr','mail.com','edu.pk','nu.edu.pk','.pk'];
const validation=(type,User,previousDetails)=>{
    let count=0
    var format = /[!@#$%^&/*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    let usernameFormat=false
    let error={
        Email:"",
        Name:"",
        type:"",
        password:"",
        PhoneNo:0,
        Address:"",
        RollNo:"",
        Qualification:""
      }
      const name=User?.Name.replace(/\s/g, "")
      if(format.test(name)===true){
        usernameFormat=false
      }
      else{
        usernameFormat=true
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
    if(!type)
    {
        type=previousDetails.userType
    }
    else{
        User.userType=type
    }
    if(User.Email===""){
      User.Email=previousDetails.email
    }
    if(User.Email!==""){
      let SplitEmail = User?.Email?.split("@")[1];
      if(!emailValidator.includes(SplitEmail)){
        count = count+1;
        error.Email="Invalid Email Format"
      }
    }
    else if(!validator.validate(User.Email))
    {
        error.Email="Invalid Email Format"
        count+=1
    }
    if(validator.validate(User.Email)&&User.Email!=""){
        if(User.Email.charCodeAt(0)<65||User.Email.charCodeAt(0)>122)
      {
        error.Email="Invalid Email Format"
        count+=1
      }
      else{
        for(let i=0;i<User.Email.length;i++){
          if(User.Email.charCodeAt(i)!=46){
            if((User.Email.charCodeAt(i)<48)){
                error.Email="Invalid Email Format"
                count+=1
            }
            if(User.Email.charCodeAt(i)>122){
              error.Email="Invalid Email Format"
              count+=1
            }
          }
        }
      }
    }
    if(!User?.Name)
    {
      User.Name=previousDetails.name
    }
    else if(usernameFormat===false){
        error.Name="Wrong Name format"
      count=count+1
    }
    if(User?.PhoneNo===0||User.PhoneNo.length===0)
    {
        User.PhoneNo=previousDetails.phoneNo
    }
    else if(User?.PhoneNo.length<11){
        error.PhoneNo="Length of Phone No is not valid"
        count=count+1
    }
    if(!User?.Qualification)
    {
        User.Qualification=previousDetails.qualification
    }
    else{
        for(let i=0;i<User.Qualification.length;i++){
            if(User.Qualification.charCodeAt(i)<65||User.Qualification.charCodeAt(i)>122){
                error.Qualification="Wrong Qualification Format"
                count=count+1
                break
            }
        }
    }
    if(!User?.Address){
        User.Address=previousDetails.Address
    }
    else{
      if(!/^[#.0-9a-zA-Z\s,_]+$/.test(User.Address)){
        error.Address="Invalid Address"
        count=count+1
      }
    }
     console.log(error)
     console.log(count)
     if(count===0){
        return {
            Flag:true,
            Error:{
              Email:"",
              Name:"",
              type:"",
              password:"",
              PhoneNo:0,
              Address:"",
              RollNo:"",
              Qualification:""
            },
            User:User
        }
     }
     else{
        return {
            Flag:false,
            Error:error,
            User:User,
        }
     }
}
export default validation