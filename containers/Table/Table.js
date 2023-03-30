import { Button } from 'antd'
import React from 'react'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import Model from '../Model/Model';
import { tokenAuth } from '../../redux/userlogin/userSlice';
import { useDispatch,useSelector } from 'react-redux';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
function Table({Users,flag,deleteUsers,setUser,imageHandler}) {
  const user={
    id:useSelector((state)=>state.userReducer.id)
  }
  const [open,setOpen]=useState(false)
  const [singleUser,setSingle]=useState({})
  const modelHanlder=(User)=>{
    setSingle(User)
    setOpen(true)
  }
  return (
    <>
                    <div className="flex flex-col h-50 w-full">
                      <thead>
                      <tr className='px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
              <th scope="col" className="text-sm font-medium text-gray-900 pl-8 py-4 text-left">
                #
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 pl-6 py-4 text-left">
                RollNumber
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 pl-8 py-4 text-left">
                name
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 pl-20 py-4 text-left">
                qualification
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 pl-8 py-4 text-left">
                userType
              </th>
              {flag&&
              <th scope="col" className="text-sm font-medium text-gray-900 pl-8 py-4 text-left">
                Edit
              </th>
}
            </tr>
                      </thead>
      <div className="min-w-full h-60  overflow-auto">
        <table className="min-w-full h-60">
          <thead className="border-b">
          
          </thead>
          <tbody className='overflow-auto'>
            {
              Users.map((User,index)=>{
              
                return(
                  <tr className="border-b">
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index+1}
                    </td>
                  <td className="text-sm text-gray-900 font-light px-2 py-4 whitespace-nowrap">
                    {User.rollNumber}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-1 py-4 whitespace-nowrap">
                  {User.name}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-2 py-4 whitespace-nowrap">
                  {User.qualification}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-2 py-4 whitespace-nowrap">
                  {User.userType}
                  </td>
                  {flag&&
                  <td className="text-sm text-gray-900 font-light px-2 py-4 whitespace-nowrap">
                  <Button className='border-none border-transparent' onClick={()=>modelHanlder(User)}><EditIcon/></Button>
                  <Button onClick={()=>imageHandler(User.image)}><AddAPhotoIcon/></Button>
                  </td>
                   }
                     {(flag&&User.id!==user.id)?
                  <td className="text-sm text-gray-900 font-light px-2 py-4 whitespace-nowrap">
                   <Button className='border-none border-transparent' onClick={()=>deleteUsers(User.rollNumber)}><DeleteIcon/></Button>
                  </td>:<td></td>
                   }
                </tr>
                )

              }

         
              )
  
}
          </tbody>
        </table>
      </div>
      <Model open={open} setOpen={setOpen} User1={singleUser} AllUsers={Users} setUser={setUser}/>
</div>
    </>
  )
}

export default Table