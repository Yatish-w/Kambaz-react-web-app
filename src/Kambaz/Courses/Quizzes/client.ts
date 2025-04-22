import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;

export const findQuizzesForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/quizzes`);
  return response.data;
};

export const createQuiz = async (courseId: string, quiz: any) => {
  const response = await axiosWithCredentials.post( `${COURSES_API}/${courseId}/quizzes`, quiz );
  return response.data;
};

export const deleteQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.delete(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

export const updateQuiz = async (quiz: any) => {
  const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quiz._id}`, quiz);
  return response.data;
};

export const findQuiz = async (cid: string, qid: string) => {
  const response = await axiosWithCredentials.get(`${COURSES_API}/${cid}/quizzes/${qid}`);
  return response.data;
};