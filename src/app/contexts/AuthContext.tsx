"use client"
import axios from "axios";
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface authContextType {
    Login: (email: string, password: string) => Promise<boolean>
    SignUp: (name:string, email:string, password:string) => Promise<boolean>
    signUpError: string | null
    logInError: string | null
    setSignUpError : (error:string | null) => void
    setLogInError : (error: string | null) => void
    setUserName : (username: string | null) => void
    userName: string | null
    loading: boolean
    setLoading:  (loading:boolean) => void
    logOut: () => void
}

export const AuthContext = createContext<authContextType | undefined>(undefined)


export const AuthProvider = ({children}: {children:ReactNode}) => {
    const[userName, setUserName] = useState<string| null>(null)
    const [signUpError, setSignUpError] = useState<string | null>(null)
    const [logInError, setLogInError] = useState<string | null>(null)
    const[loading, setLoading] = useState<boolean>(false)

    
   useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUserName(savedUsername);
    }
  }, []);

  const logOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("regToken");
    localStorage.removeItem("username");
    setUserName('')
    console.log("all authentications and user info cleared");
    
  };

    const SignUp =  async(username:string, email:string, password:string)=> {
        setLoading(true)
        setSignUpError(null) 
        if(!username.trim()) {
            setLoading(false)
            setSignUpError('username field cannot be empty')
        }
        if(!email.includes('@') || !email.includes('.')) {
            setLoading(false)
            setSignUpError('provide valid email address')
        }
        if(password.length < 8) {
            setLoading(false)
            setSignUpError('password length is too short')
        }
        try {
            const url = process.env.NEXT_PUBLIC_TASKMANAGER_URL
            const config = {
                headers: {
                    'Content-Type':'application/json'
                }
            }
            const body = {username, email, password}
            const response = await axios.post(`${url}/api/v1/auth/register`, body, config)
            const data = response.data
            const{token} = data
            localStorage.setItem('regToken', token)
            console.log('sign up successful:', data)
            return true;

        } catch (error:any) {
            console.error(error)
            let errorMessage:string
            if(error.code === 'ERR_INTERNET_DISCONNECTED') {
                errorMessage ='Failed to connect with sever, check internet connection!!'
            }else if (error.response && error.response.status === 404) {
                errorMessage='something went wrong, try later !!'
            }else if (error.response && error.response.data.msg) {
                errorMessage = error.response.data.msg
            } else {
                errorMessage = 'Registration Failed, please try later'
            }
            setSignUpError(errorMessage)
            return false;
            
        }finally {
            setLoading(false)
        }

    }

    const Login = async(email:string, password:string) => {
         setLoading(true)
        setSignUpError(null) 
        if(!email.includes('@') || !email.includes('.')) {
            setLoading(false)
            setSignUpError('provide valid email address')
        }
        if(password.length < 8) {
            setLoading(false)
            setSignUpError('password length is too short')
        }
        try {
            const url = process.env.NEXT_PUBLIC_TASKMANAGER_URL
            const config = {
                headers: {
                    'Content-Type':'application/json',
                }
            }
            const body = {email, password}
            const response = await axios.post(`${url}/api/v1/auth/login`, body, config)
            const data = response.data
            const{token} = data
            localStorage.setItem('authToken', token)
            setUserName(data.user?.username)
            localStorage.setItem('username', data.user.username)
            console.log('login successful:',  data);
            return true;
            
        } catch (error:any) {
            console.error(error)
            let errorMessage:string
            if(error.code === 'ERR_INTERNET_DISCONNECTED') {
                errorMessage ='Failed to connect with sever, check internet connection!!'
            }else if (error.response && error.response.status === 404) {
                errorMessage='something went wrong, try again later!!'
            }else if (error.response && error.response.data.msg) {
                errorMessage = error.response.data.msg
            } else {
                errorMessage = 'Login failed, please try later'
            }
            setLogInError(errorMessage)
            return false;
            
        }finally {
            setLoading(false)
        }
        
    }

    return (
        <AuthContext.Provider value={{
            SignUp,
            Login,
            signUpError,
            logInError,
            setSignUpError,
            setLogInError,
            loading,
            setLoading,
            setUserName,
            userName,
            logOut

        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const  useAuthContextHook = () => {
    const context = useContext(AuthContext)
    if(!context) {
        throw new Error('useAuthContextHook must be used within an AuthProvider')
    }
    return context;
}

// "use client";

// import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// interface authContextType {
//     userName: string | null;
//     setUserName: (username: string | null) => void;
//     logOut: () => void;
// }

// export const AuthContext = createContext<authContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//     const [userName, setUserName] = useState<string | null>(null);

//     useEffect(() => {
//       const savedUsername = localStorage.getItem("username");
//       if (savedUsername) {
//         setUserName(savedUsername);
//       }
//     }, []);

//     const logOut = () => {
//         localStorage.removeItem("authToken");
//         localStorage.removeItem("regToken");
//         localStorage.removeItem("username");
//         setUserName('');
//         console.log("all authentications and user info cleared");
//     };

//     return (
//         <AuthContext.Provider value={{ userName, setUserName, logOut }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuthContextHook = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuthContextHook must be used within an AuthProvider');
//     }
//     return context;
// };