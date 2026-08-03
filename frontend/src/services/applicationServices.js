import api from "./api";

// Get all applications
export const getApplications = async () => {
    const response = await api.get("/applications");
    return response.data;
};

// Create application
export const createApplication = async (applicationData) => {
    const response = await api.post("/applications", applicationData);
    return response.data;
};

// Update application
export const updateApplication = async (id, applicationData) => {
    const response = await api.put(`/applications/${id}`, applicationData);
    return response.data;
};

// Delete application
export const deleteApplication = async (id) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
};