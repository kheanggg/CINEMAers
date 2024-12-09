import React from 'react'
import PlaceIcon from '@mui/icons-material/Place';
import Button from '@mui/material/Button';

export default function ShowTime() {
  return (
    <div className='my-8'>
      <h3 className="font-thin text-3xl">
        Showtime
      </h3>
      <div className='mt-10'>
        <div className='flex'>
          <PlaceIcon sx={{ color: 'red', fontSize: 30 }}/>
          <h4 className="font-thin text-md">AEON MALL MEANCHEY (LEGEND CINEMA)</h4>
        </div>
        <div className = 'grid grid-cols-5 gap-1 w-[50%]'>
          {Array.from({ length: 10 }).map((_, index) => (
            <div className='mt-2' key={index}>
              <Button
                variant="outlined"
                sx={{
                  width: '100px',
                  fontSize: '15px' ,
                  color: 'white',
                  borderColor: 'white',
                  borderRadius: '10px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'white',
                  },
                }}
              >
                12:12
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className='mt-10'>
        <div className='flex'>
          <PlaceIcon sx={{ color: 'red', fontSize: 30 }}/>
          <h4 className="font-thin text-md">THE OLYMPIA MALL (LEGEND CINEMA)</h4>
        </div>
        <div className = 'grid grid-cols-5 gap-1 w-[50%]'>
          {Array.from({ length: 7 }).map((_, index) => (
            <div className='mt-2' key={index}>
              <Button
                variant="outlined"
                sx={{
                  width: '100px',
                  fontSize: '15px' ,
                  color: 'white',
                  borderColor: 'white',
                  borderRadius: '10px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'white',
                  },
                }}
              >
                12:12
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className='mt-10'>
        <div className='flex'>
          <PlaceIcon sx={{ color: 'red', fontSize: 30 }}/>
          <h4 className="font-thin text-md">SHOPPING SORYA CENTER (MAJOR CINEPLEX)</h4>
        </div>
        <div className = 'grid grid-cols-5 gap-1 w-[50%]'>
          {Array.from({ length: 5 }).map((_, index) => (
            <div className='mt-2' key={index}>
              <Button
                variant="outlined"
                sx={{
                  width: '100px',
                  fontSize: '15px' ,
                  color: 'white',
                  borderColor: 'white',
                  borderRadius: '10px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'white',
                  },
                }}
              >
                12:12
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
