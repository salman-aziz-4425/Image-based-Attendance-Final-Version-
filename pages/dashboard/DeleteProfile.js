import React, { useEffect, useState } from 'react'
import { useDispatch,useSelector } from 'react-redux';
import DashboardLayout from '../../containers/DashboardLayout/DashboardLayout'
import { Row, Col, Button } from 'antd';
import basicStyle from '@iso/assets/styles/constants';
import IsoWidgetsWrapper from '../../containers/Widgets/WidgetsWrapper';
import IsoWidgetBox from '../../containers/Widgets/WidgetBox';
import Table from '../../containers/Table/Table';
import {getAllUsers} from '../../src/graphql/queries'
import { deleteUser } from '../../src/graphql/mutations';
import actions from '../../redux/app/actions';
import Router from 'next/router';
import {API,graphqlOperation,Amplify} from 'aws-amplify';
import { width } from '@mui/system';
import Model from '../../containers/Model/Model';
import { Router } from 'next/router';
const {clearMenu}=actions
function DeleteProfile() {
  let token=useSelector((state) => state.userReducer.token)
  Amplify.configure({
    API:{
   graphql_headers:async () =>({
     'token':token
   })
  }
  })
  const [User,setUser]=useState([{
  }])
  const [Visible,setVisible]=useState(false)
  useEffect(async ()=>{
    if(token.length<1){
      Router.push('/')
    }
    const res=await API.graphql(graphqlOperation(getAllUsers))
    setUser(res.data.getAllUsers)
  },[])

      const { rowStyle, colStyle } = basicStyle;
      const deleteUser1= async (rollNumber1)=>{
        const variables = {
              rollNumber:rollNumber1
        };

        await API.graphql(graphqlOperation(deleteUser,variables)).then((result)=>{
          alert("deleted")
          setUser(User.filter((object)=>{
            return object.rollNumber!=rollNumber1
          }))
        }).catch((error)=>{
          console.log(error)
        })
      }
  return (
    <DashboardLayout>
         <div className="h-5/7 w-5/7 my-6 mx-10 bg-white font-extrabold align-middle rounded-md shadow-2xl overflow-hidden">
         <div className='flex'>
         <h1 className="p-4 font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-gray-700 to-red-700">
            Delete User
          </h1>
          </div>
            <Button className='ml-6' onClick={()=>setVisible(!Visible)}>Edit Student</Button>
            <Row style={{width:'100%'}} gutter={0} justify="start">
          <Col lg={16} md={24} sm={24} xs={24} style={{marginTop:5,borderRadius:20}}>
            <IsoWidgetsWrapper>
              <IsoWidgetBox>
                {/* TABLE */}
                <div className='w-full'>
                <Table Users={User} flag={Visible} deleteUsers={deleteUser1} setUser={setUser}/>
                </div>
              </IsoWidgetBox>
            </IsoWidgetsWrapper>
            </Col>
            </Row>
            </div>
    </DashboardLayout>
  )
}

  export default DeleteProfile