import React from "react";

interface OtpLoginProps {
  phoneNumber: string;
  otp: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  sendOtp: () => void;
}

const OtpLogin: React.FC<OtpLoginProps> = ({
  phoneNumber,
  otp,
  setPhoneNumber,
  setOtp,
  sendOtp,
}) => {
  return (
    <>
      <input
        type="text"
        placeholder="Phone Number"
        className="w-4/5 p-2 mb-2 border rounded mr-5"
        style={{ backgroundColor: "#2F2D2D" }}
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />

      <button
        type="button"
        className="p-2 bg-yellow-600 text-white rounded"
        onClick={sendOtp}
      >
        Send OTP
      </button>

      <input
        type="text"
        placeholder="Enter OTP"
        className="w-full p-2 mt-4 border rounded"
        style={{ backgroundColor: "#2F2D2D" }}
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
    </>
  );
};

export default OtpLogin;
