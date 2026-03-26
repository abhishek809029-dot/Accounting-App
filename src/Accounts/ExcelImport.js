import React, {useState,useRef} from 'react'
import axios from "axios";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
const url = "/AccountsAPI/Accounts/InsertFromExcel";


function ExcelImport() {
  const [fileVal,setFileVal] = useState("");
  const fileInputRef = useRef(null); 

  const UploadFile = async () => {
    if (!fileVal) {
      Swal.fire({
        icon: "warning",
        text: "Please select a file first ...",
      });
      return;
    }
    try {
      const formData = new FormData();
      formData.append("UserName", sessionStorage.getItem("UserName"));
      formData.append("ExcelFile", fileVal);
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if(response.data.success)
      {
        Swal.fire({
          icon: "success",
          text: response.data.message,
        });
          setFileVal(null);
          fileInputRef.current.value = "";
      }
      else
      {
        Swal.fire({
          icon: "error",
          text: response.data.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error || "Something went wrong!",
      });
    }
  } 

  return (
    <div className="container-fluid mt-3">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <input type='file' ref={fileInputRef} onChange={(e) => setFileVal(e.target.files[0])} accept=".xlsx,.xls" className='form-control' />
            </div>
            <div className='col-md-2'>
                <Button variant="outlined" onClick={UploadFile} >Upload </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExcelImport
