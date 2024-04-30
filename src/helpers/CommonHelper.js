import Validate from "./Validate";

export const downloadFileInBrowser = (response,fileName) => {
    const fileURL = URL.createObjectURL(response);
    const link = document.createElement('a');
    link.href = fileURL;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href)
}

export const getGenderString = (value) => {
    switch (value) {
        case "M": return "Male";
        case "F": return "Female";
        case "O": return "Others";
        default: return "";
    }
}

export const toCamelCase = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export const getAge = (dateOfBirth) => {
    if(Validate().isEmpty(dateOfBirth)){
        return undefined;
    }
    let age = undefined;
    let today = new Date();
    let birthDate = new Date(dateOfBirth);
    let yearDiff = today.getFullYear() - birthDate.getFullYear();
    let monthDiff = today.getMonth() - birthDate.getMonth();
    let dateDiff = today.getDate() - birthDate.getDate();

    if (yearDiff > 0) {
      if (monthDiff < 0) {
        age = yearDiff - 1
      } else {
        age = yearDiff
      }
    } else if (yearDiff === 0 && monthDiff > 0) {
      age = yearDiff;
    } else if (yearDiff === 0 && monthDiff === 0 && dateDiff >= 0) {
      age = yearDiff;
    } else {
      age = undefined;
    }


    if (age < 0 || age === undefined) {
      return undefined
    } else {
       return age;
    }
}

export const getDObByAge = (age) => {
  const today = new Date();
  const year = today.getFullYear() - age;
  const month = today.getMonth();
  const day = today.getDate();
  return new Date(year, month, day);
}

export const openFileInNewTab = (response,fileName) => {
  const fileURL = URL.createObjectURL(response);
  const pdfWindow = window.open();
  pdfWindow.location.href= fileURL;
}

export const capitalizeFirstLetter = (string) => {
  if (!string) {
    return;
  }
  const words = string.split(" ");

  return words.map((word) => {
    return word[0].toUpperCase() + word.substring(1);
  }).join(" ");
}
export const isResponseSuccess = (response) => {
  return response && response.statusCode && "SUCCESS" == response.statusCode.toUpperCase();
}
export const flattenColumnsList = (columns) => {

        return columns.flatMap((element) => {
        if (element.isGroup) {
            if (element.childColumns && element.childColumns.length > 0) {
            return [...flattenColumnsList(element.childColumns)];
        }
        return [];
      }

      return element;

    });

  }

export const calculateAgeWithMonthsandDays = (birthDate) => {
  birthDate = new Date(birthDate);
  let currentDate = new Date();

  let years = currentDate.getFullYear() - birthDate.getFullYear();
  let months = currentDate.getMonth() - birthDate.getMonth();
  let days = currentDate.getDate()-birthDate.getDate();
  
  if (days < 0) {
      months--;
      days += new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
  }

  if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
  }

  if (days >= 30) {
      months++;
      days = 0;
  }

  return {
      years: years==0?null:years,
      months: months,
      days:days
  };
}

export const fullDateTime = {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
};