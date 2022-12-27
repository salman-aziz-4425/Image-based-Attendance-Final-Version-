import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../containers/DashboardLayout/DashboardLayout'
import { Row, Col } from 'antd';
import basicStyle from '@iso/assets/styles/constants';
import IsoWidgetsWrapper from '../../containers/Widgets/WidgetsWrapper';
import IsoWidgetBox from '../../containers/Widgets/WidgetBox';
import Table from '../../containers/Table/Table';
import {getAllUsers} from '../../src/graphql/queries'
import {API,graphqlOperation,withSSRContext} from 'aws-amplify';
function Page({data}) {
    const styles = {
        wisgetPageStyle: {
          display: 'flex',
          flexFlow: 'row wrap',
          justifyItems:"center",
          alignItems:'center',
          borderRadius:'20px'
        },
      };
      const { rowStyle, colStyle } = basicStyle;
      console.log(data)
  return (
    <DashboardLayout>
         <div className="w-5/7 h-5/7 my-6 mx-10 bg-white font-extrabold align-middle rounded-md shadow-2xl overflow-hidden">
            <div>DeleteProfile</div>
            <Row style={rowStyle} gutter={0} justify="start">
          <Col lg={16} md={17} sm={24} xs={24} style={{marginTop:5,borderRadius:20}}>
            <IsoWidgetsWrapper>
              <IsoWidgetBox>
                {/* TABLE */}
                {/* <Table/> */}
              </IsoWidgetBox>
            </IsoWidgetsWrapper>
            </Col>
            </Row>
            </div>
    </DashboardLayout>
  )
}
export async function getServerSideProps(context) {
    const {API } = withSSRContext(context)
    const Users=await API.graphql(graphqlOperation(getAllUsers))
    const data=JSON.stringify(Users)
    console.log(data)
    return {
      props:{
        data:data
    }
    }
  }
  export default Page