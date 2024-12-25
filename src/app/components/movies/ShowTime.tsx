import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import ChairIcon from '@mui/icons-material/Chair';
import PlaceIcon from '@mui/icons-material/Place';

interface Showtime {
  location: string;
  times: string[];
}

export default function ShowTime() {
  const [open, setOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const showtimes: Showtime[] = [
    {
      location: 'AEON MALL MEANCHEY (LEGEND CINEMA)',
      times: Array.from({ length: 10 }, (_, i) => `12:${10 + i}`),
    },
    {
      location: 'THE OLYMPIA MALL (LEGEND CINEMA)',
      times: Array.from({ length: 7 }, (_, i) => `14:${10 + i}`),
    },
    {
      location: 'SHOPPING SORYA CENTER (MAJOR CINEPLEX)',
      times: Array.from({ length: 5 }, (_, i) => `16:${10 + i}`),
    },
  ];

  const handleOpen = (time: string) => {
    setSelectedTime(time);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSeats([]);
  };

  const toggleSeatSelection = (seatNumber: number) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((seat) => seat !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const renderSeats = () => {
    const seatsPerRow = 10;  // Define 10 seats per row
    const rows = 6;  // Define 6 rows (A to F)
  
    const seatLabels = ['A', 'B', 'C', 'D', 'E', 'F']; // Row labels (6 rows)
  
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto repeat(10, 36px)', // First column for labels, 10 columns for seats
          gap: '5px', // Minimal spacing between seats
          justifyContent: 'center', // Center grid horizontally
          marginTop: '10px', // Add some space at the top
        }}
      >
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <>
            {/* Row Label */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: 'white',
                marginRight: '15px',
              }}
            >
              {seatLabels[rowIndex]} {/* Label for the row (A, B, C, etc.) */}
            </div>
  
            {/* Seats */}
            {Array.from({ length: seatsPerRow }).map((_, seatIndex) => {
              const seatLabel = `${seatLabels[rowIndex]}${seatIndex + 1}`;  // Combine row label with seat number (e.g., A1, B2)
  
              const isSelected = selectedSeats.includes(seatLabel);  // Check if the seat is selected
  
              return (
                <div
                  key={seatLabel}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '0',  // Make the seat square
                  }}
                  onClick={() => toggleSeatSelection(seatLabel)}  // Toggle seat selection
                >
                  <ChairIcon
                    sx={{
                      fontSize: 36,
                      color: isSelected ? 'red' : 'white',  // Change color when selected
                    }}
                  />
                  {/* Seat Label Text */}
                  <span
                    style={{
                      position: 'absolute',
                      fontSize: '15px',
                      fontWeight: 'bold',
                      color: isSelected ? 'white' : 'black',  // Change label color when selected
                    }}
                  >
                    {seatLabel}  {/* Display seat label (e.g., A1, B1, C2) */}
                  </span>
                </div>
              );
            })}
          </>
        ))}
      </div>
    );
  };
  

  return (
    <div className="my-8">
      <h3 className="font-thin text-3xl">Showtime</h3>
      {showtimes.map((show, index) => (
        <div key={index} className="mt-10">
          <div className="flex">
            <PlaceIcon sx={{ color: 'red', fontSize: 30 }} />
            <h4 className="font-thin text-md ml-2">{show.location}</h4>
          </div>
          <div className="grid grid-cols-5 gap-2 mt-5">
            {show.times.map((time, i) => (
              <Button
                key={i}
                variant="outlined"
                onClick={() => handleOpen(time)}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  borderRadius: '10px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'white',
                  },
                }}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      ))}

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        PaperProps={{
          style: {
            backgroundColor: '#1d1d1d',
            color: '#ffffff',
            borderRadius: '10px',
          },
        }}
      >
        <DialogTitle className='text-white text-bold'>
          Choose Seat
        </DialogTitle>
        <DialogContent>
          <div className='grid grid-cols-2'>
            <div>
              <h1 className='ml-8 text-center bg-white text-black'>Screen</h1>
              {renderSeats()}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: '#ffffff' }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              alert(`Selected Seats: ${selectedSeats.join(', ')}`);
              handleClose();
            }}
            sx={{
              backgroundColor: '#03dac6',
              color: '#121212',
              '&:hover': {
                backgroundColor: '#00c3a3',
              },
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
