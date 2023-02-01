import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";
import { Field, Form, Formik, useFormik } from "formik";
import { loginUser } from "../../../slices/authSlice";
import { useDispatch } from "../../../store";
import { useSelector } from "react-redux";

const Login = () => {
  const { error } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      const { email, password } = values;
      dispatch(loginUser({ email: email, password: password })).then((data)=>{
        console.log(data)
      })
    },
  });

  return (
    <>
      <FormContainer>
        <form onSubmit={formik.handleSubmit}>
          <div className="brand">
            <h1>Nafkha's Chat</h1>
          </div>
          <input
            type="text"
            placeholder="Email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            min="3"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="error">*{formik.errors.email}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}

            // onChange={(e) =>
            //   setValues({ ...values, password: e.target.value })
            // }
          />

          <button type="submit">Login</button>

          {error && <div>{error}</div>}

          <span>
            Dont' have an account? <Link to="/signup">Register</Link>
          </span>
        </form>
      </FormContainer>
    </>
  );
};

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  .error {
    color: red;
    font-size: 12px;
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default Login;