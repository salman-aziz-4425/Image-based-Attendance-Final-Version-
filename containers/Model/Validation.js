import * as EmailValidator from 'email-validator'; 
var validator = require("email-validator");
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
      const name=User.Name.replace(/\s/g, "")
      if(format.test(name)===true){
        usernameFormat=false
      }
      else{
        usernameFormat=true
      }
    if(type==="")
    {
        type=previousDetails.userType
    }
    else{
        User.userType=type
    }
    if(User.Email===""){
      User.Email=previousDetails.email
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
    if(User.Name==="")
    {
      User.Name=previousDetails.name
    }
    else if(usernameFormat===false){
        error.Name="Wrong Name format"
      count=count+1
    }
    if(User.PhoneNo===0||User.PhoneNo.length===0)
    {
        User.PhoneNo=previousDetails.phoneNo
    }
    else if(User.PhoneNo.length!=11){
        error.PhoneNo="Length of Phone No is not valid"
        count=count+1
    }
    if(User.Qualification==="")
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
    if(User.Address===""){
        User.Address=previousDetails.Address
    }
     console.log(error)
     console.log(count)
     if(count===0){
        return {
            Flag:true,
            Error:error,
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