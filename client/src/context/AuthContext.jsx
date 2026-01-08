/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import {createContext, useContext, useEffect, useState} from 'react'
import toast from 'react-hot-toast';
import api from "../configs/Api"


const AuthContext = createContext();




export const AuthProvider = ({children})=> {
    const [auth,setAuth] = useState(null);
    const [loading,setLoading] = useState(true);


    useEffect(()=> {
        const checkAuth = async ()=> {
            setLoading(true)
            try {
                const {data} = await api.get('/api/auth');
                if(data.success){
                    setAuth(data.user);
                }else {
                    toast.error(data.message)
                }
            } catch (error) {
                console.log(error)
                toast.error(error?.response?.data?.message || error.message)
                setAuth(null)
            } finally {
                setLoading(false)
            }
        }
        checkAuth();
    },[])
    return (
        <AuthContext.Provider value={{auth,setAuth,loading}}>
            {children}
        </AuthContext.Provider>
    
    )

}

export const useAuth = ()=> useContext(AuthContext);