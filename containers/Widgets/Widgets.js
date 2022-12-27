import React, { useEffect, useState } from 'react';
import clone from 'clone';
import { Row, Col } from 'antd';
import LayoutWrapper from '@iso/components/utility/layoutWrapper';
import basicStyle from '@iso/assets/styles/constants';
import IsoWidgetsWrapper from './WidgetsWrapper';
import IsoWidgetBox from './WidgetBox';
import CardWidget from './Card/CardWidget';
import ProgressWidget from './Progress/ProgressWidget';
import StickerWidget from './Sticker/StickerWidget';
import SaleWidget from './Sale/SaleWidget';
import VCardWidget from './vCard/vCardWidget';
import SocialWidget from './SocialWidget/SocialWidget';
import SocialProfile from './SocialWidget/SocialProfileIcon';
import userpic from '@iso/assets/images/user1.png';
import {API,graphqlOperation,withSSRContext} from 'aws-amplify';
import {getAllUsers} from '../../src/graphql/queries'
import { isServer } from '@iso/lib/helpers/isServer';
import * as rechartConfigs from '../Charts/Recharts/config';
import IntlMessages from '@iso/components/utility/intlMessages';
import {
  StickerWidgetImgUploadIcon,
  StickerWidgetMessageIcon,
  StickerWidgetOrderIcon,
  SidebarProfileIcon
} from '@iso/config/icon.config';
import Table from '../Table/Table';

const styles = {
  wisgetPageStyle: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyItems:"center",
    alignItems:'center',
    borderRadius:'20px'
  },
};

const STICKER_WIDGET = [
  {
    number: 'widget.stickerwidget1.number',
    text: 'Students Enrolled',
    icon: <SidebarProfileIcon size={20} color="#ffffff" />,
    fontColor: '#ffffff',
    fontSize:"15px",
    bgColor: '#42A5F6',
  },
  {
    number: 'widget.stickerwidget1.number',
    text: 'Total Courses',
    icon: <StickerWidgetMessageIcon size={30} color="#ffffff" />,
    fontColor: '#ffffff',
    bgColor: '#7ED320',
  },
  {
    number: 'widget.stickerwidget1.number',
    text: 'Total Teachers',
    icon: <SidebarProfileIcon size={30} color="#ffffff" />,
    fontColor: '#ffffff',
    bgColor: 'black',
  },
];

const SALE_WIDGET = [
];
const PROGRESS_WIDGET=[]
const CARD_WIDGET = [
];
const SOCIAL_PROFILE=[]
export default function Widgets() {
  const [Users,setUsers]=useState([])
  const { rowStyle, colStyle } = basicStyle;
  useEffect(async ()=>{
    const Users=await API.graphql(graphqlOperation(getAllUsers))
    const Students=Users.data.getAllUsers.filter((object)=>{
      return object.userType==="student"
    })
    STICKER_WIDGET[0].number=Students.length
    setUsers(Users.data.getAllUsers)
  },[])
  const chartEvents = [
  
  ];

  const stackConfig = {
    ...rechartConfigs.StackedAreaChart,
    width: !isServer && window.innerWidth < 450 ? 300 : 500,
  };
  return (
    <LayoutWrapper>
      <div style={styles.wisgetPageStyle}>
      <Row style={rowStyle} gutter={0} justify="start">
          {STICKER_WIDGET.map((widget, idx) => (
            <Col lg={6} md={12} sm={12} xs={24} style={{ whiteSpace:'nowrap'}} key={idx}>
              <IsoWidgetsWrapper>
                {/* Sticker Widget */}
                <StickerWidget
                  number={<IntlMessages id={widget.number} />}
                  text={<IntlMessages id={widget.text} />}
                  icon={widget.icon}
                  fontColor={widget.fontColor}
                  bgColor={widget.bgColor}
                />
              </IsoWidgetsWrapper>
            </Col>
          ))}
        </Row>

        <Row style={rowStyle} gutter={0} justify="start">
          <Col lg={16} md={17} sm={24} xs={24} style={{marginTop:5,borderRadius:20}}>
            <IsoWidgetsWrapper>
              <IsoWidgetBox>
                {/* TABLE */}
                <Table Users={Users}/>
              </IsoWidgetBox>
            </IsoWidgetsWrapper>
          </Col>
           <Col lg={8} md={12} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              {/* VCard Widget */}
              <VCardWidget
                style={{ height: '450px' }}
                src={userpic}
                alt="Jhon"
                name={<IntlMessages id="widget.vcardwidget.name" />}
                title={<IntlMessages id="widget.vcardwidget.title" />}
                description={
                  <IntlMessages id="widget.vcardwidget.description" />
                }
              >
                <SocialWidget>
                  {SOCIAL_PROFILE.map((profile, idx) => (
                    <SocialProfile
                      key={idx}
                      url={profile.url}
                      icon={profile.icon}
                    />
                  ))}
                </SocialWidget>
              </VCardWidget>
            </IsoWidgetsWrapper>
          </Col>
        </Row>

        <Row style={rowStyle} gutter={0} justify="start">
          {SALE_WIDGET.map((widget, idx) => (
            <Col lg={6} md={12} sm={12} xs={24} style={colStyle} key={idx}>
              <IsoWidgetsWrapper>
                {/* Sale Widget */}
                <SaleWidget
                  label={<IntlMessages id={widget.label} />}
                  price={<IntlMessages id={widget.price} />}
                  details={<IntlMessages id={widget.details} />}
                  fontColor={widget.fontColor}
                />
              </IsoWidgetsWrapper>
            </Col>
          ))}
        </Row>

        <Row style={rowStyle} gutter={0} justify="start">
          <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
            {CARD_WIDGET.map((widget, idx) => (
              <IsoWidgetsWrapper key={idx} gutterBottom={20}>
                {/* Card Widget */}
                <CardWidget
                  icon={widget.icon}
                  iconcolor={widget.iconcolor}
                  number={<IntlMessages id={widget.number} />}
                  text={<IntlMessages id={widget.text} />}
                />
              </IsoWidgetsWrapper>
            ))}
          </Col>

          <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
            {PROGRESS_WIDGET.map((widget, idx) => (
              <IsoWidgetsWrapper key={idx} gutterBottom={20}>
                {/* Progress Widget */}
                <ProgressWidget
                  label={<IntlMessages id={widget.label} />}
                  details={<IntlMessages id={widget.details} />}
                  icon={widget.icon}
                  iconcolor={widget.iconcolor}
                  percent={widget.percent}
                  barHeight={widget.barHeight}
                  status={widget.status}
                />
              </IsoWidgetsWrapper>
            ))}
          </Col>

       
        </Row>
        <Row style={rowStyle} gutter={0} justify="start">
         
        </Row>
      </div>
    </LayoutWrapper>
  );
}