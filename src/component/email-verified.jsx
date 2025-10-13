import { useEffect } from "react"
import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store.tsx";
import UserService from "../api/UserService";
import AppLayout from "../layout/AppLayout.js";

const EmailVerified = () => {
    const [searchParams] = useSearchParams();
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        const status = searchParams.get("status");
        const message = searchParams.get("message");

        if (status === "success") {
            const fetchUser = async () => {
                const response = await UserService.getProfile();
                if (response?.data.user) {
                    setUser(response?.data.user);
                }
            };

            fetchUser();
        } else {
            console.error("Verification failed:", message);
        }
    }, [searchParams, setUser]);

    return(
        <AppLayout>
            <div className="wrapper h-auto w-full p-5 bg-white rounded">
                {searchParams.get("status") === "success" ? (
                    <h1>Email Verified Successfully!</h1>
                ) : (
                    <h1>Verification Failed: {searchParams.get("message")}</h1>
                )}
            </div>
        </AppLayout>
    )
}

export default EmailVerified