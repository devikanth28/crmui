import Validate from './Validate';
import dateFormat from 'dateformat';

export default function DateValidator() {
    const validateDay = (day, monthOld, year)=>{
        const validate = Validate();
        if (day.includes('_')) {
            return false;
        }
        let month = validate.isNotEmpty(monthOld) ? parseInt(monthOld) : 0;
        if(parseInt(day) <= 0){
            return false;
        }else if (([1,3,5,7,8,10,12].indexOf(month) !==-1 && parseInt(day) > 31)) {
            return false;
        }else if (2==month && ((year%4==0 && parseInt(day) > 29) || (year%4!==0 && parseInt(day) > 28))) {
            return false;
        }else if([4,6,9,11].indexOf(month) !==-1 && parseInt(day) > 30){
            return false;
        }
        return true;
    }       
    return {
        validateDate : (date, customer)=>{
            const validate = Validate();
            if (validate.isEmpty(date) || date.includes("_")){
                return "Invalid date"; 
            }
            let day_month_year = date.split(date.indexOf("/") == -1 ? "-" : "/")
            if (day_month_year == '') {
                return 'Please provide date in format of (DD/MM/YYYY)'
            }
            if (day_month_year[0].length == 4) {
                day_month_year = day_month_year.reverse();
            }
            let day = day_month_year[0];
            let month = day_month_year[1];
            let year = day_month_year[2];
            if(!validateDay(day,month, year)){
                return 'Please provide a valid date';
            }
            if (validate.isEmpty(month) && month.includes('_')) {
                return 'Please provide a valid month';
            }
            if (parseInt(month) > 12 || parseInt(month) <= 0) {
                return 'Please provide a valid month'
            }
            if( day_month_year.length <1){
                return 'Please provide a valid month'
            }
            if (day_month_year.length < 3) {
                return 'Please provide a valid year'
            }
            if (DateValidator().getDateDifference(date).years >= 100) {
                return 'Age should be less than 100 years'
            }
          /*  let yearErrorMsg = validate.yearOfBirth(year);
            if(validate.isNotEmpty(yearErrorMsg)){
                return yearErrorMsg;
            } */

            let errorMsg = validate.ageWithDob(date, customer);
            if(validate.isNotEmpty(errorMsg))
                return errorMsg;

            let enteredDate = new Date(`${date.split("/")[2]}-${date.split("/")[1]}-${date.split("/")[0]}`);
            if (isNaN(enteredDate)) {
                return "Invalid date";
            }
            let currentDate = new Date();
            currentDate.setHours(0, 0, 0, 1);
            enteredDate.setHours(0, 0, 0, 0);
            if(currentDate <= enteredDate){
                return "Invalid date";
            }
            return undefined; 
        },
        getDateFormat: (dateObject) => {
            try{
                let date= new Date(dateObject);
                let day = date.getDate();
                let month = date.getMonth()+1;
                if(day <= 9){
                    day= `0${day}`
                }
                if(month <= 9){
                    month= `0${month}`
                }
                return day + "/"+ month + "/" + date.getFullYear();
            }catch(err){
                console.log(err);
            }
        },
        getDateObject : (date)=>{
            let dateObject = new Date(`${date.split("/")[2]}-${date.split("/")[1]}-${date.split("/")[0]}`);
            return dateFormat(dateObject,"yyyy-mm-dd");
        },
        getDateDifference(dateString) {
        	if (dateString.includes("_")) {
                return { "years" : 0};
            }
            var now = new Date();
            if ((dateString.split(dateString.indexOf("/") == -1 ? "-" : "/").length == 3) && (dateString.split(dateString.indexOf("/") == -1 ? "-" : "/")[2].length == 4)) {
                dateString = DateValidator().flipYearsAndDays(dateString);
            }
            var yearNow = now.getYear();
            var monthNow = now.getMonth();
            var dateNow = now.getDate();

            var dob = new Date(dateString);
            var yearDob = dob.getYear();
            var monthDob = dob.getMonth();
            var dateDob = dob.getDate();
            var yearAge = yearNow - yearDob;
            if (monthNow >= monthDob)
                var monthAge = monthNow - monthDob;
            else {
                yearAge--;
                var monthAge = 12 + monthNow - monthDob;
            }

            if (dateNow >= dateDob)
                var days = dateNow - dateDob;
            else {
                monthAge--;
                const month_days31 = [1,3,5,7,8,10,12];
                const month_days30 = [4,6,9,11];
                var days = (![3].includes(monthNow+1) && month_days31.includes(monthNow+1)) ?  (30 + dateNow - dateDob) : month_days30.includes(monthNow+1) ? (31 + dateNow - dateDob) : yearNow % 4 == 0 && monthNow+1 == 3 ? (29 + dateNow - dateDob)  : (28 + dateNow - dateDob);  

                if (monthAge < 0) {
                    monthAge = 11;
                    yearAge--;
                }
            }
            return { "years": yearAge, "months": monthAge, "days": days };
        },
        getDisplayableFormat(date) {
            if (Validate().isEmpty(date)) {
                return ""
            }
            let tempDate = date.split(date.indexOf("/") == -1 ? "-" : "/");
            if (tempDate[0].length == 4) {
                let tempYear = tempDate[0];
                tempDate[0] = tempDate[2];
                tempDate[2] = tempYear;
            }
            return tempDate.join("/");
        },
        flipYearsAndDays(date) {
            if ((date.split(date.indexOf("/") == -1 ? "-" : "/").length == 3) && (date.split(date.indexOf("/") == -1 ? "-" : "/")[2].length == 4)) {
                return `${date.split(date.indexOf("/") == -1 ? "-" : "/")[2]}-${date.split(date.indexOf("/") == -1 ? "-" : "/")[1]}-${date.split(date.indexOf("/") == -1 ? "-" : "/")[0]}`
            }
            return date;
        }
    }
}
