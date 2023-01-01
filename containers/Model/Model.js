import React, { useState } from 'react'
import { Modal,Box,Typography } from '@mui/material'
import {Button } from 'antd';
export default function Model({open,setOpen}) {
    const handleOpen=()=>{
        setOpen(!open)
    }
  return (
    <>
    <Modal
      open={open}
      onClose={handleOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className='w-2/5'>
      <div className="h-5/7 w-5/7 my-6 mx-10 bg-white font-extrabold align-middle rounded-md shadow-2xl overflow-hidden">

      </div>
      </Box>
    </Modal>
    </>
  )
}
