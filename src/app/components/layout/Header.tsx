"use client";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import Link from "next/link";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { MenuItem, FormControl, Select, SelectChangeEvent } from "@mui/material";
import { useState } from 'react';

// Define types for the countries
interface Country {
  flag: string;
}

const ResponsiveAppBar: React.FC = () => {
  const [language, setLanguage] = useState<string>("EN"); // Default language is English

  const handleChange = (event: SelectChangeEvent<string>) => {
    setLanguage(event.target.value); // The value will already be a string
  };

  // Define country flags for languages
  const countries: { [key: string]: Country } = {
    EN: {
      flag: "https://flagcdn.com/w320/gb.png", // UK flag for English
    },
    KH: {
      flag: "https://flagcdn.com/w320/kh.png", // Cambodia flag
    },
  };

  return (
    <div className="relative w-full">
      <AppBar
        position="absolute"
        sx={{
          backgroundColor: 'transparent',
          boxShadow: '0',
        }}
        className="mx-auto xs:w-[360px] sm:w-[390px] md:w-[750px] lg:w-[900px] xl:w-[1125px] top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <Toolbar className="px-0 justify-between">
          <Link href="/login" className="flex gap-3">
            <IconButton
              size="large"
              sx={{
                backgroundColor: '#414040 !important',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#414040',
                },
              }}
            >
              <PersonIcon sx={{ fill: 'white' }} />
            </IconButton>
            <span className="text-xl flex justify-center items-center">LOG IN</span>
          </Link>

          <div className="flex gap-3 items-center">
            <IconButton
              size="large"
              sx={{
                backgroundColor: '#414040 !important',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#414040',
                },
              }}
            >
              <NotificationsIcon sx={{ fill: 'white' }} />
            </IconButton>

            <IconButton
              size="large"
              sx={{
                backgroundColor: '#414040 !important',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#414040',
                },
              }}
            >
              <StarIcon sx={{ fill: 'white' }} />
            </IconButton>

            {/* Flag Image */}
            <img
              src={countries[language].flag}
              alt={`${language} Flag`}
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />

            {/* Language Dropdown */}
            <FormControl sx={{ width: "70px" }}>
              <Select
                labelId="language-select-label"
                id="language-select"
                value={language}
                label="Language"
                onChange={handleChange}
                IconComponent={(props) => (
                  <ArrowDropDownIcon {...props} sx={{ color: "white !important" }} />
                )}
                sx={{
                  height: "50px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none", // Remove the outline
                  },
                  color: "white",
                }}
              >
                <MenuItem value="EN">EN</MenuItem>
                <MenuItem value="KH">KH</MenuItem>
              </Select>
            </FormControl>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default ResponsiveAppBar;