import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ObjectID } from "bson";
import axios from "../utilities/axios";

const initialState = {
  quizzes: [],
  status: "idle",
  error: null,
  selectedPreview: {},
  oneQuiz: {
    data: {},
    initialQuestions: [],
    selectedquestion: {},
  },
};

export const getQuizzes = createAsyncThunk(
  "quiz/getQuizzes",
  async (queries, thunkAPI) => {
    const { page, search } = queries;
    let data;
    const pageN = page || 1;
    const searchlive = search || "";
    try {
      // const token = localStorage.getItem("token");
      if (searchlive) {
        const response = await axios.get(
          `/api/v1/quizzes?search=${searchlive}&perPage=6&page=${pageN}`,
          {
            //After Auth
            //   headers:{ Authorization: `Bearer ${token}`,
            // },
          }
        );
        return response.data;
      } else {
        const response = await axios.get(
          `/api/v1/quizzes?perPage=6&page=${pageN}`,
          {
            //After Auth
            //   headers:{ Authorization: `Bearer ${token}`,
            // },
          }
        );
        return response.data;
      }
    } catch (err) {
      console.log(err);
      return Promise.reject(err.message ? err.message : data?.message);
    }
  }
);

export const addQuiz = createAsyncThunk("quiz/addQuiz", async (values) => {
  let data;
  try {
    const response = await axios.post(
      `/api/v1/quizzes`,
      //   headers:{ Authorization: `Bearer ${token}`,
      // },
      values
    );

    data = await response.data;
    console.log("post", response.data);

    if (response.status === 200) {
      return data;
    }

    throw new Error(response.statusText);
  } catch (err) {
    console.log(err);
    return Promise.reject(err.message ? err.message : data?.message);
  }
});

export const getQuiz = createAsyncThunk("quiz/getQuiz", async (id) => {
  console.log(id);
  let data;
  try {
    const response = await axios.get(
      `/api/v1/quizzes/${id}`
      //   headers:{ Authorization: `Bearer ${token}`,
      // },
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
});

export const deleteQuiz = createAsyncThunk("quiz/deleteQuiz", async (id) => {
  console.log(id);
  let data;
  try {
    const response = await axios.delete(
      `/api/v1/quizzes/${id}`
      //   headers:{ Authorization: `Bearer ${token}`,
      // },
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
});

export const updateQuiz = createAsyncThunk(
  "quiz/getupdateQuizQuiz",
  async (values) => {
    let { quizId, quizData } = values;
    let data;
    try {
      const response = await axios.get(
        `/api/v1/quizzes/${quizId}`,
        //   headers:{ Authorization: `Bearer ${token}`,
        // },
        quizData
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
  name: "quiz",
  initialState,
  reducers: {
    editselectedPreview(state, action) {
      state.selectedPreview = action.payload;
    },

    // editQuestionsOfOneQuiz(state, action) {
    //   state.selectedquestion = { ...state.selectedquestion, ...action.payload };
    //   const itemIndex = state.questions.findIndex(
    //     (questItem) => questItem.id === state.selectedquestion.id
    //   );
    //   state.questions[itemIndex] = {
    //     ...state.questions[itemIndex],
    //     ...action.payload,
    //   };
    // },

    initialQuestions(state, action) {
      const questions = [];
      questions.push({
        idItem: new ObjectID(),
        title: "",
        description: "description",
        isMultiple: false,
        choices: [
          {
            idItem: new ObjectID(),
            answer: null,
            isCorrect: false,
            type: "text",
          },
          {
            idItem: new ObjectID(),
            answer: null,
            isCorrect: false,
            type: "text",
          },
          {
            idItem: new ObjectID(),
            answer: null,
            isCorrect: false,
            type: "text",
          },
        ],
      });
      state.oneQuiz.data = { ...state.oneQuiz.data, questions: questions };
    },
    selectQuestionOfOneQuiz(state, action) {
      state.oneQuiz.selectedquestion = action.payload;
    },

    editSelectedQuestionOfOneQuiz(state, action) {
      console.log("action", action.payload);
      state.oneQuiz.selectedquestion = {
        ...state.selectedquestion,
        ...action.payload,
      };
      const itemIndex = state.oneQuiz.data.questions.findIndex(
        (questItem) => questItem.id === state.oneQuiz.selectedquestion.id
      );
      state.oneQuiz.data.questions[itemIndex] = {
        ...state.oneQuiz.data.questions[itemIndex],
        ...action.payload,
      };
    },

    editQuestionOfOneQuiz(state, action) {
      const itemIndex = state.oneQuiz.data.questions.findIndex(
        action.payload.idItem
          ? (questItem) => questItem.idItem === action.payload.idItem
          : (questItem) => questItem._id === action.payload._id
      );

      state.oneQuiz.data.questions[itemIndex] = {
        ...state.oneQuiz.data.questions[itemIndex],
        ...action.payload,
      };
    },
    increaseQuestionOfOneQuiz(state, action) {
      if (!state.oneQuiz.data.questions) {
        const questions = [];
        questions.push(action.payload);
        state.oneQuiz.data = { questions };
      } else {
        state.oneQuiz.data?.questions?.push(action.payload);
      }
    },

    removeAddedQuestionsfromOneQuiz(state, action) {
      const nextItems = state.oneQuiz.data.questions.filter(
        (item) => !("idItem" in item)
      );
      state.oneQuiz.data.questions = nextItems;
    },

    switchisMultiple(state, action) {
      if (action.payload.id) {
        const itemIndex = state.oneQuiz.data.questions.findIndex(
          (questItem) => questItem._id === action.payload.id
        );

        state.oneQuiz.data.questions[itemIndex] = {
          ...state.oneQuiz.data.questions[itemIndex],
          isMultiple: !state.oneQuiz.data.questions[itemIndex].isMultiple,
        };

        if (state.oneQuiz.data.questions[itemIndex].isMultiple === false) {
          state.oneQuiz.data.questions[itemIndex].choices.map((item) => {
            item.isCorrect = false;

            return item;
          });
        }
      } else if (action.payload.idItem) {
        const itemIndex = state.oneQuiz.data.questions.findIndex(
          (questItem) => questItem.idItem === action.payload.idItem
        );

        state.oneQuiz.data.questions[itemIndex] = {
          ...state.oneQuiz.data.questions[itemIndex],
          isMultiple: !state.oneQuiz.data.questions[itemIndex].isMultiple,
        };

        if (state.oneQuiz.data.questions[itemIndex].isMultiple === false) {
          state.oneQuiz.data.questions[itemIndex].choices.map((item) => {
            item.isCorrect = false;

            return item;
          });
        }
      }
    },

    decreaseChoiceInQuestionOfOneQuiz(state, action) {
      if (action.payload.questionIdnew) {
        const questionIndex = state.oneQuiz.data.questions.findIndex(
          (questItem) => questItem.idItem === action.payload.questionIdnew
        );
        console.log(action.payload.choiceId);

        if (action.payload.choiceId) {
          const nextItems = state.oneQuiz.data.questions[
            questionIndex
          ].choices.filter((item) => item._id !== action.payload.choiceId);
          state.oneQuiz.data.questions[questionIndex].choices = [...nextItems];
        } else {
          const nextItems = state.oneQuiz.data.questions[
            questionIndex
          ].choices.filter(
            (item) => item.idItem !== action.payload.choiceIdnew
          );
          state.oneQuiz.data.questions[questionIndex].choices = [...nextItems];
        }
      } else {
        const questionIndex = state.oneQuiz.data.questions.findIndex(
          (questItem) => questItem._id === action.payload.questionId
        );
        if (action.payload.choiceId) {
          const nextItems = state.oneQuiz.data.questions[
            questionIndex
          ].choices.filter((item) => item._id !== action.payload.choiceId);
          state.oneQuiz.data.questions[questionIndex].choices = [...nextItems];
        } else {
          const nextItems = state.oneQuiz.data.questions[
            questionIndex
          ].choices.filter(
            (item) => item.idItem !== action.payload.choiceIdnew
          );
          state.oneQuiz.data.questions[questionIndex].choices = [...nextItems];
        }
      }
    },
    increaseChoiceInQuestionOfOneQuiz(state, action) {
      if (action.payload._id) {
        const questionIndex = state.oneQuiz.data.questions.findIndex(
          (questItem) => questItem._id === action.payload.questionId
        );
        const question = state.oneQuiz.data.questions[questionIndex];
        if (question) {
          question.choices.push(action.payload.addedChoice);
        }
      } else {
        const questionIndex = state.oneQuiz.data.questions.findIndex(
          (questItem) => questItem.idItem === action.payload.questionIdnew
        );
        const question = state.oneQuiz.data.questions[questionIndex];
        if (question) {
          question.choices.push(action.payload.addedChoice);
        }
      }
    },

    isCheckedChoiceInQuestionOfOneQuiz(state, action) {
      if (action.payload.questionId) {
        if (action.payload.choiceId) {
          let questions = [...state.oneQuiz.data.questions];
          let outerIndex = questions.findIndex(
            (outerObj) => outerObj._id === action.payload.questionId
          );
          let choices = [...questions[outerIndex].choices];
          let innerIndex = choices.findIndex(
            (innerObj) => innerObj._id === action.payload.choiceId
          );
          choices[innerIndex] = Object.assign({}, choices[innerIndex], {
            isCorrect: action.payload.isCorrect,
          });
          questions[outerIndex].choices = choices;
          state.oneQuiz.data.questions = questions;

          if (action.payload.isMultiple === false) {
            state.oneQuiz.data.questions[outerIndex].choices.map((obj) => {
              if (obj._id !== action.payload.choiceId) {
                const index = state.oneQuiz.data.questions[
                  outerIndex
                ].choices.findIndex((itemChoice) => itemChoice._id === obj._id);
                state.oneQuiz.data.questions[outerIndex].choices[index] = {
                  ...state.oneQuiz.data.questions[outerIndex].choices[index],
                  isCorrect: false,
                };
              }
            });
          }
        } else if (action.payload.choiceIdnew) {
          let questions = [...state.oneQuiz.data.questions];
          let outerIndex = questions.findIndex(
            (outerObj) => outerObj._id === action.payload.questionId
          );

          console.log(
            state.oneQuiz.data.questions[0].choices[4].idItem?.toString()
          );

          let choices = [...questions[outerIndex].choices];
          let innerIndex = choices.findIndex(
            (innerObj) =>
              innerObj.idItem?.toString() === action.payload.choiceIdnew
          );
          choices[innerIndex] = {
            ...choices[innerIndex],
            isCorrect: action.payload.isCorrect,
          };

          questions[outerIndex].choices = choices;
          state.oneQuiz.data.questions = questions;

          if (action.payload.isMultiple === false) {
            state.oneQuiz.data.questions[outerIndex].choices.map((obj) => {
              if (obj.idItem?.toString() !== action.payload.choiceIdnew) {
                const index = state.oneQuiz.data.questions[
                  outerIndex
                ].choices.findIndex(
                  (itemChoice) => itemChoice.idItem === obj.idItem
                );
                state.oneQuiz.data.questions[outerIndex].choices[index] = {
                  ...state.oneQuiz.data.questions[outerIndex].choices[index],
                  isCorrect: false,
                };
              }
            });
          }
        }
      } else {
        console.log(action.payload.questionIdnew);
        let questions = [...state.oneQuiz.data.questions];
        let outerIndex = questions.findIndex(
          (outerObj) => outerObj.idItem === action.payload.questionIdnew
        );

        let choices = [...questions[outerIndex].choices];
        console.log(outerIndex);
        let innerIndex = choices.findIndex(
          (innerObj) =>
            innerObj.idItem?.toString() === action.payload.choiceIdnew
        );

        console.log(innerIndex);
        choices[innerIndex] = {
          ...choices[innerIndex],
          isCorrect: action.payload.isCorrect,
        };
        questions[outerIndex].choices = choices;
        state.oneQuiz.data.questions = questions;

        if (action.payload.isMultiple === false) {
          state.oneQuiz.data.questions[outerIndex].choices.map((obj) => {
            if (
              obj.idItem?.toString() !== action.payload.choiceIdnew?.toString()
            ) {
              const index = state.oneQuiz.data.questions[
                outerIndex
              ].choices.findIndex(
                (itemChoice) =>
                  itemChoice.idItem?.toString() === obj.idItem?.toString()
              );
              state.oneQuiz.data.questions[outerIndex].choices[index] = {
                ...state.oneQuiz.data.questions[outerIndex].choices[index],
                isCorrect: false,
              };
            }
          });
        }
      }
    },

    writeAnswerOfChoiceInQuestionOfOneQuiz(state, action) {
      if (action.payload.questionId) {
        if (action.payload.choiceId) {
          let questions = [...state.oneQuiz.data.questions];
          let outerIndex = questions.findIndex(
            (outerObj) => outerObj._id === action.payload.questionId
          );

          let choices = [...questions[outerIndex].choices];
          let innerIndex = choices.findIndex(
            (innerObj) => innerObj._id === action.payload.choiceId
          );
          choices[innerIndex] = {
            ...choices[innerIndex],
            answer: action.payload.answer,
          };
          questions[outerIndex].choices = choices;
          state.oneQuiz.data.questions = questions;
        } else if (action.payload.choiceIdnew) {
          let questions = [...state.oneQuiz.data.questions];
          let outerIndex = questions.findIndex(
            (outerObj) => outerObj._id === action.payload.questionId
          );

          let choices = [...questions[outerIndex].choices];
          let innerIndex = choices.findIndex(
            (innerObj) => innerObj.idItem === action.payload.choiceIdnew
          );
          choices[innerIndex] = {
            ...choices[innerIndex],
            answer: action.payload.answer,
          };
          questions[outerIndex].choices = choices;
          state.oneQuiz.data.questions = questions;
        }
      } else {
        let questions = [...state.oneQuiz.data.questions];
        let outerIndex = questions.findIndex(
          (outerObj) => outerObj.idItem === action.payload.questionIdnew
        );

        let choices = [...questions[outerIndex].choices];
        let innerIndex = choices.findIndex(
          (innerObj) => innerObj.idItem === action.payload.choiceIdnew
        );
        choices[innerIndex] = {
          ...choices[innerIndex],
          answer: action.payload.answer,
        };
        questions[outerIndex].choices = choices;
        state.oneQuiz.data.questions = questions;
      }
    },

    toggletoChoicesImagesInQuestionOfOneQuiz(state, action) {
      let itemIndex;
      if (action.payload._id) {
        itemIndex = state.oneQuiz.data.questions.findIndex(
          (questItem) => questItem._id === action.payload.id
        );
      } else {
        itemIndex = state.oneQuiz.data.questions.findIndex(
          (questItem) => questItem.idItem === action.payload.idItem
        );
      }

      state.oneQuiz.data.questions[itemIndex]?.choices.map((item) => {
        item.type = "image";
        item.answer = "";

        return item;
      });
    },

    toggletoChoicesTextsInQuestionOfOneQuiz(state, action) {
      let itemIndex;
      if (action.payload._id) {
        itemIndex = state.oneQuiz.data.questions.findIndex(
          (questItem) => questItem._id === action.payload.id
        );
      } else {
        itemIndex = state.oneQuiz.data.questions.findIndex(
          (questItem) => questItem.idItem === action.payload.idItem
        );
      }

      state.oneQuiz.data.questions[itemIndex]?.choices.map((item) => {
        item.type = "text";
        item.answer = "";

        return item;
      });
    },

    removeQuestionfromOneQuiz(state, action) {
      if (action.payload.questionId) {
        const nextItems = state.oneQuiz.data.questions.filter(
          (item) => item.idItem !== action.payload.questionId
        );
        state.oneQuiz.data.questions = [...nextItems];
      }
    },

    editDataOneQuiz(state, action) {
      state.oneQuiz.data.title = action.payload;
    },
  },
  extraReducers: {
    [getQuizzes.pending]: (state) => {
      state.status = "loading";
    },
    [getQuizzes.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.quizzes = action.payload;
      if (action.payload.data) {
        state.selectedPreview = { id: action.payload.data[0]._id };
        console.log("etape 1 ", state.selectedPreview);
      } else {
        state.selectedPreview = {};
      }
    },
    [getQuizzes.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },

    [addQuiz.pending]: (state) => {
      state.status = "loading";
    },
    [addQuiz.fulfilled]: (state, action) => {
      state.status = "succeeded";
    },
    [addQuiz.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },

    [getQuiz.pending]: (state) => {
      state.status = "loading";
    },
    [getQuiz.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.oneQuiz.data = action.payload.data;
      state.oneQuiz.initialQuestions = action.payload.data.questions;
      state.oneQuiz.selectedquestion = action.payload.data.questions[0];
    },
    [getQuiz.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },

    [deleteQuiz.pending]: (state) => {
      state.status = "loading";
    },
    [deleteQuiz.fulfilled]: (state, action) => {
      state.status = "succeeded";
    },
    [deleteQuiz.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },

    [updateQuiz.pending]: (state) => {
      state.status = "loading";
    },
    [updateQuiz.fulfilled]: (state, action) => {
      state.status = "succeeded";
    },
    [updateQuiz.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const {
  editselectedPreview,
  selectQuestionOfOneQuiz,
  switchisMultiple,
  editQuestionOfOneQuiz,
  isCheckedChoiceInQuestionOfOneQuiz,
  decreaseChoiceInQuestionOfOneQuiz,
  increaseQuestionOfOneQuiz,
  initialQuestions,
  removeAddedQuestionsfromOneQuiz,
  increaseChoiceInQuestionOfOneQuiz,
  writeAnswerOfChoiceInQuestionOfOneQuiz,
  toggletoChoicesImagesInQuestionOfOneQuiz,
  toggletoChoicesTextsInQuestionOfOneQuiz,
  removeQuestionfromOneQuiz,
  editDataOneQuiz,
} = slice.actions;

export const reducer = slice.reducer;

export default slice;
