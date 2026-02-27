import React, { useEffect, useRef,useState } from 'react'
import axios from "axios";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import {
  handleNextFocus,
  handleNextFocusLeft,
  handleNextFocusRight
} from "../GlobalJS/GlobalFunctions";
import "tabulator-tables/dist/css/tabulator.min.css";

const FetchDataUrl = "/AccountsAPI/Accounts/FetchAccountEntryData";

const MOCK_DATA = [
  { date: "25/Feb/2026", debit: 0, credit: 2000, reason: "Test 1", category: "Test Cat 1", payment: "Test Pay 1" },
  { date: "25/Feb/2026", debit: 110, credit: 0, reason: "Test 2", category: "Test Cat 2", payment: "Test Pay 3" },
  { date: "26/Feb/2026", debit: 0, credit: 2000, reason: "Test 3", category: "Test Cat 2", payment: "Test Pay 5" },
  { date: "26/Feb/2026", debit: 200, credit: 0, reason: "Test 1", category: "Test Cat 1", payment: "Test Pay 1" },
  { date: "26/Feb/2026", debit: 500, credit: 0, reason: "Test 2", category: "Test Cat 1", payment: "Test Pay 1" },
  { date: "27/Feb/2026", debit: 800, credit: 0, reason: "Test 1", category: "Test Cat 2", payment: "Test Pay 7" },
  { date: "27/Feb/2026", debit: 0, credit: 2000, reason: "Test 4", category: "Test Cat 1", payment: "Test Pay 1" },
  { date: "27/Feb/2026", debit: 1200, credit: 0, reason: "Test 1", category: "Test Cat 1", payment: "Test Pay 2" },
];

function Dashboard() {
  const [reason, setReason] = useState(null);
  const reasonRef = useRef(null);
  const [category, setCategory] = useState(null);
  const categoryRef = useRef(null);
  const [paytype, setPayType] = useState(null);
  const paytypeRef = useRef(null);
  const [reasonArray, setReasonArray] = useState([]);
    const [categoryArray, setCategoryArray] = useState([]);
    const [payTypeArray, setPayTypeArray] = useState([]);
  const tableRef = useRef(null);

  useEffect(() => {
    reasonRef.current.focus();
    LoadData();
    initalizegrid();
  }, []);

  const LoadData = async () => {
    try {
      const obj = {
        UserName: "ABHISHEK",
      };
      const response = await axios.post(FetchDataUrl, obj);
      setReasonArray(response.data.Reason || []);
      setCategoryArray(response.data.Category || []);
      setPayTypeArray(response.data.PaymentType || []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error || "Something went wrong!",
      });
    }
  };

const initalizegrid = () => {
  const table = new Tabulator(tableRef.current, {
      layout: "fitColumns",
      data: MOCK_DATA,
      columns: [
        { title: "S.No", field: "sno", formatter:"rownum", width:70},
          { title: "Date", field: "date", sorter: "date", width:120 },
          { title: "Debit", field: "debit", sorter: "string", width:120,hozAlign: "right", formatter: "money" },
          { title: "Credit", field: "credit", sorter: "string", width:120,hozAlign: "right", formatter: "money" },
          { title: "Comment", field: "comment", sorter: "string",minWidth:150 },
          { title: "Reason", field: "reason", sorter: "string",width:200 },
          { title: "Category", field: "category", sorter: "string", width:180 },
          { title: "Payment", field: "payment", sorter: "string", width:140 },
      ]
    });
}

  return (
   <div className="container-fluid mt-3">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row mb-2">
            <div className="col-md-8">
              <div className="row mb-3">
                <div className="col-md-4">
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
                          label="Reason"
                          inputRef={reasonRef}
                          onKeyDown={(e) => {
                            handleNextFocusRight(e, categoryRef);
                            handleNextFocus(e, categoryRef)
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-4">
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
                            handleNextFocusRight(e, paytypeRef);
                            handleNextFocusLeft(e,reasonRef);
                            handleNextFocus(e, paytypeRef)
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <Autocomplete
                      options={payTypeArray}
                      value={paytype}
                      
                      size="small"
                      getOptionLabel={(option) => option.Name}
                      isOptionEqualToValue={(option, value) =>
                        option.Code === value.Code
                      }
                      onChange={(event, newValue) => {
                        setPayType(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Payment Type"
                          inputRef={paytypeRef}
                          onKeyDown={(e) => handleNextFocusLeft(e, categoryRef)}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div ref={tableRef}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
