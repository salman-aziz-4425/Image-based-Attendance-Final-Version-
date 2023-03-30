import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import LayoutWrapper from "@iso/components/utility/layoutWrapper";
import basicStyle from "@iso/assets/styles/constants";
import IsoWidgetsWrapper from "./WidgetsWrapper";
import IsoWidgetBox from "./WidgetBox";
import StickerWidget from "./Sticker/StickerWidget";
import VCardWidget from "./vCard/vCardWidget";
import SocialWidget from "./SocialWidget/SocialWidget";
import SocialProfile from "./SocialWidget/SocialProfileIcon";
import userpic from "@iso/assets/images/user1.png";
import { API, Amplify } from "aws-amplify";
import { getAllUsers } from "../../src/graphql/queries";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { tokenAuth } from "../../redux/userlogin/userSlice";
import { useSelector, useDispatch } from "react-redux";
import IntlMessages from "@iso/components/utility/intlMessages";
import Router from "next/router";
import { SidebarProfileIcon } from "@iso/config/icon.config";
import Table from "../Table/Table";

const styles = {
  wisgetPageStyle: {
    display: "flex",
    flexFlow: "row wrap",
    justifyItems: "center",
    alignItems: "center",
    borderRadius: "20px",
  },
};

const STICKER_WIDGET = [
  {
    count: 0,
    number: "widget.stickerwidget1.number",
    text: "Students",
    icon: <SidebarProfileIcon size={20} color="#ffffff" />,
    fontColor: "#ffffff",
    fontSize: "15px",
    bgColor: "#42A5F6",
  },
  {
    count: 0,
    number: "widget.stickerwidget2.number",
    text: "Admins",
    icon: <LibraryBooksIcon sx={{ color: "white" }} size={20} color="white" />,
    fontColor: "#ffffff",
    bgColor: "#7ED320",
  },
  {
    count: 0,
    number: "widget.stickerwidget3.number",
    text: "Teachers",
    icon: <SidebarProfileIcon size={20} color="#ffffff" />,
    fontColor: "#ffffff",
    bgColor: "black",
  },
];
const SOCIAL_PROFILE = [];
export default function Widgets() {
  let token = useSelector((state) => state.userReducer.token);
  const User = {
    name: useSelector((state) => state.userReducer.name),
    email: useSelector((state) => state.userReducer.email),
    qualification: useSelector((state) => state.userReducer.qualification),
    rollNumber: useSelector((state) => state.userReducer.rollNumber),
    image: useSelector((state) => state.userReducer.image),
  };
  Amplify.configure({
    API: {
      graphql_headers: async () => ({
        token: token,
      }),
    },
  });
  const authToken = useSelector((state) => state.userReducer.token);
  const dispatch = useDispatch();
  const [Users, setUsers] = useState([]);
  const { rowStyle, colStyle } = basicStyle;
  useEffect(async () => {
    const Data =
      localStorage.getItem("Token") &&
      JSON.parse(localStorage.getItem("Token"));
    if (Data?.Auth === false || !localStorage.getItem("Token")) {
      Router.push("/");
    } else {
      if(Data?.rollNumber.includes("TD-")===true){
        Router.push("/dashboard/GroupImage");
      }
      dispatch(
        tokenAuth({
          id: Data?.id,
          token: Data?.token,
          name: Data?.name,
          email: Data?.email,
          image: Data?.image,
          qualification: Data?.qualification,
          rollNumber: Data?.rollNumber,
          Auth: true,
        })
      );
    }
    console.log(authToken);
    await API.graphql({
      query: getAllUsers,
      authToken: authToken,
    }).then((result) => {
      if (result.data.getAllUsers.length > 0) {
        const Students = result.data.getAllUsers.filter((object) => {
          return object.userType === "student";
        });
        const Teacher = result.data.getAllUsers.filter((object) => {
          return object.userType === "teacher";
        });
        const Admin = result.data.getAllUsers.filter((object) => {
          return object.userType === "admin";
        });
        STICKER_WIDGET[0].count = Students.length;
        STICKER_WIDGET[2].count = Teacher.length;
        STICKER_WIDGET[1].count = Admin.length;
        setUsers(result.data.getAllUsers);
      }
    });
  }, [token]);
  const chartEvents = [];

  return (
    <LayoutWrapper>
      <div style={styles.wisgetPageStyle}>
        <Row style={rowStyle} gutter={0} justify="start">
          {STICKER_WIDGET.map((widget, idx) => (
            <Col
              lg={6}
              md={12}
              sm={12}
              xs={24}
              style={{ whiteSpace: "nowrap" }}
              key={idx}
            >
              <IsoWidgetsWrapper>
                {/* Sticker Widget */}
                <StickerWidget
                  count={widget.count}
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
          <Col
            lg={16}
            md={17}
            sm={24}
            xs={24}
            style={{ marginTop: 5, borderRadius: 20 }}
          >
            <IsoWidgetsWrapper>
              <IsoWidgetBox>
                {/* TABLE */}
                <Table Users={Users} />
              </IsoWidgetBox>
            </IsoWidgetsWrapper>
          </Col>
          <Col lg={8} md={12} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              {/* VCard Widget */}
              <VCardWidget
                style={{ height: "450px" }}
                src={User.image}
                alt="Jhon"
                name={User.name}
                email={User.email}
                title={User.rollNumber}
                description={User.qualification}
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

        <Row style={rowStyle} gutter={0} justify="start"></Row>
        <Row style={rowStyle} gutter={0} justify="start"></Row>
      </div>
    </LayoutWrapper>
  );
}
