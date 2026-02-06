export const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = today.toLocaleString("en-GB", { month: "short" });
  const year = today.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};

export const handleNextFocus = (e, nextRef, action) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (nextRef && nextRef.current && action) {
      nextRef.current.focus();
      action();
    } else {
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  }
};

export const formattedDate = (inputDate) => {
  if (!inputDate || inputDate.trim() === "") return "";

  let Txt1 = inputDate.trim();
  let mDay = 0,
    mMonth = "",
    mYear = 0;

  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.toLocaleString("default", { month: "short" });
  const currentYear = now.getFullYear();

  if (!isNaN(Txt1) && Txt1.length <= 2) {
    mDay = parseInt(Txt1, 10);
    mMonth = currentMonth;
    mYear = currentYear;
  } else {
    let separator = ["/", "-", "."].find((sep) => Txt1.includes(sep));
    if (separator) {
      let parts = Txt1.split(separator);
      mDay = parseInt(parts[0], 10);
      mMonth = parts[1] ? parts[1].trim() : "";
      if (parts[2]) {
        mYear = parseInt(parts[2], 10);
        if (mYear < 100) {
          mYear += 2000;
        }
      }
    } else {
      if (isNaN(Txt1)) {
        mMonth = Txt1;
      } else {
        mDay = parseInt(Txt1, 10);
      }
    }
  }

  if (!mYear || isNaN(mYear)) {
    mYear = currentYear;
  }

  const monthMap = {
    1: "Jan",
    "01": "Jan",
    J: "Jan",
    JA: "Jan",
    JAN: "Jan",
    2: "Feb",
    "02": "Feb",
    F: "Feb",
    FE: "Feb",
    FEB: "Feb",
    3: "Mar",
    "03": "Mar",
    M: "Mar",
    MA: "Mar",
    MAR: "Mar",
    4: "Apr",
    "04": "Apr",
    A: "Apr",
    AP: "Apr",
    APR: "Apr",
    5: "May",
    "05": "May",
    MAY: "May",
    6: "Jun",
    "06": "Jun",
    JU: "Jun",
    JUN: "Jun",
    7: "Jul",
    "07": "Jul",
    JUL: "Jul",
    8: "Aug",
    "08": "Aug",
    AU: "Aug",
    AUG: "Aug",
    9: "Sep",
    "09": "Sep",
    S: "Sep",
    SE: "Sep",
    SEP: "Sep",
    10: "Oct",
    O: "Oct",
    OC: "Oct",
    OCT: "Oct",
    11: "Nov",
    N: "Nov",
    NO: "Nov",
    NOV: "Nov",
    12: "Dec",
    D: "Dec",
    DE: "Dec",
    DEC: "Dec",
  };

  const normalizedMonth = monthMap[(mMonth || "").toUpperCase()];
  if (!normalizedMonth) {
    mDay = currentDay;
    mMonth = currentMonth;
    mYear = currentYear;
  } else {
    mMonth = normalizedMonth;
  }

  const daysInMonth = {
    Jan: 31,
    Feb: mYear % 4 === 0 ? 29 : 28,
    Mar: 31,
    Apr: 30,
    May: 31,
    Jun: 30,
    Jul: 31,
    Aug: 31,
    Sep: 30,
    Oct: 31,
    Nov: 30,
    Dec: 31,
  };

  if (mDay < 1 || mDay > daysInMonth[mMonth]) {
    mDay = currentDay;
  }

  return `${String(mDay).padStart(2, "0")}/${mMonth}/${mYear}`;
};
