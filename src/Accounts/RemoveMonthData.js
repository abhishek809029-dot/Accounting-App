import React, { useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
const FetchGridData = "/AccountsAPI/Accounts/RemoveMonthData";

function RemoveMonthData() {
  const tableRef = useRef(null);

  useEffect(() => {
    LoadGridData();
  }, []);

  const LoadGridData = async () => {
    try {
      const obj = {
        Month: 0,
        Year: 0,
        UserName: sessionStorage.getItem("UserName"),
        Mode: "Find"
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

  const DeleteGridData = async (Month,Year) => {
    try {
      const obj = {
        Month,
        Year,
        UserName: sessionStorage.getItem("UserName"),
        Mode: "Delete"
      };
      const response = await axios.post(FetchGridData, obj);
      if (response.data.success) {
        LoadGridData();
      }
      else
      {
        Swal.fire({
        icon: "error",
        text: response.data.data || "Unexpected Error ...",
      });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error || "Unexpected Error ...",
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
        { title: "Date", field: "MonthDate", sorter: "date", minWidth: 120 },
        { title: "Delete", formatter: () => "🗑️", hozAlign: "center",  width: 80, 
          cellClick: function (e, cell) {
            const rowData = cell.getRow().getData();
            Swal.fire({
              title: "Are you sure?",
              text: "You want to delete this record!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#d33",
              cancelButtonColor: "#3085d6",
              confirmButtonText: "Yes, delete it!"
            }).then((result) => {
              if (result.isConfirmed) {
                const date = new Date(rowData.MonthDate);
                const month = date.getMonth() + 1; 
                const year = date.getFullYear();
                DeleteGridData(month,year);
              }
            });
          }
        }
      ],
    });
  };

  return (
    <div className="container-fluid mt-3">
      <div className="card shadow-sm">
        <div className="card-body">
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

export default RemoveMonthData;
