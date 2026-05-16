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
                body: eventData
            }
        ); 
    }, 

    uploadBanner: async (fileObject) => {
        const auth = getStoredAuth(); 
        if (!auth || !auth.token) {
            throw new Error("Користувач не авторизований"); 
        } 

        const formData = new FormData();
        formData.append("banner", fileObject);

        return await apiRequest("/events/upload", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${auth.token}` 
            },
            body: formData
        });
    },
} 

