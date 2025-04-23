import * as client from "./client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
export default function Session({ children }: { children: any }) {
    const [pending, setPending] = useState(true);
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const currentUser = await client.profile();
                dispatch(setCurrentUser(currentUser));
            } catch (err: any) {
                console.error("Authentication error:", err.message);
                // On error, set current user to null
                dispatch(setCurrentUser(null));
            } finally {
                setPending(false);
            }
        };
        
        fetchProfile();
    }, [dispatch]);
    
    if (!pending) {
        return children;
    }
    
    // Optional: Show a loading indicator while checking auth
    return <div>Loading...</div>;
}