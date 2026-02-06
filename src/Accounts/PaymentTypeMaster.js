import React, { useState, useRef, useEffect } from "react";
import TopControl from "../GlobalJS/TopControl";
import TextField from "@mui/material/TextField";
import Find from "../GlobalJS/Find";
import axios from "axios";
import Swal from "sweetalert2";

function PaymentTypeMaster() {
  const [activeButtons, setActiveButtons] = useState(["add", "find"]);
  const [name, setName] = useState("");
  const nameRef = useRef(null);
  const [searchCode, setSearchCode] = useState("");
  const [findData, setFindData] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const url = "/AccountsAPI/Accounts/PaymentTypeMaster";

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
        nameRef.current?.focus();
      }, 0);
      setActiveButtons(["save", "refresh", "cancel"]);
    } else if (id === "cancel") {
      setName("");
      setSearchCode("");
      setDisabled(true);
      setActiveButtons(["add", "find"]);
    } else {
      handlePaymentTypeMast(id);
    }
  };

  const handleDataSelection = (item) => {
    setIsOpen(false);
    setSearchCode(item.Code);
    setName(item.Name);
    setActiveButtons(["edit", "delete", "cancel"]);
  };

  const handlePaymentTypeMast = async (mode) => {
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
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="form-group">
                <TextField
                  id="categoryname"
                  label="Payment Type Name"
                  value={name || ""}
                  onChange={(e) => setName(e.target.value)}
                  disabled={disabled}
                  inputRef={nameRef}
                  size="small"
                  variant="outlined"
                  fullWidth
                />
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

export default PaymentTypeMaster;
