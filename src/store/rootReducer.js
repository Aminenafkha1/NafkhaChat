import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import { reducer as userReducer } from "../slices/userSlice";
import { reducer as msgReducer } from "../slices/messageSlice";


const combinedReducer = combineReducers({
  auth: authSlice,
  user: userReducer,
  message: msgReducer,

});

// const rootReducer = (state, action) => {
//   if (action.type === 'LOGOUT') {
//     // check for action type
//     state = undefined;
//   }
//   return combinedReducer(state, action);
// };

export default combinedReducer;
