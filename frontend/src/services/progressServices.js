import api from "./api";

export const updateProgress = async (questionId, status) => {

    const response = await api.post("/progress", {
        questionId,
        status,
    });

    return response.data;
};

export const getUserProgress = async () => {

    const response = await api.get("/progress");
    return response.data;
};

export const updateNotes = async (questionId, notes) => {

    const response = await api.put("/progress/notes", {
        questionId,
        notes,
    });

    return response.data;
};

export const toggleFavorite = async (questionId) => {

    const response = await api.put("/progress/favorite", {
        questionId,
    });

    return response.data;
};

export const getTodayRevisions = async () => {
    const response = await api.get("/progress/today");
    return response.data;
};