import React, { useEffect, useState } from "react";
import ChairIcon from "@mui/icons-material/Chair";
import ExitConfirmation from "./ExitConfirmation";

interface SeatSelectionProps {
  isVisible: boolean;
  onClose: () => void;
  setShowConfirmBooking: React.Dispatch<React.SetStateAction<boolean>>;
  bookingDetails: BookingDetails;
  setSelectedSeats2: (selectedSeats: { [key: string]: boolean }) => void;
}

interface BookingDetails {
  movieTitle: string;
  time: string;
  date: string;
  format: string;
  hall: number;
  cinema: string;
}

export default function SeatSelection({
  isVisible,
  onClose,
  setShowConfirmBooking,
  bookingDetails,
  setSelectedSeats2,
}: SeatSelectionProps) {
  const rows = 7;
  const columns = 13;
  const labels = ["G", "F", "E", "D", "C", "B", "A"];
  const { movieTitle, time, date, hall } = bookingDetails;

  const [mounted, setMounted] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<{
    [key: string]: boolean;
  }>({});
  const [exit, setExit] = useState(false); // Control the confirmation popup
  const [noSeatSelected, setNoSeatSelected] = useState(false); // New state for no seat selected message

  const toggleSeatSelection = (row: string, col: number) => {
    const seatKey = `${row}${col}`;
    setSelectedSeats((prevSelectedSeats) => {
      const newSelectedSeats = { ...prevSelectedSeats };
      if (newSelectedSeats[seatKey]) {
        delete newSelectedSeats[seatKey];
      } else {
        newSelectedSeats[seatKey] = true;
      }
      return newSelectedSeats;
    });
  };

  // Handle confirm exit (reset seat selection or handle the exit action)
  const handleExitConfirm = () => {
    setExit(false);
    onClose();
  };

  const handleCancel = () => {
    console.log("Cancel clicked");
    setExit(false); // Cancel exit and keep the modal open
  };

  useEffect(() => {
    console.log("Exit state changed:", exit);
  }, [exit]);

  useEffect(() => {
    setMounted(true);
  }, []);

//   const [outsideClick, setOutsideClick] = useState(false);

  useEffect(() => {
    if (!isVisible) return; // If the modal is not visible, no need to add event listener

    const handleOutsideClick = (event: MouseEvent) => {
      const modal = document.getElementById("seat-selection-modal");
      const confirmationModal = document.getElementById("confirmation-modal"); // Add confirmation modal element

      // Check if the click is outside both the seat-selection modal and the confirmation modal
      if (
        modal &&
        !modal.contains(event.target as Node) &&
        (!confirmationModal ||
          !confirmationModal.contains(event.target as Node))
      ) {
        // Trigger confirmation modal when clicking outside of seat-selection modal
        setExit(true); // This should open the confirmation modal
      }
    };

    // Add the event listener only when the modal is visible
    document.addEventListener("click", handleOutsideClick);

    return () => {
      // Cleanup event listener when the component unmounts or isVisible changes
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isVisible]);

  // Reset selection when modal is not visible
  useEffect(() => {
    if (!isVisible) {
      setSelectedSeats({});
    }
  }, [isVisible]);

  if (!isVisible || !mounted) return null;

  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
        <div
          id="seat-selection-modal"
          className="grid grid-cols-[62%_37%] w-[60%] h-[70%] gap-3"
        >
          {/* Left Panel */}
          <div className="px-10 py-10 bg-[#1D1B1B] rounded-xl border border-white border-opacity-50">
            <div>
              <h3 className="text-2xl">PLEASE SELECT A SEAT</h3>
              <h5 className="text-center mt-10">Screen</h5>
              <div className="bg-[#1D1B1B] w-[80%] mt-3 mx-auto h-10 border-t-4 border-r-4 border-l-4 border-[#FF0000]"></div>
            </div>

            <div className="mt-7 grid grid-cols-[0.5fr_repeat(13,_0.5fr)_0.5fr] w-[90%] mx-auto gap-3">
              {Array.from({ length: rows }, (_, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <div className="flex justify-center items-center text-white bg-[#FF0000] rounded-[100%] h-6 w-6">
                    <span>{labels[rowIndex]}</span>
                  </div>

                  {Array.from({ length: columns }, (_, colIndex) => {
                    const seatKey = `${labels[rowIndex]}${colIndex + 1}`;
                    const isSelected = selectedSeats[seatKey];

                    return (
                      <div
                        key={seatKey}
                        onClick={() =>
                          toggleSeatSelection(labels[rowIndex], colIndex + 1)
                        }
                        className={`flex justify-center items-center cursor-pointer transition-all rounded-[50%] h-6 w-6`}
                      >
                        <ChairIcon
                          className={`text-center ${
                            isSelected ? "text-[#FF0000]" : "text-[#474343]"
                          }`}
                        />
                        <span className="fixed text-[10px]">
                          {colIndex + 1}
                        </span>
                      </div>
                    );
                  })}

                  <div className="flex justify-center items-center text-white bg-[#FF0000] rounded-[100%] h-6 w-6">
                    <span>{labels[rowIndex]}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>

            <div>
              <div className="mt-7 bg-[#474343] h-[1px] w-[55%] mx-auto"></div>
              <div className="mt-7 w-[55%] mx-auto">
                <div className="text-center">
                  <ChairIcon />
                  <h5 className="text-[12px] text-[#FF0000]">Adult Seat</h5>
                  <h5 className="text-[12px] text-[#FF0000]">3.50$</h5>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="px-10 py-10 bg-[#1D1B1B] rounded-xl border border-white border-opacity-50">
            <div>
              <h3 className="text-lg">Select Seats</h3>
              <div className="mt-9 w-full h-[110px] grid grid-cols-2">
                <h5 className="text-left text-lg text-[#FF0000]">
                  {Object.keys(selectedSeats).join(", ")}
                </h5>
                <h5 className="text-right text-lg">
                  {Object.keys(selectedSeats).length} selected
                </h5>
              </div>
              <div className="bg-[#474343] h-[1px] w-[80%] mx-auto"></div>
            </div>

            <div className="w-full h-[265px]">
              <div className="grid grid-cols-2 gap-2 py-5">
                <h5>Movie:</h5>
                <h5>{movieTitle}</h5>

                <h5>Time:</h5>
                <h5>{time}</h5>

                <h5>Date:</h5>
                <h5>{date}</h5>

                <h5>Format:</h5>
                <h5>2D</h5>

                <h5>Hall:</h5>
                <h5>{hall}</h5>

                <h5>Cinema:</h5>
                <h5>AEON MALL MEANCHEY</h5>
              </div>
            </div>

            <div>
              <div className="bg-[#474343] h-[1px] w-[80%] mx-auto"></div>
              <div className="mt-7 bg-[#474343] w-full h-[50px] py-3 rounded-xl">
                <div className="grid grid-cols-2 mx-5">
                  <h5 className="text-[18px]">Total</h5>
                  <h5 className="text-[18px] text-[#FF0000] text-right">
                    {Object.keys(selectedSeats).length * 3.5}${" "}
                    {/* Example price */}
                  </h5>
                </div>
              </div>
              <div
                className="mt-3 bg-[#FF0000] w-[50%] h-[50px] py-3 rounded-2xl mx-auto transition-all duration-300 hover:bg-[#CC0000] active:scale-95 cursor-pointer"
                onClick={() => {
                  if (Object.keys(selectedSeats).length === 0) {
                    setNoSeatSelected(true);
                  } else {
                    onClose();
                    setShowConfirmBooking(true);
                    setSelectedSeats2(selectedSeats);
                    setNoSeatSelected(false);
                  }
                }}
              >
                <h5 className="text-[18px] text-center">Confirm</h5>
              </div>
              {noSeatSelected && (
                <div className="text-center text-red-500 mt-2">
                  No seats were selected. Please select at least one seat.
                </div>
              )}
            </div>
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
