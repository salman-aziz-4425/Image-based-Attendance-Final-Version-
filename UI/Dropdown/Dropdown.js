import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function BasicMenu({type,setType,activeTypes,title}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    console.log(event.target.innerText)
    setType(event.target.innerText)
    setAnchorEl(null);
  };
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        fullWidth
        className=' border-black'
      >
        {title}:{type}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }} 
        className="w-full align-middle justify-center"
      >
        {
          activeTypes.map((obj)=>(
            <>
            <MenuItem  className="w-full" value="Student" onClick={handleClose}>{obj}</MenuItem>
            </>
          ))
      }
      </Menu>
    </div>
  );
}