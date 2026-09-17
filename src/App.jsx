import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './Layout';
import TodaySpecial from './Component/TodaySpecial/TodaySpecial';
import Login from './Component/Login/Login';
import Signup from './Component/Signup/Signup';
import FullMenu from './Component/FullMenu/FullMenu';
import RoyalDish from './Component/RoyalDish/RoyalDish';
import CurrentOrderCart from './Component/CurrentOrderCart/CurrentOrderCart';
import CheckoutDelivery from './Component/CheckoutDelivery/CheckoutDelivery';
import NotFound404 from './Component/NotFound404/NotFound404';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<TodaySpecial />} />
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="menu" element={<FullMenu />} />
            <Route path="/menu/:id" element={<RoyalDish />} />{' '}
            <Route path="future" element={<TodaySpecial />} />
            <Route path="orderCart" element={<CurrentOrderCart />} />
            <Route path="delivery" element={<CheckoutDelivery />} />
            <Route
              path="Delibery"
              element={<Navigate to="/delivery" replace />}
            />
            <Route path="*" element={<NotFound404 />} />
          </Route>
        </Routes>
      </BrowserRouter>
      {/* doc element modifier */}
    </>
  );
}

export default App;
