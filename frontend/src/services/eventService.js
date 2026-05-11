import { apiRequest } from "./api"; 
import { getStoredAuth } from "./authService"; 

export const eventService = {
    createEvent: async (eventData) => {
        const auth = getStoredAuth(); 

        if (!auth || !auth.token) {
            throw new Error("User is not authenticated or token is missing"); 
        }  
        
        return await apiRequest(
            "/events", 
            {
                method: "POST", 
                headers: {
                    Authorization: `Bearer ${auth.token}` 
                }, 
                body: JSON.stringify(eventData) 
            }
        ); 
    },  

    getEvents: async (params = {}) => { 
        const queryParams = new URLSearchParams();
        
        if (params.category !== undefined) queryParams.append("category", params.category);
        if (params.limit !== undefined) queryParams.append("limit", params.limit);

        const queryString = queryParams.toString();
        const url = queryString ? `/events?${queryString}` : "/events";

        return await apiRequest(url, {
            method: "GET", 
        }); 
    }, 

    getEventById: async (eventId) => {
        const auth = getStoredAuth(); 
        if (!auth || !auth.token) {
            throw new Error("User is not authenticated or token is missing"); 
        } 
        
        return await apiRequest(`/events/${eventId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        });
    }
} 

