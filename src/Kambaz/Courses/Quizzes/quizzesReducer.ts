import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    quizzes: [],
    updatingQuiz: {},
    newQuiz: {_id: "new", title: "New Quiz", course: "", due: "", availableFrom: "", 
              availableUntil: "", questions: [], points: 0, quizType: "Graded Quiz",
              assignmentGroup: "Quizzes", instructions: "", shuffleAnswers: true, 
              timeLimit: true, minutes: "20", allowMultipleAttempts: false, assignTo: "Everyone", status: "unpublished", 
              showCorrectAnswers: true, accessCode: "", oneQuestionAtATime: true, webcamRequired: false, lockQuestions: false,
              requiredToViewResults: false, requireLockdownBrowser: false, viewResponses: true, attemptNumber: 0},
    questions: [],
    updatingQuestion: {},
    newQuestion: {_id: "new", course: "", quiz: "", title: "new question", points: 0, questionType: "multiple choice", content: "",
                  correctAnswer: "", userAnswer: "", pointsRecieved: 0, possibleAnswers: ["Possible Answer"], editing: false}
};

const quizzesSlice = createSlice({
    name: "quizzes",
    initialState,
    reducers: {
        setQuizzes: (state, action) => {
            state.quizzes = action.payload;
        },
        addQuiz: (state, { payload: quiz }) => {
            const newQuiz: any = {
              _id: new Date().getTime().toString(),
              title: quiz.title,
              course: quiz.course,
            };
            state.quizzes = [...state.quizzes, newQuiz] as any;
            state.newQuiz = {_id: "new", title: "New Quiz", course: "", due: "", availableFrom: "", 
                availableUntil: "", questions: [], points: 0, quizType: "Graded quiz",
                assignmentGroup: "Quizzes", instructions: "", shuffleAnswers: true, 
                timeLimit: true, minutes: "20", allowMultipleAttempts: false, assignTo: "Everyone", status: "unpublished",
                showCorrectAnswers: true, accessCode: "", oneQuestionAtATime: true, webcamRequired: false, lockQuestions: false,
                requiredToViewResults: false, requireLockdownBrowser: false, viewResponses: true, attemptNumber: 0};
            state.updatingQuiz = {};
        },
        deleteQuiz: (state, { payload: quizzes }) => {
            state.quizzes = state.quizzes.filter((q: any) => q._id !== quizzes);
        },
        updateQuiz: (state, { payload: quiz }) => {
            state.quizzes = state.quizzes.map((q: any) =>
                q._id === quiz._id ? quiz : q) as any;
            state.newQuiz = {_id: "new", title: "New Quiz", course: "", due: "", availableFrom: "", 
                availableUntil: "", questions: [], points: 0, quizType: "Graded Quiz",
                assignmentGroup: "Quizzes", instructions: "", shuffleAnswers: true, 
                timeLimit: true, minutes: "20", allowMultipleAttempts: false, assignTo: "Everyone", status: "unpublished",
                showCorrectAnswers: true, accessCode: "", oneQuestionAtATime: true, webcamRequired: false, lockQuestions: false,
                requiredToViewResults: false, requireLockdownBrowser: false, viewResponses: true, attemptNumber: 0};
            state.updatingQuiz = {};
        },
        updateNewQuiz: (state, {payload: quiz}) => {
            state.newQuiz = quiz;
        },
        editQuiz: (state, { payload: quizId }) => {
            state.quizzes = state.quizzes.map((q: any) =>
                q._id === quizId ? { ...q, editing: true } : q) as any;
        },
        setQuiz: (state, { payload: quiz }) => {
            state.updatingQuiz = quiz;
        },
        
        setQuestions: (state, action) => {
            state.questions = action.payload;
        },

        setQuestion: (state, { payload: question }) => {
            state.updatingQuestion = question;
        },
    },
});

export const {setQuizzes, addQuiz, deleteQuiz, updateQuiz, editQuiz, setQuiz, setQuestions, updateNewQuiz} = quizzesSlice.actions;
export default quizzesSlice.reducer;