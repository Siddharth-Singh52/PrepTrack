import api from "./api";

export const addTimelineEvent = async (eventData) => {

    const response = await api.post("/timeline", eventData);

    return response.data;

};

export const getTimeline = async (applicationId) => {

    const response = await api.get(`/timeline/${applicationId}`);

    return response.data;

};

export const updateTimelineEvent = async (id, eventData) => {

    const response = await api.put(`/timeline/${id}`, eventData);

    return response.data;

};

export const deleteTimelineEvent = async (id) => {

    const response = await api.delete(`/timeline/${id}`);

    return response.data;

};