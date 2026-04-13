import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Button from "@mui/material/Button";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import {
  handleNextFocusLeft,
  handleNextFocusRight,
  getCurrentMonth,
} from "../GlobalJS/GlobalFunctions";
import "tabulator-tables/dist/css/tabulator.min.css";
const FetchGridData = "/AccountsAPI/Accounts/MonthwiseBalance";

function BalanceSheet() {
  const [date, setDate] = useState(getCurrentMonth);
  const dateRef = useRef(null);
  const refreshRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    dateRef.current.focus();
    LoadGridData();
  }, []);

  useEffect(() => {
    LoadGridData();
  }, [date]);

  const LoadGridData = async () => {
    try {
      let monthYear = date.split("-");
      const obj = {
        Month: parseInt(monthYear[1]),
        Year: parseInt(monthYear[0]),
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

  const initalizegrid = (data) => {
    const table = new Tabulator(tableRef.current, {
      layout: "fitColumns",
      height: "400px",
      data: data,
      columns: [
        { title: "S.No", field: "sno", formatter: "rownum", width: 70 },
        { title: "Name", field: "Name", sorter: "date", minWidth: 120 },
        {
          title: "Balance",
          field: "Balance",
          sorter: "int",
          width: 120,
          hozAlign: "right",
          formatter: "money",
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
                    onKeyDown={(e) => handleNextFocusRight(e, refreshRef)}
                  />
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <Button
                    variant="outlined"
                    ref={refreshRef}
                    onKeyDown={(e) => handleNextFocusLeft(e, dateRef)}
                    onClick={LoadGridData}
                  >Refresh</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-4">
              <div ref={tableRef}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BalanceSheet;
