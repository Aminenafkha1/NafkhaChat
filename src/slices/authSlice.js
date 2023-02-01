import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";
import axios from "../utilities/axios";

const initialState = {
  token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
  user: {},
  status: "idle",
  error: null,
  isAuthenticated: localStorage.getItem("token") ? true : false,
};

const isValidToken = (token) => {
  if (!token) {
    return false;
  }
  const decoded = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};

const setSession = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common.Authorization;
  }
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    console.log(user);
    try {
      console.log(user);
      const res = await axios.post(`/api/v1/signup`, user);
      return res.data;
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (user, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const data = user;
    console.log(user);
    try {
      const res = await axios.post(`/api/v1/login`, data);
      console.log(res);
      const { token, user } = res.data;
      console.log(token);
      setSession(token);
      // localStorage.setItem('token',res.data.token)
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    _loadUser(state, action) {
      const token = state.token;
      if (token && isValidToken(token)) {
        const user = jwtDecode(token);
        return {
          ...state,
          token: token,
          user: user,
        };
      }
    },
    _logoutUser(state, action) {
      localStorage.removeItem("token");
      return {
        ...state,
        token: "",
        user: {},
        status: "",
        error: "",
        isAuthenticated: false,
      };
    },
  },
  extraReducers: {
    [registerUser.pending]: (state, action) => {
      return { ...state, status: "pending" };
    },
    [registerUser.fulfilled]: (state, action) => {
      state.user = action.payload.data?.success?.user;
      state.status = "success";
    },
    [registerUser.rejected]: (state, action) => {
      console.log(action.payload);

      state.status = "rejected";
      state.error = action.payload;
    },

    [loginUser.pending]: (state, action) => {
      state.status = "pending";
    },
    [loginUser.fulfilled]: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.status = "success";
      state.isAuthenticated = true;
    },

    [loginUser.rejected]: (state, action) => {
      console.log(action.payload);
      state.status = "rejected";
      state.error = action.payload;
    },
  },
});

export const { _loadUser, _logoutUser } = authSlice.actions;
export default authSlice.reducer;
