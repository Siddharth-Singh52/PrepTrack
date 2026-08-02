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