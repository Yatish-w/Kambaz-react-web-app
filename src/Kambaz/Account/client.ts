import axios from "axios";

// Define base URL
export const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER || 'https://kambaz-node-server-app-y1ij.onrender.com';
export const USERS_API = `${REMOTE_SERVER}/api/users`;

// Create axios instance with proper configuration
const axiosWithCredentials = axios.create({ 
    baseURL: REMOTE_SERVER,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

// Add interceptor to handle errors consistently
axiosWithCredentials.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
        return Promise.reject(error);
    }
);

export const enrollIntoCourse = async (userId: string, courseId: string) => {
    try {
        const response = await axiosWithCredentials.post(`/api/users/${userId}/courses/${courseId}`);
        return response.data;
    } catch (error) {
        console.error("Error enrolling into course:", error);
        throw error;
    }
};

export const unenrollFromCourse = async (userId: string, courseId: string) => {
    try {
        const response = await axiosWithCredentials.delete(`/api/users/${userId}/courses/${courseId}`);
        return response.data;
    } catch (error) {
        console.error("Error unenrolling from course:", error);
        throw error;
    }
};

// Only modify these first few functions to keep the edit manageable
export const findCoursesForUser = async (userId: string) => {
    try {
        const response = await axiosWithCredentials.get(`/api/users/${userId}/courses`);
        return response.data;
    } catch (error) {
        console.error("Error finding courses for user:", error);
        return [];
    }
};

export const createUser = async (user: any) => {
    const response = await axios.post(`${USERS_API}`, user);
    return response.data;
};

export const deleteUser = async (userId: string) => {
    const response = await axios.delete(`${USERS_API}/${userId}`);
    return response.data;
};

export const findUserById = async (id: string) => {
    const response = await axios.get(`${USERS_API}/${id}`);
    return response.data;
};

export const findUsersByPartialName = async (name: string) => {
    const response = await axios.get(`${USERS_API}?name=${name}`);
    return response.data;
};

export const findUsersByRole = async (role: string) => {
    const response = await
        axios.get(`${USERS_API}?role=${role}`);
    return response.data;
};

export const findAllUsers = async () => {
    const response = await axiosWithCredentials.get(USERS_API);
    return response.data;
};

export const createCourse = async (course: any) => {
    const { data } = await axiosWithCredentials.post(`${USERS_API}/current/courses`, course);
    return data;
};

export const findMyCourses = async () => {
    const { data } = await axiosWithCredentials.get(`${USERS_API}/current/courses`);
    return data;
};

export const signin = async (credentials: any) => {
    try {
        const response = await axiosWithCredentials.post(`/api/users/signin`, credentials);
        return response.data;
    } catch (error) {
        console.error("Signin error:", error);
        return null;
    }
};

export const signup = async (user: any) => {
    const response = await axiosWithCredentials.post(`${USERS_API}/signup`, user);
    return response.data;
};

export const updateUser = async (user: any) => {
    const response = await axiosWithCredentials.put(`${USERS_API}/${user._id}`, user);
    return response.data;
};

export const profile = async () => {
    try {
        const response = await axiosWithCredentials.get(`/api/users/profile`);
        return response.data;
    } catch (error) {
        console.error("Profile fetch error:", error);
        return null;
    }
};

export const signout = async () => {
    const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
    return response.data;
};