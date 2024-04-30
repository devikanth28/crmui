import axios from 'axios';
import { API_URL } from '../services/ServiceConstants';

const checkAndReturnReponse = (response) => {
    if (response?.status !== 200) {
        return new Promise((resolve) => {
            return resolve({ statusCode: 'CLIENT_ERROR', message: 'Something went wrong. Please try again!' });
        })
    }
    return response?.data;
}

axios.interceptors.response.use((response) => {
    if (response && response.data) {
        if (response.data.message === 'USER_NOT_LOGGED_IN') {
            window.location.reload();
        }
    }
    return response;
}, (err) => {
    console.log("Actual server Error:", err);
});

export const imageServerRequest = async (requestConfig, formData) => {

    let requestUrl = `${API_URL}${requestConfig.url}`;

    return axios.post(requestUrl, formData).then((response) => {
        return checkAndReturnReponse(response);
    }).catch(err => {
        if (err.message === "Network Error" || err.code === `ECONNABORTED`) {
            return new Promise((resolve) => {
                return resolve({ statusCode: "404", message: "Network Error" });
            })
        } else if (err && err.response && err.response.status === 400) {
            return new Promise((resolve) => {
                return resolve({ statusCode: "404", message: "Network Error" });
            })
        }
        else {
            return new Promise((resolve, reject) => {
                return reject(err);
            });
        }
    });
}

export const serverRequest = async (requestConfig, extraConfig) => {
    const params = extraConfig.params;
    let finalConfig = {};
    finalConfig['baseURL'] = API_URL;

    Object.entries(requestConfig).map(([key, value]) => {
        if (extraConfig[key] && typeof extraConfig[key] == 'object') {
            finalConfig[key] = { ...value, ...extraConfig[key] };
        }
        else {
            finalConfig[key] = value;
        }
    })
    finalConfig = { ...extraConfig, ...finalConfig };
    //processing params data and setting to data variable

    if (finalConfig && finalConfig.headers) {
        finalConfig.headers.relativeUrl = finalConfig.url;
    }
    else {
        finalConfig.headers = {};
        finalConfig.headers.relativeUrl = finalConfig.url;
    }
    finalConfig.headers['X-Requested-With'] = 'XMLHttpRequest';
    finalConfig.headers['User-Agent'] = `${navigator.userAgent} Crm`;

    if (finalConfig.endPoint) {
        finalConfig.url = finalConfig.endPoint + finalConfig.url;
    }

    return axios(finalConfig).then((response) => {
        return checkAndReturnReponse(response);
    }).catch(err => {
        if (err.message === "Network Error" || err.code === `ECONNABORTED`) {
            return new Promise((resolve) => {
                return resolve({ statusCode: "404", message: "Network Error" });
            })
        } else if (err && err.response && err.response.status === 400) {
            return new Promise((resolve) => {
                return resolve({ statusCode: "404", message: "Network Error" });
            })
        }
        else {
            return new Promise((resolve, reject) => {
                return reject(err);
            });
        }
    });
}

export const uploadFilesToServer = (url, filesFormData, requestConfig) => {
    return axios.post(url, filesFormData, requestConfig).then((response) => {
        if (response.status !== 200) {
            return new Promise((resolve) => {
                return resolve({ statusCode: 'CLIENT_ERROR', message: 'Something went wrong. Please try again!' });
            })
        }
        return response.data;
    }).catch(err => {
        return new Promise((resolve, reject) => {
            return resolve({ statusCode: 'CLIENT_ERROR', message: err.response.data.message });
        });
    });
}

export const getFileOrObjectFromServer = async (requestConfig, formData) => {
    try {
        const response = await axios({
          method: requestConfig.method,
          url: `${API_URL}${requestConfig.url}`,
          headers: { 'Content-Type': requestConfig.contentType, 'X-Requested-With': 'XMLHttpRequest' },
          data: formData,
          responseType: requestConfig.responseType
        });
    
        if (!response || response.status !== 200) {
          return new Promise.reject('Something went wrong. Please try again!');
        }
        const contentType = response.headers['content-type'];
        if (contentType === 'application/ms-excel') {
          return response;
        }
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onload = () => {
            const jsonResponse = JSON.parse(reader.result);
            response.data = jsonResponse;
            resolve(response.data);
          };
          reader.onerror = (error) => {
            console.error("Error reading JSON:", error);
            reject('Something went wrong. Please try again!');
          };
          reader.readAsText(response.data);
        });  
      } catch (error) {
        return new Promise((resolve, reject) => {
            return resolve({ statusCode: 'FAILURE', message: err.message });
        });
      }
}