import React from "react";
import styled from "styled-components";
import { useHistory, useLocation, useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { _logoutUser } from "../../slices/authSlice";

const Logout = () => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(_logoutUser())
  };
  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  );
};

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: rgb(255, 82, 161);
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;

export default Logout;