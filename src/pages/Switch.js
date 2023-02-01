import React, { useEffect } from 'react';
import SplashScreen from '../../components/SplashScreen';
import { useHistory, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../utilities/axios';
import { _logoutUser } from '../../slices/authSlice';

const Switch = () => {
  const {isAuthenticated} =  useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const history= useHistory();
  const token = location.search.split('?token=')[1];

  useEffect(() => {
    if (token) {
      dispatch(_logoutUser());
      localStorage.removeItem('token');
      delete axios.defaults.headers.common.Authorization;
      localStorage.setItem('token', token);
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      if (isAuthenticated) {
        history.push('/');
      }
      history.go(0);
    } else {
      history.push('/login');
    }
  });

  return (
    <div>
      <SplashScreen />
    </div>
  );
};

export default Switch;
