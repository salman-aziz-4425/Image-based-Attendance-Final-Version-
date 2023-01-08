import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "../../containers/DashboardLayout/DashboardLayout";
import { Row, Col, Button } from "antd";
import IsoWidgetsWrapper from "../../containers/Widgets/WidgetsWrapper";
import IsoWidgetBox from "../../containers/Widgets/WidgetBox";
import Table from "../../containers/Table/Table";
import { getAllUsers } from "../../src/graphql/queries";
import { deleteUser } from "../../src/graphql/mutations";
import Router from "next/router";
import { API, graphqlOperation, Amplify } from "aws-amplify";
import { tokenAuth } from "../../redux/userlogin/userSlice";
function DeleteProfile() {
  const dispatch = useDispatch();
  let token = useSelector((state) => state.userReducer.token);
  Amplify.configure({
    API: {
      graphql_headers: async () => ({
        token: token,
      }),
    },
  });
  const [User, setUser] = useState([{}]);
  const [Visible, setVisible] = useState(false);
  const [imgSrc, setImage] = useState("");
  useEffect(async () => {
    const Data =
      localStorage.getItem("Token") &&
      JSON.parse(localStorage.getItem("Token"));
    if (Data?.Auth === false || !localStorage.getItem("Token")) {
      Router.push("/");
    } else {
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
    const res = await API.graphql(graphqlOperation(getAllUsers));
    setUser(res.data.getAllUsers);
  }, [token]);
  const imageHandler = (imageSrc) => {
    console.log(imageSrc);
    setImage(imageSrc);
    console.log(imageSrc);
  };
  const deleteUser1 = async (rollNumber1) => {
    const variables = {
      rollNumber: rollNumber1,
    };

    await API.graphql(graphqlOperation(deleteUser, variables))
      .then((result) => {
        alert("deleted");
        setUser(
          User.filter((object) => {
            return object.rollNumber != rollNumber1;
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <DashboardLayout>
      <div className="h-5/7 w-5/7 my-6 mx-10 bg-white font-extrabold align-middle rounded-md shadow-2xl overflow-hidden">
        <div className="flex">
          <h1 className="p-4 font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-gray-700 to-red-700">
            Delete/Update User
          </h1>
        </div>
        <Button className="ml-6" onClick={() => setVisible(!Visible)}>
          Edit Student
        </Button>
        <Row
          className="items-center"
          style={{ width: "100%", justifyContent: "between" }}
          gutter={0}
          justify="start"
        >
          <Col
            lg={16}
            md={24}
            sm={24}
            xs={24}
            style={{ marginTop: 5, borderRadius: 20 }}
          >
            <IsoWidgetsWrapper>
              <IsoWidgetBox>
                {/* TABLE */}
                <div className="flex flex-row w-full">
                  <Table
                    Users={User}
                    flag={Visible}
                    deleteUsers={deleteUser1}
                    setUser={setUser}
                    imageHandler={imageHandler}
                  />
                </div>
              </IsoWidgetBox>
            </IsoWidgetsWrapper>
          </Col>
          <img className="w-45 h-40 object-fit rounded-md" src={imgSrc} />
        </Row>
      </div>
    </DashboardLayout>
  );
}
export default DeleteProfile;
