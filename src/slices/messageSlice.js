import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../utilities/axios";

const initialState = {
  messages: [],
  status: "idle",
  error: null,
};

export const getMessages = createAsyncThunk(
  "msg/getMessages",
  async (userID, thunkAPI) => {
    let data;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/v1/messages/${userID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      data = await response.data;
      if (response.status === 200) {
        return data;
      }

      throw new Error(response.statusText);
    } catch (err) {
      console.log(err);
      return Promise.reject(err.message ? err.message : data?.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "msg/sendMessage",
  async (msg, thunkAPI) => {
    let data;

    let { message, receiver_id, image } = msg;
    console.log(image);

    const formData = new FormData();
    formData.append("receiver_id", receiver_id);
    if (message) {
      formData.append("message", message);
    }
    if (image) {
      formData.append("image", image);
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/v1/chat/sendmsg`,
        formData,
        image,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      data = await response.data;
      if (response.status === 200) {
        return data;
      }

      throw new Error(response.statusText);
    } catch (err) {
      console.log(err);
      return Promise.reject(err.message ? err.message : data?.message);
    }
  }
);

const slice = createSlice({
  name: "message",
  initialState,
  reducers: {},
  extraReducers: {
    [getMessages.pending]: (state) => {
      state.status = "loading";
    },
    [getMessages.fulfilled]: (state, action) => {
      console.log(action.payload);
      state.status = "succeeded";
      state.messages = action.payload;
    },
    [getMessages.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },

    [sendMessage.pending]: (state) => {
      state.status = "loading";
    },
    [sendMessage.fulfilled]: (state, action) => {
      console.log(action.payload);
      state.status = "succeeded";
    },
    [sendMessage.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const {} = slice.actions;

export const reducer = slice.reducer;

export default slice;
