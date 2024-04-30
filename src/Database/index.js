class Database {

    setValue(key, value) {
        if(key === undefined || key === 'undefined'){
            return;
        }
        if(typeof localStorage !== 'undefined'){
            localStorage.setItem(key, value);
        }
    }

    getValue(key) {
        if(key === undefined || key === 'undefined'){
            return;
        }
        if(typeof localStorage !== 'undefined'){
            return localStorage.getItem(key);
        }
    }

    removeValue(key){
        if(key === undefined || key === 'undefined'){
            return;
        }
        if(typeof localStorage !== 'undefined'){
            return localStorage.removeItem(key);
        }
    }

    setObject(key, obj) {
        if(key === undefined || key === 'undefined'){
            return;
        }
        if(typeof localStorage !== 'undefined'){
            localStorage.setItem(key, JSON.stringify(obj));
        }
    }

    getObject(key) {
        if(key === undefined || key === 'undefined'){
            return;
        }
        if(typeof localStorage !== 'undefined'){
            try{
                return JSON.parse(localStorage.getItem(key));
            }catch(error){
                console.log(error);
            }
        }
    }
}

export default new Database();