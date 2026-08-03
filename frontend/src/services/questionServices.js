import api from "./api";

export const getAllQuestions = async (
    search = "",
    difficulty = "",
    topic = "",
    platform = ""
) => {

    const response = await api.get("/questions", {
        params: {
            search,
            difficulty,
            topic,
            platform,
        },
    });

    return response.data;
};

export const getSingleQuestion = async (id) => {

    const response = await api.get(`/questions/${id}`);
    return response.data;

};