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
