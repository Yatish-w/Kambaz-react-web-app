import axios from "axios";
const axiosWithCredentials = axios.create({ 
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true"
    }
});
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER || 'https://kambaz-node-server-app-y1ij.onrender.com';
const COURSES_API = `${REMOTE_SERVER}/api/courses`;

export const findUsersForCourse = async (courseId: any) => {
    try {
        const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/users`);
        return response.data;
    } catch (error) {
        console.log("Error fetching users for course:", error);
        return [];
    }
};

export const createCourse = async (course: any) => {
    try {
        const { data } = await axiosWithCredentials.post(COURSES_API, course);
        return data;
    } catch (error) {
        console.log("Error creating course:", error);
        throw error;
    }
};

export const createModuleForCourse = async (courseId: string, module: any) => {
    try {
        const response = await axiosWithCredentials.post(
            `${COURSES_API}/${courseId}/modules`,
            module
        );
        return response.data;
    } catch (error) {
        console.log("Error creating module:", error);
        throw error;
    }
};

export const findModulesForCourse = async (courseId: string) => {
    try {
        const response = await axiosWithCredentials
            .get(`${COURSES_API}/${courseId}/modules`);
        return response.data;
    } catch (error) {
        console.log("Error finding modules:", error);
        return [];
    }
};

export const fetchAllCourses = async () => {
    try {
        const { data } = await axiosWithCredentials.get(COURSES_API);
        return data;
    } catch (error) {
        console.log("Error fetching courses:", error);
        return [];
    }
};

export const deleteCourse = async (id: string) => {
    try {
        const { data } = await axiosWithCredentials.delete(`${COURSES_API}/${id}`);
        return data;
    } catch (error) {
        console.log("Error deleting course:", error);
        throw error;
    }
};

export const updateCourse = async (course: any) => {
    try {
        const { data } = await axiosWithCredentials.put(`${COURSES_API}/${course._id}`, course);
        return data;
    } catch (error) {
        console.log("Error updating course:", error);
        throw error;
    }
};