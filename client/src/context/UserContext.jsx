/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import api from "../configs/Api";
import { useAuth } from "./AuthContext";




const UserContext = createContext();


export const UserProvider = ({children}) => {
    const {auth} = useAuth();
    const [users,setUsers] = useState([]);
    const [loading,setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [totalUsers,setTotalUsers] = useState(0)
    const [totalPages,setTotalPages] = useState(0)
    const [currentPage,setCurrentPage] = useState(1)

    const getAllUsers = async ()=> {
        setLoading(true);
         const search = searchParams.get("search");
         const page = searchParams.get("page") || 1;
         const role = searchParams.get("role");
        try {
            const {data} = await api.get('/api/users', {
            params: {
                // If search is null, Axios omits it. 
                // We use || undefined to ensure empty strings are also omitted.
                search: search || undefined,
                page: page,
                role: role || undefined
            }
        });
            if(data.success){
                setUsers(data.users);
                setTotalUsers(data.totalUsers);
                setTotalPages(data.totalPages);
                setCurrentPage(data.currentPage);
                console.log(data.users);
            }
        
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=> {
        // 2. Extract the search query (e.g., "?search=amjad&page=1")
        getAllUsers();

    },[searchParams])
    return (
        <UserContext.Provider value={{loading,getAllUsers,users,setUsers,totalUsers,totalPages,currentPage,setCurrentPage}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = ()=> useContext(UserContext);