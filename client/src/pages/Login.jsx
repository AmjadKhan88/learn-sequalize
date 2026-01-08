import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { User } from "lucide-react";
import toast from "react-hot-toast";
import api from "../configs/Api";


export default function Login() {
    const {auth,setAuth} = useAuth();
    const [show,setShow] = useState(false);
    const [state,setState] = useState(false);
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [submiting,setSubmiting] = useState(false);
    const [errors,setErrors] = useState({});


    if(auth) return <Navigate to='/'/>;

    const submitHandler = async (e) => {
        e.preventDefault();
        setSubmiting(true);
        try {
            const url = state ? "/api/auth/signup" : "/api/auth/login";
            const {data} = await api.post(url,{
                name,
                email,
                password
            });

            if(data.success) {
                toast.success(data.message);
                setAuth(data.user)
                return <Navigate to='/'/>;
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || error.message)
            setErrors(error?.response?.data?.error)
        } finally {
            setSubmiting(false);
        }
    }

    return (
        <div className="flex h-[100vh] bg-linear-to-r from-slate-100 to-indigo-100 mx-auto ">
            
        
            <div className="w-full flex flex-col items-center justify-center">
                
                <form onSubmit={submitHandler} className="md:w-96 w-80 flex flex-col items-center justify-center p-5 rounded-md bg-white/30">
                    <h2 className="text-4xl text-gray-900 font-medium">{state ? "Sign in" : "Login" }</h2>
                    <p className="text-sm text-gray-500/90 mt-3 mb-5">Welcome {!state && "back!"} Please {state ? "sign in" : "login"} to continue</p>
        
                   {state && <> <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <User width={16} className="text-[#6B7280]" />
                        <input type="text" placeholder="Name" value={name} onChange={e=> setName(e.target.value)} className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full" required/>                 
                    </div>
                    {errors?.name && <p className="text-red-500 text-xs ms-10 text-left w-full">{errors.name}</p>}
                    </>
                    }

                    <div className="flex items-center w-full mt-6 bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#6B7280"/>
                        </svg>
                        <input type="email" placeholder="Email id" value={email} onChange={e=> setEmail(e.target.value)}  className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full" required/>                                     
                    </div>
                    {errors?.email && <p className="text-red-500 text-xs ms-10 text-left w-full">{errors.email}</p>}

        
                    <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#6B7280"/>
                        </svg>
                        <input type={`${!show ? "password":"text"}`} value={password} onChange={e=> setPassword(e.target.value)}  placeholder="Password" className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full" required/>
                    </div>
                    {errors?.password && <p className="text-red-500 text-xs ms-10 text-left w-full">{errors.password}</p>}

                    <div className="w-full flex items-center justify-between mt-8 text-gray-500/80">
                        <div className="flex items-center gap-2">
                            <input className="h-5" type="checkbox" onChange={()=>setShow(prev=> !prev)} id="checkbox" />
                            <label className="text-sm" htmlFor="checkbox" >Show password</label>
                        </div>
                       {!state && <a className="text-sm underline" href="#">Forgot password?</a>}
                    </div>
        
                    <button type="submit" disabled={submiting} className="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity">
                      {submiting ? "Loading..." : state ? "Sign in" : "Login"}
                    </button>
                    <p className="text-gray-500/90 text-sm mt-4">{state ? "Already":"Don’t"} have an account? <a className="text-indigo-400 hover:underline cursor-pointer" onClick={()=> setState(prev=> !prev)}>{state ? "Login" : "Sign up"}</a></p>
                </form>
            </div>
        </div>
    );
};