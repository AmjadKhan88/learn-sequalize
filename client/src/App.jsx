import {Toaster} from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import Layout from './layouts/Layout'
import Home from './pages/Home'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Spiner from './components/spiners/Spiner'

function App() {
  const {loading, auth} = useAuth();

  return loading ? <Spiner className='w-full h-screen flex justify-center items-center' /> : auth ? (
    <div className='max-w-6xl mx-auto'>

     
         <Routes>
           <Route path='/' element={<Layout/>}>
              <Route index element={<Home/>}/>
           </Route>
         </Routes>
    
      
    </div>
  )
  :
  <Login/>
}

export default App
