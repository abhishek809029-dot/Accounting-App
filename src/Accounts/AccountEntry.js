import React, { useState, useRef, useEffect } from "react";
import TopControl from "../GlobalJS/TopControl";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Find from "../GlobalJS/Find";
import axios from "axios";
import Swal from "sweetalert2";
import {
  getCurrentDate,
  handleNextFocus,
  formattedDate,
} from "../GlobalJS/GlobalFunctions";
const url = "/AccountsAPI/Accounts/AccountEntry";
const FetchDataUrl = "/AccountsAPI/Accounts/FetchAccountEntryData";

function AccountEntry() {
  const [activeButtons, setActiveButtons] = useState(["add", "find"]);
  //const [name, setName] = useState("");
  const nameRef = useRef(null);
  const [date, setDate] = useState(getCurrentDate());
  const dateRef = useRef(null);
  const [debit, setDebit] = useState("");
  const debitRef = useRef(null);
  const [credit, setCredit] = useState("");
  const creditRef = useRef(null);
  const [reason, setReason] = useState(null);
  const reasonRef = useRef(null);
  const [reasonError, setReasonError] = useState(false);
  const [comment, setComment] = useState("");
  const commentRef = useRef(null);
  const [category, setCategory] = useState(null);
  const categoryRef = useRef(null);
  const [categoryError, setCategoryError] = useState(false);
  const [paytype, setPayType] = useState(null);
  const paytypeRef = useRef(null);
  const [oayTypeError, setPayTypeError] = useState(false);
  const addRef = useRef(null);
  const [editSearchCode, setEditSearchCode] = useState(null);
  //const [sno, setSno] = useState(1);
  const [searchCode, setSearchCode] = useState("");
  const [reasonArray, setReasonArray] = useState([]);
  const [categoryArray, setCategoryArray] = useState([]);
  const [payTypeArray, setPayTypeArray] = useState([]);
  const [findData, setFindData] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    LoadData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey) {
        const key = event.key.toLowerCase();
        let action = "";
        switch (key) {
          case "a":
            action = "add";
            break;
          case "e":
            action = "edit";
            break;
          case "d":
            action = "delete";
            break;
          case "s":
            action = "save";
            break;
          case "f":
            action = "find";
            break;
          case "c":
            action = "cancel";
            break;
          case "r":
            action = "refresh";
            break;
          default:
            return;
        }
        event.preventDefault();
        if (activeButtons.includes(action)) {
          handleToolbarAction(action);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeButtons, searchCode]);

  const handleToolbarAction = (id) => {
    if (id === "add" || id === "edit") {
      setDisabled(false);
      setTimeout(() => {
        dateRef.current?.focus();
      }, 0);
      setActiveButtons(["save", "refresh", "cancel"]);
    } else if (id === "cancel") {
      setDate(getCurrentDate());
      setSearchCode("");
      setGridData([]);
      setDisabled(true);
      setActiveButtons(["add", "find"]);
    } else {
      handleAccountEntry(id);
    }
  };

  const handleAccountEntry = (mode) => {
    switch (mode) {
      case "save":
        ClearValues();
        setGridData(null);
        if (searchCode !== "") {
          handleToolbarAction("cancel");
          setDate(getCurrentDate());
        } else {
          dateRef.current.focus();
        }
        break;
      case "refresh":
        LoadData();
        break;
      case "find":
        LoadFindData();
        break;
      default:
        break;
    }
  };

  const LoadFindData = async () => {
    const obj = {
      mode: "find",
      SearchCode: "",
      Date: date,
      UserName: "ABHISHEK",
      Debit: debit || 0,
      Credit: credit || 0,
      Comment: comment,
      ReasonCode: reason?.Code,
      CategoryCode: category?.Code,
      PayTypeCode: paytype?.Code,
    };
    const response = await axios.post(url, obj);
    if (response.data.success) {
      setFindData(response.data.data);
      setIsOpen(true);
    } else {
      Swal.fire({
        icon: "error",
        text: response.data.message || "Something went wrong!",
      });
    }
  };

  const handleDataSelection = async (item) => {
    setIsOpen(false);
    setSearchCode(item.Date);
    setDate(item.Date);
    setActiveButtons(["edit", "delete", "cancel"]);
    LoadGridData(item.Date);
  };

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

  const LoadGridData = async (filterDate) => {
    const obj = {
      mode: "datefind",
      SearchCode: "",
      Date: filterDate != undefined ? filterDate : date,
      UserName: "ABHISHEK",
      Debit: debit || 0,
      Credit: credit || 0,
      Comment: comment,
      ReasonCode: reason?.Code,
      CategoryCode: category?.Code,
      PayTypeCode: paytype?.Code,
    };
    const response = await axios.post(url, obj);
    if (response.data.success) {
      setGridData(response.data.data);
    } else {
      Swal.fire({
        icon: "error",
        text: response.data.message || "Something went wrong!",
      });
    }
  };

  const ClearValues = () => {
    setDebit("");
    setCredit("");
    setReason(null);
    setComment("");
    setCategory(null);
    setPayType(null);
  };

  const AddDatainGrid = async () => {
    if (!debit && !credit) {
      Swal.fire({
        icon: "warning",
        text: "Please enter either Debit or Credit amount.",
      });
      debitRef.current?.focus();
      return;
    }
    if (!reason) {
      setReasonError(true);
      reasonRef.current?.focus();
      return;
    }
    if (!category) {
      setCategoryError(true);
      categoryRef.current?.focus();
      return;
    }
    if (!paytype) {
      setPayTypeError(true);
      paytypeRef.current?.focus();
      return;
    }

    const obj = {
      mode: "add",
      SearchCode: "",
      Date: date,
      UserName: "ABHISHEK",
      Debit: debit || 0,
      Credit: credit || 0,
      Comment: comment,
      ReasonCode: reason?.Code,
      CategoryCode: category?.Code,
      PayTypeCode: paytype?.Code,
    };
    const response = await axios.post(url, obj);
    if (response.data.success) {
      ClearValues();
      LoadGridData();
      debitRef.current?.focus();
    } else {
      Swal.fire({
        icon: "error",
        text: response.data.message || "Something went wrong!",
      });
    }
    // const obj = {
    //   SNo: sno,
    //   debit,
    //   credit,
    //   reasonCode: reason?.Code,
    //   reasonName: reason?.Name,
    //   comment,
    //   categoryCode: category?.Code,
    //   categoryName: category?.Name,
    //   paytypeCode: paytype?.Code,
    //   paytypeName: paytype?.Name,
    // };
    // setGridData((prev) => [...prev, obj]);
    // setSno((prev) => prev + 1);
  };

  const DeleteDatainGrid = async (GridSearchCode) => {
    // setGridData((prev) => prev.filter((item) => item.SNo !== GridSearchCode));
    // debitRef.current.focus();
    const obj = {
      mode: "delete",
      SearchCode: GridSearchCode,
      Date: date,
      UserName: "ABHISHEK",
      Debit: debit || 0,
      Credit: credit || 0,
      Comment: comment,
      ReasonCode: reason?.Code,
      CategoryCode: category?.Code,
      PayTypeCode: paytype?.Code,
    };
    const response = await axios.post(url, obj);
    if (response.data.success) {
      LoadGridData();
      debitRef.current.focus();
    } else {
      Swal.fire({
        icon: "error",
        text: response.data.message || "Something went wrong!",
      });
    }
  };

  const FillDataFromGrid = (GridSearchCode) => {
    setEditSearchCode(GridSearchCode);
    const data = gridData.find((x) => x.Code === GridSearchCode);
    setDebit(data.Debit);
    setCredit(data.Credit);
    setReason({ Code: data.ReasonCode, Name: data.ReasonName });
    setComment(data.Comment);
    setCategory({ Code: data.CategoryCode, Name: data.CategoryName });
    setPayType({ Code: data.PaymentTypeCode, Name: data.PayTypeName });
    debitRef.current.focus();
  };

  const AddEditDatainGrid = async () => {
    // const updatedObj = {
    //   SNo: editSearchCode,
    //   debit,
    //   credit,
    //   reasonCode: reason.Code,
    //   reasonName: reason.Name,
    //   comment,
    //   categoryCode: category.Code,
    //   categoryName: category.Name,
    //   paytypeCode: paytype.Code,
    //   paytypeName: paytype.Name,
    // };
    // const UpdatedData = gridData.map((item) =>
    //   item.SNo === editSearchCode ? updatedObj : item,
    // );
    //setGridData(UpdatedData);
    const obj = {
      mode: "edit",
      SearchCode: editSearchCode,
      Date: date,
      UserName: "ABHISHEK",
      Debit: debit || 0,
      Credit: credit || 0,
      Comment: comment,
      ReasonCode: reason?.Code,
      CategoryCode: category?.Code,
      PayTypeCode: paytype?.Code,
    };
    const response = await axios.post(url, obj);
    if (response.data.success) {
      LoadGridData();
      setEditSearchCode(null);
      ClearValues();
      debitRef.current.focus();
    } else {
      Swal.fire({
        icon: "error",
        text: response.data.message || "Something went wrong!",
      });
    }
  };

  return (
    <div className="container-fluid mt-3">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-12">
              <TopControl
                enabledButtons={activeButtons}
                onAction={handleToolbarAction}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-3">
              <TextField
                label="Date"
                value={date || ""}
                onBlur={() => setDate(formattedDate(date))}
                onChange={(e) => setDate(e.target.value)}
                onKeyDown={(e) => handleNextFocus(e, debitRef)}
                inputRef={dateRef}
                disabled={disabled}
                size="small"
                variant="outlined"
                fullWidth
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <div className="row mb-3">
                <div className="col-md-3">
                  <div className="form-group">
                    <TextField
                      label="Debit"
                      value={debit || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d{0,2}$/.test(value)) {
                          setDebit(value);
                        }
                      }}
                      onBlur={() => {
                        if (debit !== "") {
                          setDebit(Number(debit).toFixed(2));
                        }
                      }}
                      inputRef={debitRef}
                      onKeyDown={(e) => handleNextFocus(e, creditRef)}
                      disabled={disabled}
                      size="small"
                      variant="outlined"
                      fullWidth
                      inputProps={{
                        style: { textAlign: "right" },
                        inputMode: "numeric",
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <TextField
                      label="Credit"
                      value={credit || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d{0,2}$/.test(value)) {
                          setCredit(value);
                        }
                      }}
                      onBlur={() => {
                        if (debit !== "") {
                          setDebit(Number(debit).toFixed(2));
                        }
                      }}
                      inputRef={creditRef}
                      onKeyDown={(e) => handleNextFocus(e, reasonRef)}
                      disabled={disabled}
                      size="small"
                      variant="outlined"
                      fullWidth
                      inputProps={{
                        style: { textAlign: "right" },
                        inputMode: "numeric",
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <Autocomplete
                      options={reasonArray}
                      value={reason}
                      disabled={disabled}
                      size="small"
                      getOptionLabel={(option) => option.Name}
                      isOptionEqualToValue={(option, value) =>
                        option.Code === value.Code
                      }
                      onChange={(event, newValue) => {
                        setReason(newValue);
                        if (newValue) {
                          setReasonError(false);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Reason"
                          error={reasonError}
                          helperText={reasonError ? "Reason is Required" : ""}
                          inputRef={reasonRef}
                          onKeyDown={(e) => handleNextFocus(e, categoryRef)}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="form-group">
                    <Autocomplete
                      options={categoryArray}
                      value={category}
                      disabled={disabled}
                      size="small"
                      getOptionLabel={(option) => option.Name}
                      isOptionEqualToValue={(option, value) =>
                        option.Code === value.Code
                      }
                      onChange={(event, newValue) => {
                        setCategory(newValue);
                        if (newValue) {
                          setCategoryError(false);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Category"
                          error={categoryError}
                          helperText={
                            categoryError ? "Category is Required" : ""
                          }
                          inputRef={categoryRef}
                          onKeyDown={(e) => handleNextFocus(e, paytypeRef)}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <Autocomplete
                      options={payTypeArray}
                      value={paytype}
                      disabled={disabled}
                      size="small"
                      getOptionLabel={(option) => option.Name}
                      isOptionEqualToValue={(option, value) =>
                        option.Code === value.Code
                      }
                      onChange={(event, newValue) => {
                        setPayType(newValue);
                        if (newValue) {
                          setPayTypeError(false);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Payment Type"
                          error={oayTypeError}
                          helperText={
                            oayTypeError ? "Pay Type is Required" : ""
                          }
                          inputRef={paytypeRef}
                          onKeyDown={(e) => handleNextFocus(e, commentRef)}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="Comment"
                      value={comment || ""}
                      onChange={(e) => setComment(e.target.value)}
                      inputRef={commentRef}
                      onKeyDown={(e) => handleNextFocus(e, addRef)}
                      disabled={disabled}
                      size="small"
                      variant="outlined"
                      fullWidth
                    />
                  </div>
                </div>
              </div>

              <div className="row justify-content-center">
                <div className="col-md-3">
                  <Button
                    variant="outlined"
                    ref={addRef}
                    onKeyDown={(e) =>
                      editSearchCode == null
                        ? handleNextFocus(e, debitRef, AddDatainGrid)
                        : handleNextFocus(e, debitRef, AddEditDatainGrid)
                    }
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div
                className="card-body table-responsive p-0"
                style={{ height: "300px" }}
              >
                <table className="table table-head-fixed text-nowrap">
                  <thead>
                    <tr>
                      <th style={{ width: "6%" }}>Edit</th>
                      <th style={{ width: "9%" }}>Delete</th>
                      <th style={{ width: "12%" }}>Debit</th>
                      <th style={{ width: "12%" }}>Credit</th>
                      <th style={{ width: "15%" }}>Reason</th>
                      <th style={{ width: "19%" }}>Comment</th>
                      <th style={{ width: "15%" }}>Category</th>
                      <th style={{ width: "12%" }}>Payment Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gridData &&
                      gridData.map((row, index) => (
                        <tr key={index}>
                          <td>
                            <button
                              type="button"
                              onClick={() => FillDataFromGrid(row.Code)}
                              className="btn btn-success"
                            >
                              Edit
                            </button>
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => DeleteDatainGrid(row.Code)}
                              className="btn btn-danger"
                            >
                              Delete
                            </button>
                          </td>
                          <td>{row.Debit}</td>
                          <td>{row.Credit}</td>
                          <td>{row.ReasonName}</td>
                          <td>{row.Comment}</td>
                          <td>{row.CategoryName}</td>
                          <td>{row.PayTypeName}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <Find
          data={findData}
          title="Account Entry"
          onClose={() => setIsOpen(false)}
          onSelect={handleDataSelection}
        />
      )}
    </div>
  );
}

export default AccountEntry;
