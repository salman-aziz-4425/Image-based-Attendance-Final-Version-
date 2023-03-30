import ExcelJS from 'exceljs';
import { Button, Input, Upload, message } from "antd";
export default function MyExcelComponent(props) {
  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Add headers to the worksheet
    worksheet.columns = [
      { header: 'rollNumber', key: 'rollNumber' },
      { header: 'Attendance', key: 'Attendance' },
      { header: 'Time', key: 'time' },
    ];

    // Add data to the worksheet
    props?.users.map((obj)=>{
        let attend=""
        if(obj?.faceConf>80){
            attend="Present"
        }
        else{
            attend="Absent"
        }
        worksheet.addRow({ rollNumber:obj?.rollNumber,Attendance:attend,time:new Date()});
    })
    console.log(props.users)
    // Write the workbook to a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create a blob object from the buffer
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Download the blob as an Excel file
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'markedAttendance.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
    type="primary"
    shape="round"
    className="bg-blue-900 mt-[43px]"
    onClick={handleExport}
  >
    Save Excel
  </Button>
  );
}