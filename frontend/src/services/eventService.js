import { apiRequest } from "./api"; 
import { getStoredAuth } from "./authService"; 

export const eventService = {
    createEvent: async (eventData) => {
        const auth = getStoredAuth(); 

        if (!auth || !auth.token) {
            throw new Error("User is not authenticated or token is missing"); 
        }  
        
        return await apiRequest(
            "/events/create", 
            {
                method: "POST", 
                headers: {
                    Authorization: `Bearer ${auth.token}` 
                }, 
                body: JSON.stringify(eventData) 
            }
        ); 
    }
} 

