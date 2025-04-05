import * as client from "./client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";

export default function Session({ children }: { children: any }) {
    const [pending, setPending] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();

    const fetchProfile = async () => {
        try {
            const currentUser = await client.profile();
            dispatch(setCurrentUser(currentUser));
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to fetch profile");
            dispatch(setCurrentUser(null));
        } finally {
            setPending(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (pending) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return children;
}