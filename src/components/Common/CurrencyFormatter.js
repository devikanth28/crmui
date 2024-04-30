import Validate from "../../helpers/Validate";

const CurrencyFormatter = (props) => {

    const { data, decimalPlaces } = props;
    let amount = "";
    const validate = Validate();

    if(validate.isNotEmpty(data) && !isNaN(data)){
        let formatterObject = {style: 'currency', currency: 'INR'};        

        if(!validate.isNotEmpty(decimalPlaces)){
            formatterObject = {...formatterObject, minimumFractionDigits: 2, maximumFractionDigits: 2};
        }
        else if(decimalPlaces >= 0 && decimalPlaces <= 20){
            formatterObject = {...formatterObject, minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces};
        }
        else{   //To Show the number as it is without rounding off or appending zeroes 
            if(Number.isInteger(Number(data))){                  //If number is integer
                formatterObject = {...formatterObject, minimumFractionDigits: 0, maximumFractionDigits: 0};
            }
            else if(Number.isInteger(Number(data) * 10)){      //If number has only one decimal place
                formatterObject = {...formatterObject, minimumFractionDigits: 1, maximumFractionDigits: 1};
            }
            else{
                formatterObject = {...formatterObject, maximumFractionDigits: 20};
            }
        }
    
        amount = new Intl.NumberFormat('en-IN', formatterObject).format(data);
    }
    else{
        amount = "-";
    }
    
    return amount;
}

export default CurrencyFormatter;