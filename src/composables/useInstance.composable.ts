import axios from "axios";


export function useAxiosInstance() {

    const setBackendInstanceUnAuth = () => {
        return axios.create({
          baseURL : import.meta.env.VITE_BACK_END_URI,
          withCredentials:true
        });
    }
    const setBackendInstanceAuth = () => {
      return axios.create({
        baseURL : import.meta.env.VITE_BACK_END_URI,
        withCredentials:true,
      });

  }
    const setCustomInstance =(uri:string) => {
      return axios.create({
        baseURL : uri
      });
    }


    return { setBackendInstanceUnAuth,setBackendInstanceAuth, setCustomInstance}
}
//OLD CREDENTIALS
// VITE_CLIENT_ID=63d28218cf6c955cc75f458c
// VITE_CLIENT_SECRET=6bzk9trfo4y8rx32qmkkmai10hkte9agnks9qg0phr9wgsoe9g
//VITE_REDIRECT_URI=http://127.0.0.1:5132/auth
//VITE_BACK_END_URI = http://localhost:5301/api

//NEW CREDENTIALS DHLWSEIS 6 APP\
// VITE_BASE_URI=http://localhost:5132/
// VITE_REDIRECT_URI=http://localhost:5132/auth
// VITE_BACK_END_URI = http://localhost:5301/api
// VITE_CLIENT_SECRET=0o603mdj68ppdziwfcmhbh73v8rr7tfs3874q57no64h4yra89
// VITE_CLIENT_ID=63da7a8d7cf7bb02d67317e5