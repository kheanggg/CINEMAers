import React, { useState, useEffect } from "react";
import Image from "next/image";
import ExitConfirmation from "./ExitConfirmation"; // Import the ExitConfirmation component

interface ConfirmBooking {
  isVisible: boolean;
  onClose: () => void;
  setShowSuccessfulBooking: React.Dispatch<React.SetStateAction<boolean>>;
  bookingDetails: BookingDetails;
}

interface BookingDetails {
  movieTitle: string;
  time: string;
  date: string;
  format: string;
  hall: number;
  cinema: string;
  posterurl: string;
  selectedSeats: { [key: string]: boolean };
}

export default function ConfirmBooking({
  isVisible,
  onClose,
  setShowSuccessfulBooking,
  bookingDetails,
}: ConfirmBooking) {
  const { movieTitle, time, posterurl, date } = bookingDetails;

  const [mounted, setMounted] = useState(false);
  const [exit, setExit] = useState(false); // State for exit confirmation modal

  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const validCardNumber = "1234567890123456";
  const validExpiryDate = "12/34";
  const validCvv = "123";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setEmail("");
      setCardNumber("");
      setExpiryDate("");
      setCvv("");
      setErrors({ email: "", cardNumber: "", expiryDate: "", cvv: "" });
    }
  }, [isVisible]);

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", cardNumber: "", expiryDate: "", cvv: "" };

    if (!email) {
      newErrors.email = "Email is required.";
      valid = false;
    }

    if (cardNumber !== validCardNumber) {
      newErrors.cardNumber = "Invalid card number.";
      valid = false;
    }

    if (expiryDate !== validExpiryDate) {
      newErrors.expiryDate = "Invalid expiry date.";
      valid = false;
    }

    if (cvv !== validCvv) {
      newErrors.cvv = "Invalid CVV.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleConfirm = () => {
    if (validateForm()) {
      setShowSuccessfulBooking(true); // Show successful booking modal
      onClose(); // Close the current modal
    }
  };

  const handleCancel = () => {
    setExit(false);
  };

  const handleExitConfirm = () => {
    setExit(false);
    onClose();
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const form = document.getElementById("confirm-booking-form");
    if (form && !form.contains(event.target as Node)) {
      setExit(true);
    }
  };

  if (!isVisible || !mounted) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
      <div className="absolute inset-0" onClick={handleOverlayClick}></div>
      <div id="confirm-booking-form" className="relative grid grid-cols-[62%_37%] w-[60%] h-[70%] gap-3">
        <div className="px-10 py-10 bg-[#1D1B1B] rounded-xl border border-white border-opacity-50 h-[80%] my-auto">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label className="text-2xl">Email:</label>
              <input
                type="text"
                className={`rounded px-2 py-2 my-2 bg-[#282525] ${errors.email ? "border-2 border-red-500" : ""}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="text-red-500">{errors.email}</span>}
            </div>
            <h5 className="text-2xl">Credit/Debit Card:</h5>
            <div className="flex flex-col">
              <label className="text-xl">Card Number:</label>
              <input
                type="text"
                className={`rounded px-2 py-2 my-2 bg-[#282525] ${errors.cardNumber ? "border-2 border-red-500" : ""}`}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
              {errors.cardNumber && <span className="text-red-500">{errors.cardNumber}</span>}
            </div>
            <div className="grid grid-cols-2 gap-10">
              <div className="flex flex-col">
                <label className="text-xl">Expiry Date:</label>
                <input
                  type="text"
                  className={`rounded px-2 py-2 my-2 bg-[#282525] ${errors.expiryDate ? "border-2 border-red-500" : ""}`}
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
                {errors.expiryDate && <span className="text-red-500">{errors.expiryDate}</span>}
              </div>
              <div className="flex flex-col">
                <label className="text-xl">CVV:</label>
                <input
                  type="text"
                  className={`rounded px-2 py-2 my-2 bg-[#282525] ${errors.cvv ? "border-2 border-red-500" : ""}`}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
                {errors.cvv && <span className="text-red-500">{errors.cvv}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="px-10 py-10 bg-[#1D1B1B] rounded-xl border border-white border-opacity-50">
          <div>
            <div className="grid grid-cols-[40%_60%] mb-5">
              <Image src={posterurl} alt={movieTitle} width={500} height={750} objectFit="cover" />
              <div className="ml-5 flex flex-col gap-5">
                <h5 className="text-xl">{movieTitle}</h5>
                <h5 className="text-md">{time} | {date}</h5>
              </div>
            </div>
            <div className="bg-[#474343] h-[1px] w-[80%] mx-auto"></div>
          </div>

          <div className="w-full h-[200px] grid grid-cols-2 gap-2 py-5">
            <h5>Seat:</h5>
            <h5>{Object.keys(bookingDetails.selectedSeats).join(", ")}</h5>

            <h5>Format:</h5>
            <h5>2D</h5>

            <h5>Hall:</h5>
            <h5>5</h5>

            <h5>Cinema:</h5>
            <h5>AEON MALL MEANCHEY</h5>
          </div>

          <div className="bg-[#474343] h-[1px] w-[80%] mx-auto"></div>
          <div className="mt-7 bg-[#474343] w-full h-[50px] py-3 rounded-xl">
            <div className="grid grid-cols-2 mx-5">
              <h5 className="text-[18px]">Total</h5>
              <h5 className="text-[18px] text-[#FF0000] text-right">3.50$</h5>
            </div>
          </div>
          <div
            className="mt-3 w-[50%] h-[50px] py-3 rounded-2xl mx-auto transition-all duration-300 bg-[#FF0000] hover:bg-[#CC0000] active:scale-95 cursor-pointer"
            onClick={handleConfirm}
          >
            <h5 className="text-[18px] text-center">Confirm</h5>
          </div>
        </div>
      </div>
      {/* Exit Confirmation Modal */}
      {exit && (
        <ExitConfirmation
          isVisible={exit}
          onClose={handleCancel}
          onConfirm={handleExitConfirm}
        />
      )}
    </div>
  );
}
