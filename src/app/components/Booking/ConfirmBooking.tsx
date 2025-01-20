import React, { useState, useEffect } from "react";
import Image from "next/image";

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

  // Track if the component is mounted to avoid issues with SSR in Next.js
  const [mounted, setMounted] = useState(false);

  // State for input fields
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Default valid values
  const validCardNumber = "1234567890123456";
  const validExpiryDate = "12/34";
  const validCvv = "123";

  // Validation function
  const isValidInput =
    cardNumber === validCardNumber &&
    expiryDate === validExpiryDate &&
    cvv === validCvv;

  // Only run on the client side (after initial render)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isVisible || !mounted) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const modal = document.getElementById("seat-selection-modal");
      if (modal && !modal.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isVisible, mounted, onClose]);

  useEffect(() => {
    if (!isVisible) {
      setCardNumber("");
      setExpiryDate("");
      setCvv("");
    }
  }, [isVisible]);

  if (!isVisible || !mounted) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
      <div
        id="seat-selection-modal"
        className="grid grid-cols-[62%_37%] w-[60%] h-[70%] gap-3"
      >
        <div className="px-10 py-10 bg-[#1D1B1B] rounded-xl border border-white border-opacity-50 h-[70%] my-auto">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label className="text-2xl">Email:</label>
              <input
                type="text"
                className="rounded px-2 py-2 my-2 bg-[#282525]"
              />
            </div>
            <h5 className="text-2xl">Credit/Debit Card:</h5>
            <div className="flex flex-col">
              <label className="text-xl">Card Number:</label>
              <input
                type="text"
                className="rounded px-2 py-2 my-2 bg-[#282525]"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>
            <div>
              <div className="grid grid-cols-2 gap-10">
                <div className="flex flex-col">
                  <label className="text-xl">Expiry Date:</label>
                  <input
                    type="text"
                    className="rounded px-2 py-2 my-2 bg-[#282525]"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xl">CVV:</label>
                  <input
                    type="text"
                    className="rounded px-2 py-2 my-2 bg-[#282525]"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-10 py-10 bg-[#1D1B1B] rounded-xl border border-white border-opacity-50">
          <div>
            <div className="grid grid-cols-[40%_60%] mb-5">
              <Image
                src={posterurl}
                alt={movieTitle}
                width={500} // You can set a width that fits your design
                height={750} // You can set a height that fits your design
                objectFit="cover" // You can adjust the fit property based on your need
              />

              <div className="ml-5 flex flex-col gap-5">
                <h5 className="text-xl">{movieTitle}</h5>
                <h5 className="text-md">
                  {time} | {date}
                </h5>
              </div>
            </div>

            <div className="bg-[#474343] h-[1px] w-[80%] mx-auto"></div>
          </div>

          <div className="w-full h-[200px]">
            <div className="grid grid-cols-2 gap-2 py-5">
              <h5>Seat:</h5>
              <h5>{Object.keys(bookingDetails.selectedSeats).join(", ")}</h5>

              <h5>Format:</h5>
              <h5>2D</h5>

              <h5>Hall:</h5>
              <h5>5</h5>

              <h5>Cinema:</h5>
              <h5>AEON MALL MEANCHEY</h5>
            </div>
          </div>

          <div>
            <div className="bg-[#474343] h-[1px] w-[80%] mx-auto"></div>
            <div className="mt-7 bg-[#474343] w-full h-[50px] py-3 rounded-xl">
              <div className="grid grid-cols-2 mx-5">
                <h5 className="text-[18px]">Total</h5>
                <h5 className="text-[18px] text-[#FF0000] text-right">3.50$</h5>
              </div>
            </div>
            <div
              className="mt-3 w-[50%] h-[50px] py-3 rounded-2xl mx-auto transition-all duration-300 bg-[#FF0000] hover:bg-[#CC0000] active:scale-95 cursor-pointer"
              onClick={() => {
                if (isValidInput) {
                  onClose();
                  setShowSuccessfulBooking(true);
                } else {
                  alert(
                    "Invalid payment information. Please check your Card Number, Expiry Date, and CVV."
                  );
                }
              }}
            >
              <h5 className="text-[18px] text-center">Confirm</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
