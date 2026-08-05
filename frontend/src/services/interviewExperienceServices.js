import api from "./api";

export const getExperiences = async (applicationId) => {

    const response = await api.get(`/experiences/${applicationId}`);

    return response.data;
};

export const createExperience = async (experienceData) => {

    const response = await api.post(
        "/experiences",
        experienceData
    );

    return response.data;
};

export const updateExperience = async (id, experienceData) => {

    const response = await api.put(
        `/experiences/${id}`,
        experienceData
    );

    return response.data;
};

export const deleteExperience = async (id) => {

    const response = await api.delete(
        `/experiences/${id}`
    );

    return response.data;
};