import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import NormalLogin from "./NormalLogin";
import OtpLogin from "./OtpLogin";
import SocialLoginButton from "./SocialLoginButton";
import Link from "next/link";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // This is used only in OTP context
  const [otp, setOtp] = useState("");
  const [error, setError] = useState({
    email: "",
    password: "",
    phoneNumber: "",
    otp: "",
  });
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    const newError = { ...error };

    if (!email && !isPhoneLogin) {
      newError.email = "Please enter your email.";
      hasError = true;
    } else {
      newError.email = "";
    }

    if (!password && !isPhoneLogin) {
      newError.password = "Please enter your password.";
      hasError = true;
    } else {
      newError.password = "";
    }

    if (isPhoneLogin) {
      if (!phoneNumber) {
        newError.phoneNumber = "Please enter your phone number.";
        hasError = true;
      } else {
        newError.phoneNumber = "";
      }

      if (!otp) {
        newError.otp = "Please enter your OTP.";
        hasError = true;
      } else {
        newError.otp = "";
      }
    }

    setError(newError);

    if (hasError) return;

    if (isPhoneLogin) {
      console.log("Sending OTP credentials:", { phoneNumber, otp }); // Add logging
      const result = await signIn("OTP", {
        redirect: false,
        phone_number: phoneNumber,
        otp: otp,
        callbackUrl: "/homepage", // Set callbackUrl
      });
      console.log("OTP login result:", result); // Add logging
      if (result?.error) {
        setError({ ...newError, otp: result.error });
      } else {
        if (result?.url) {
          router.push(result.url);
        } else {
          router.push("/homepage");
        }
      }
    } else {
      console.log("Sending email credentials:", { email, password }); // Add logging
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/homepage", // Set callbackUrl
      });
      console.log("Email login result:", result); // Add logging

      if (result?.error) {
        setError({ ...newError, password: result.error });
      } else {
        if (result?.url) {
          router.push(result.url);
        } else {
          router.push("/homepage");
        }
      }
    }
  };

  const handleGoogleLogin = () => {
    setError({ email: "", password: "", phoneNumber: "", otp: "" }); // Reset errors
    signIn("google", { callbackUrl: "/homepage" });
  };

  const sendOtp = async () => {
    const result = await sendOtpToPhone();
    if (result.success) {
      alert("OTP sent to your phone!");
    } else {
      setError({ ...error, otp: result.error || "Failed to send OTP" });
    }
  };

  return (
    <>
      <form onSubmit={handleLoginSubmit}>
        {!isPhoneLogin ? (
          <NormalLogin
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            errorEmail={error.email} // Pass errorEmail here
            errorPassword={error.password} // Pass errorPassword here
          />
        ) : (
          <OtpLogin
            phoneNumber={phoneNumber}
            otp={otp}
            setPhoneNumber={setPhoneNumber}
            setOtp={setOtp}
            sendOtp={sendOtp}
            errorPhone={error.phoneNumber}
            errorOtp={error.otp}
          />
        )}

        <div className="flex justify-between mt-3">
          <div className="flex justify-center mb-1">
            <button
              type="button"
              onClick={() => setIsPhoneLogin(!isPhoneLogin)}
              className="text-blue-600 hover:underline"
            >
              {isPhoneLogin ? "login with email" : "login with OTP"}
            </button>
          </div>
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
      </form>

      <div className="flex items-center justify-center mt-6">
        <hr className="flex-grow border-t border-gray-500 w-20" />
        <span className="mx-4 text-white">or login with</span>
        <hr className="flex-grow border-t border-gray-500 w-20" />
      </div>

      <div className="mt-6">
        <SocialLoginButton
          provider="Google"
          iconSrc="/login_assets/google_icon.svg"
          onClick={() => handleGoogleLogin()}
        />
      </div>
    </>
  );
};

interface Result {
  success: boolean;
  error?: string;
}

const sendOtpToPhone = async (): Promise<Result> => {
  return { success: true };
};

export default LoginForm;
