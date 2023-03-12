
import * as XLSX from 'xlsx'

export default function fileReader(e){
    let excelFile=[]
    let filteredData=[]
    let rollNumbers=[]
    let selectedFile = e.target?.files[0];
    // if(selectedFile){
      console.log(selectedFile?.type);
      // if(selectedFile&&fileType.includes(selectedFile.type)){
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload=(e)=>{
          excelFile=e.target.result
        } 
        e.preventDefault();
        if(excelFile!==null){
            console.log("Entered")
            console.log(excelFile)
          const workbook = XLSX.read(excelFile,{type:'buffer'});
          const worksheetName = workbook.SheetNames[0];
          const worksheet=workbook.Sheets[worksheetName];
          let data = XLSX.utils.sheet_to_json(worksheet);
          data=data.slice(6)
          console.log(data[0]?.__EMPTY_1.includes("F"))
          console.log(data)
          try{
            excelData.map((user)=>{
              rollNumbers.push(user?.__EMPTY_1)
            })
            rollNumbers.pop()
            console.log(rollNumbers)
          }catch{
            alert("Invalid properties")
          }
}
}