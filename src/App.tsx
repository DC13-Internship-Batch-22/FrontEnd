import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Payment from "./pages/Payment";
import Login from "./pages/Login";
import Order from "./pages/Order";
import OrderDetail from "./pages/OrderDetail";
import Home from "./pages/Home";
import Table from "./pages/Table";
import Menu from "./pages/Menu";


// Trang Home thay thế cho trang report
function App() {
  let a: number = 6
  console.log(a);
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<Navigate to="/login" />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path="/" element={<Home></Home>}></Route> 
        <Route path="/table" element={<Table></Table>}></Route>
        <Route path="/table/:id" element={<Menu></Menu>}></Route>
        <Route path="/order" element={<Order></Order>}></Route>
        <Route path="/order/:id" element={<OrderDetail></OrderDetail>}></Route>
        <Route path='/payment' element={<Payment />}></Route>
      </Routes>
    </BrowserRouter>
  )
}


export default App
