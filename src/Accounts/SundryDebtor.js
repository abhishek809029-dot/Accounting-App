import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import {
  handleNextFocus,
  handleNextFocusLeft,
  handleNextFocusRight,
  getCurrentMonth,
} from "../GlobalJS/GlobalFunctions";
import "tabulator-tables/dist/css/tabulator.min.css";
const FetchDataUrl = "/AccountsAPI/Accounts/FetchAccountEntryData";
const FetchGridData = "/AccountsAPI/Accounts/GetDashboardData";
const SundryDrExcel = "/AccountsAPI/Accounts/SundryDrExcel";

function SundryDebtor() {
  const [date, setDate] = useState(getCurrentMonth);
  const dateRef = useRef(null);
  const [reason, setReason] = useState(null);
  const reasonRef = useRef(null);
  const [category, setCategory] = useState(null);
  const categoryRef = useRef(null);
  const [reasonArray, setReasonArray] = useState([]);
  const [categoryArray, setCategoryArray] = useState([]);
  const exportRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    dateRef.current.focus();
    LoadData();
    LoadGridData();
  }, []);

  useEffect(() => {
    LoadGridData();
  }, [date, reason, category]);

  const LoadData = async () => {
    try {
      const obj = {
        UserName: sessionStorage.getItem("UserName"),
      };
      const response = await axios.post(FetchDataUrl, obj);
      setReasonArray(response.data.Reason || []);
      setCategoryArray(response.data.Category || []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error || "Something went wrong!",
      });
    }
  };

  const LoadGridData = async () => {
    try {
      let monthYear = date.split("-");
      const obj = {
        Month: parseInt(monthYear[1]),
        Year: parseInt(monthYear[0]),
        ReasonCode: reason?.Code ?? "",
        CategoryCode: category?.Code ?? "",
        PayTypeCode: "",
        UserName: sessionStorage.getItem("UserName")
      };
      const response = await axios.post(FetchGridData, obj);
      if (response.data.success) {
        initalizegrid(response.data.data);
      }
      else
      {
        initalizegrid([]);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error || "Something went wrong!",
      });
    }
  };

  const ExportExcel = async () => {
    try {

      if((!reason) || (!category))
      {
        Swal.fire({
        icon: "warning",
        text: "Please select Name and Category",
      });
      return;
      }

      let monthYear = date.split("-");

      const obj = {
        Month: parseInt(monthYear[1]),
        Year: parseInt(monthYear[0]),
        ReasonCode: reason?.Code ?? "",
        CategoryCode: category?.Code ?? "",
        UserName: sessionStorage.getItem("UserName"),
      };

      const response = await axios.post(SundryDrExcel, obj, {
        responseType: "blob", 
        headers: {
          "Content-Type": "application/json",
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "SundryDrCr.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error?.message || "Something went wrong!",
      });
    }
  };

  const initalizegrid = (data) => {
    const table = new Tabulator(tableRef.current, {
      layout: "fitColumns",
      height: "400px",
      data: data,
      columns: [
        { title: "Code", field: "Code", visible: false },
        { title: "S.No", field: "sno", formatter: "rownum", width: 70 },
        { title: "Date", field: "Date", sorter: "date", width: 120 },
        {
          title: "Debit",
          field: "Debit",
          sorter: "string",
          width: 120,
          hozAlign: "right",
          formatter: "money",
          bottomCalc: "sum",
          bottomCalcFormatter: "money",
        },
        {
          title: "Credit",
          field: "Credit",
          sorter: "string",
          width: 120,
          hozAlign: "right",
          formatter: "money",
          bottomCalc: "sum",
          bottomCalcFormatter: "money",
        },
        { title: "Comment", field: "Comment", sorter: "string", minWidth: 150 },
        {
          title: "Reason",
          field: "ReasonName",
          sorter: "string",
          width: 200,
          bottomCalc: function (values, data) {
            let totalDebit = 0;
            let totalCredit = 0;
            data.forEach((row) => {
              totalDebit += Number(row.Debit || 0);
              totalCredit += Number(row.Credit || 0);
            });
            return totalCredit - totalDebit;
          },
          bottomCalcFormatter: function (cell) {
            let value = cell.getValue();
            return `<div style="width:100%; text-align:right;">
              ${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>`;
          },
        },
        {
          title: "Payment",
          field: "PayTypeName",
          sorter: "string",
          width: 140,
        },
      ],
    });
  };

  return (
    <div className="container-fluid mt-3">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row mb-2">
            <div className="col-md-9">
              <div className="row mb-3">
                <div className="col-md-3">
                  <input
                    type="month"
                    ref={dateRef}
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    onKeyDown={(e) => {
                      handleNextFocusRight(e, reasonRef);
                      handleNextFocus(e, reasonRef);
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <Autocomplete
                      options={reasonArray}
                      value={reason}
                      size="small"
                      getOptionLabel={(option) => option.Name}
                      isOptionEqualToValue={(option, value) =>
                        option.Code === value.Code
                      }
                      onChange={(event, newValue) => {
                        setReason(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Name"
                          inputRef={reasonRef}
                          onKeyDown={(e) => {
                            handleNextFocusRight(e, categoryRef);
                            handleNextFocusLeft(e, dateRef);
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <Autocomplete
                      options={categoryArray}
                      value={category}
                      size="small"
                      getOptionLabel={(option) => option.Name}
                      isOptionEqualToValue={(option, value) =>
                        option.Code === value.Code
                      }
                      onChange={(event, newValue) => {
                        setCategory(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Category"
                          inputRef={categoryRef}
                          onKeyDown={(e) => {
                            handleNextFocusRight(e, exportRef);
                            handleNextFocusLeft(e, reasonRef);
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <Button
                    variant="outlined"
                    ref={exportRef}
                    onKeyDown={(e) => handleNextFocusLeft(e, categoryRef)}
                    onClick={ExportExcel}
                  >Export</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-10">
              <div ref={tableRef}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SundryDebtor;
