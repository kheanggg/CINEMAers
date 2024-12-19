'use client';

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import PasswordBox from "./passwordBox";
import SocialLoginButton from "./SocialLoginButton";
import Link from "next/link";

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            setError(result.error);
        } else {
            setError("");
            router.push("/homepage");
        }
    };

    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/homepage" });
    };

    return (
        <form onSubmit={handleLoginSubmit}>
            <input
                type="email"
                placeholder="Email / Phone Number"
                className="w-full p-2 mb-4 border rounded"
                style={{ backgroundColor: "#2F2D2D" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordBox
                placeholder="Password"
                value={password}
                onChange={setPassword}
            />

            <div className="flex justify-between mt-4">
                <div></div>
                <Link
                    href="/login/forget"
                    className="hover:underline"
                    style={{ color: "#E79C11" }}
                >
                    forgot password?
                </Link>
            </div>

            <div className="flex justify-center mt-4">
                <button
                    type="submit"
                    className="p-2 bg-red-600 text-white rounded"
                    style={{ height: "42px", width: "119px", borderRadius: "45px" }}
                >
                    LOGIN
                </button>
            </div>

            <div className="flex items-center justify-center mt-6">
                <hr className="flex-grow border-t border-gray-500 w-20" />
                <span className="mx-4 text-white">or login with</span>
                <hr className="flex-grow border-t border-gray-500 w-20" />
            </div>

            <div className="mt-6">
                <SocialLoginButton
                    provider="Google"
                    iconSrc="/login_assets/google_icon.svg"
                    onClick={handleGoogleLogin}
                />
                <SocialLoginButton
                    provider="Facebook"
                    iconSrc="/login_assets/facebook_icon.svg"
                    onClick={() => alert("Facebook login not implemented yet")}
                />
            </div>
        </form>
    );
}

export default LoginForm;
