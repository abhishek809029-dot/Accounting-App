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

function AccountEntry() {
  const [activeButtons, setActiveButtons] = useState(["add", "find"]);
  const [name, setName] = useState("");
  const nameRef = useRef(null);
  const [date, setDate] = useState(getCurrentDate());
  const dateRef = useRef(null);
  const [debit, setDebit] = useState("");
  const debitRef = useRef(null);
  const [credit, setCredit] = useState("");
  const creditRef = useRef(null);
  const [reason, setReason] = useState(null);
  const reasonRef = useRef(null);
  const [comment, setComment] = useState("");
  const commentRef = useRef(null);
  const [category, setCategory] = useState(null);
  const categoryRef = useRef(null);
  const [paytype, setPayType] = useState(null);
  const paytypeRef = useRef(null);
  const addRef = useRef(null);
  const [editSearchCode, setEditSearchCode] = useState(null);
  const [sno, setSno] = useState(1);
  const [searchCode, setSearchCode] = useState("");
  const [reasonArray, setReasonArray] = useState([]);
  const [categoryArray, setCategoryArray] = useState([]);
  const [payTypeArray, setPayTypeArray] = useState([]);
  const [findData, setFindData] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const url = "/AccountsAPI/Accounts/CategoryMaster";
  const FetchDataUrl = "/AccountsAPI/Accounts/FetchAccountEntryData";

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
  }, [activeButtons, name, searchCode]);

  const handleToolbarAction = (id) => {
    if (id === "add" || id === "edit") {
      setDisabled(false);
      setTimeout(() => {
        dateRef.current?.focus();
      }, 0);
      setActiveButtons(["save", "refresh", "cancel"]);
    } else if (id === "cancel") {
      setName("");
      setSearchCode("");
      setDisabled(true);
      setActiveButtons(["add", "find"]);
    } else {
      handleCategoryMast(id);
    }
  };

  const handleDataSelection = (item) => {
    setIsOpen(false);
    setSearchCode(item.Code);
    setName(item.Name);
    setActiveButtons(["edit", "delete", "cancel"]);
  };

  const handleCategoryMast = async (mode) => {
    try {
      if (mode === "save" && name === "") {
        Swal.fire({
          icon: "warning",
          text: "Category Name is Required ...",
        });
        return false;
      }
      const obj = {
        mode: mode,
        SearchCode: searchCode,
        Name: name,
        UserName: "ABHISHEK",
      };
      const response = await axios.post(url, obj);
      if (response.data.success) {
        switch (mode) {
          case "find":
            setFindData(response.data.data);
            setIsOpen(true);
            break;
          case "save":
            if (searchCode === "") {
              setName("");
              setTimeout(() => {
                nameRef.current?.focus();
              }, 0);
            } else {
              setName("");
              setSearchCode("");
              setDisabled(true);
              setActiveButtons(["add", "find"]);
            }
            break;
          case "delete":
            setName("");
            setSearchCode("");
            setActiveButtons(["add", "find"]);
            break;
          default:
            setName("");
            setDisabled(true);
            setActiveButtons(["add", "find"]);
            break;
        }
      } else {
        Swal.fire({
          icon: "error",
          text: response.data.message || "Something went wrong!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error || "Something went wrong!",
      });
    }
  };

  const LoadData = async (mode) => {
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

  const ClearValues = () => {
    setDebit("");
    setCredit("");
    setReason(null);
    setComment("");
    setCategory(null);
    setPayType(null);
  };

  const handleDatainGrid = (mode, GridSearchCode) => {
    debugger;
    const SNo = mode === "add" ? sno : GridSearchCode;
    const obj = {
      SNo,
      debit,
      credit,
      reasonCode: reason.Code,
      reasonName: reason.Name,
      comment,
      categoryCode: category.Code,
      categoryName: category.Name,
      paytypeCode: paytype.Code,
      paytypeName: paytype.Name,
    };
    switch (mode) {
      case "add":
        setGridData((prev) => [...prev, obj]);
        setSno((prev) => prev + 1);
        ClearValues();
        debitRef.current?.focus();
        break;

      case "delete":
        setGridData((prev) =>
          prev.filter((item) => item.SNo !== GridSearchCode),
        );
        break;

      case "edit":
        const data = gridData.find((x) => x.SNo === GridSearchCode);
        setDebit(data.debit);
        setCredit(data.credit);
        setReason({ Code: data.reasonCode, Name: data.reasonName });
        setComment(data.comment);
        setCategory({ Code: data.categoryCode, Name: data.categoryName });
        setPayType({ Code: data.paytypeCode, Name: data.paytypeName });
        // setGridData((prev) =>
        //   prev.map((item) => (item.SNo === sno ? { ...item, ...obj } : item)),
        // );
        break;

      default:
        break;
    }
  };

  const AddDatainGrid = () => {
    const obj = {
      SNo: sno,
      debit,
      credit,
      reasonCode: reason.Code,
      reasonName: reason.Name,
      comment,
      categoryCode: category.Code,
      categoryName: category.Name,
      paytypeCode: paytype.Code,
      paytypeName: paytype.Name,
    };
    setGridData((prev) => [...prev, obj]);
    setSno((prev) => prev + 1);
    ClearValues();
    debitRef.current?.focus();
  };

  const DeleteDatainGrid = (GridSno) => {
    setGridData((prev) => prev.filter((item) => item.SNo !== GridSno));
  };

  const FillDataFromGrid = (GridSno) => {
    setEditSearchCode(GridSno);
    const data = gridData.find((x) => x.SNo === GridSno);
    setDebit(data.debit);
    setCredit(data.credit);
    setReason({ Code: data.reasonCode, Name: data.reasonName });
    setComment(data.comment);
    setCategory({ Code: data.categoryCode, Name: data.categoryName });
    setPayType({ Code: data.paytypeCode, Name: data.paytypeName });
  };

  const AddEditDatainGrid = () => {
    setGridData((prev) => {
      const updatedObj = {
        SNo: editSearchCode,
        debit,
        credit,
        reasonCode: reason.Code,
        reasonName: reason.Name,
        comment,
        categoryCode: category.Code,
        categoryName: category.Name,
        paytypeCode: paytype.Code,
        paytypeName: paytype.Name,
      };

      //setEditSearchCode(null);

      // if (index !== -1) {
      return prev.map((item) =>
        item.SNo === editSearchCode ? updatedObj : item,
      );
      //}

      //return [...prev, updatedObj];
    });
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
                      onChange={(e) => setDebit(e.target.value)}
                      inputRef={debitRef}
                      onKeyDown={(e) => handleNextFocus(e, creditRef)}
                      disabled={disabled}
                      size="small"
                      variant="outlined"
                      fullWidth
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <TextField
                      label="Credit"
                      value={credit || ""}
                      onChange={(e) => setCredit(e.target.value)}
                      inputRef={creditRef}
                      onKeyDown={(e) => handleNextFocus(e, reasonRef)}
                      disabled={disabled}
                      size="small"
                      variant="outlined"
                      fullWidth
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
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Reason"
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
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Category"
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
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Payment Type"
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
                              onClick={() => FillDataFromGrid(row.SNo)}
                              className="btn btn-success"
                            >
                              Edit
                            </button>
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => DeleteDatainGrid(row.SNo)}
                              className="btn btn-danger"
                            >
                              Delete
                            </button>
                          </td>
                          <td>{row.debit}</td>
                          <td>{row.credit}</td>
                          <td>{row.reasonName}</td>
                          <td>{row.comment}</td>
                          <td>{row.categoryName}</td>
                          <td>{row.paytypeName}</td>
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
          title="Category Master"
          onClose={() => setIsOpen(false)}
          onSelect={handleDataSelection}
        />
      )}
    </div>
  );
}

export default AccountEntry;
