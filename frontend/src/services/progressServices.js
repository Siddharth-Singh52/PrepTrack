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