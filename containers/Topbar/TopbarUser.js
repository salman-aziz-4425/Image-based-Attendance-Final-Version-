import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Popover from '@iso/components/uielements/popover';
// import authAction from '../../authentication/actions';
import TopbarDropdownWrapper from './TopbarDropdown.styles';
import { tokenAuth } from '../../redux/userlogin/userSlice';
// const { logout } = authAction;
import userpic from '@iso/assets/images/user1.png';
import Router from 'next/router';
export default function TopbarUser() {
  const [visible, setVisibility] = React.useState(false);
  const dispatch = useDispatch();
  function handleVisibleChange() {
    setVisibility(visible => !visible);
  }
  let srcImage=useSelector((state)=>state.userReducer.image)
  const content = (
    <TopbarDropdownWrapper className="isoUserDropdown">
      <a className="isoDropdownLink" onClick={() =>{
        dispatch(tokenAuth({
          token:'',
          name:'',
          email:'',
          image:'',
          email:' ',
          Auth:false
      }))
        localStorage.setItem('Token',JSON.stringify({
          Auth:false
        }))
        Router.push('/')
      }}>
        Logout
      </a>
    </TopbarDropdownWrapper>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
      arrowPointAtCenter={true}
      placement="bottomLeft"
    >
      <div className="isoImgWrapper">
        <img alt="user" src={srcImage} />
        <span className="userActivity online" />
      </div>
    </Popover>
  );
}
