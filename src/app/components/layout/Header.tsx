"use client";
import * as React from 'react';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import Link from "next/link";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import axios from 'axios';
import {
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
  Popover,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button
} from "@mui/material";

// Newsletter Subscription Modal Component
interface NewsletterModalProps {
  open: boolean;
  onClose: () => void;
  onSubscribe: (email: string) => Promise<void>;
}

const NewsletterModal: React.FC<NewsletterModalProps> = ({
  open,
  onClose,
  onSubscribe
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await axios.post('/api/subscribe', { email });

      if (response.data.success) {
        setErrorMessage('Successfully subscribed!');
      } else {
        setErrorMessage('Failed to subscribe');
      }
      setEmail('');
      onClose();
    } catch (error) {
      setErrorMessage('Subscription failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          padding: '16px',
          backgroundColor: 'black',
          color: 'white',
          width: '50vh'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 600 }}>
        Subscribe to Newsletter
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="email"
            id="emailInput"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2 border ${errorMessage
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
              } rounded-md focus:outline-none focus:ring-2`}
            placeholder="Email Address"
            required
          />
          {errorMessage && (
            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{
              textTransform: 'none',
              padding: '12px',
              backgroundColor: '#E61414',
              '&:hover': {
                backgroundColor: '#CC1414',
                opacity: 0.9
              }
            }}
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Define types for the countries
interface Country {
  flag: string;
}

const ResponsiveAppBar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [hasNotification, setHasNotification] = useState(true);
  const [language, setLanguage] = useState<string>("EN");
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setHasNotification(false);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    setLanguage(event.target.value);
  };

  const handleNotificationAction = (message: string) => {
    if (message.includes("newsletter")) {
      setIsNewsletterModalOpen(true);
      handleNotificationClose();
    } else {
      alert(`Notification clicked: ${message}`);
    }
  };

  const handleSubscribe = async (email: string) => {
    // Implement your newsletter subscription logic here
    console.log('Subscribing with email:', email);
    // Simulating an API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    // You would typically call your actual subscription API here
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

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
            {/* Notification */}
            <div className="relative">
              <IconButton
                size="large"
                sx={{
                  backgroundColor: '#414040 !important',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#414040',
                  },
                }}
                onClick={handleNotificationClick}
              >
                <NotificationsIcon sx={{ fill: 'white' }} />
              </IconButton>
              {hasNotification && (
                <div
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    width: "10px",
                    height: "10px",
                    backgroundColor: "red",
                    borderRadius: "50%",
                    boxShadow: "0 0 4px rgba(0, 0, 0, 0.3)",
                  }}
                ></div>
              )}
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleNotificationClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <div style={{ padding: '16px', maxWidth: '250px' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Notifications
                  </Typography>
                  {/* Example notifications */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div
                      style={{ borderBottom: '1px solid #ddd', padding: '8px 0', cursor: 'pointer' }}
                    >
                      <Typography variant="body2">New feature: Khmer Language is now available!</Typography>
                    </div>
                    <div
                      style={{ padding: '8px 0', cursor: 'pointer' }}
                      onClick={() => handleNotificationAction("Subscribe to our newsletter for updates.")}
                    >
                      <Typography variant="body2">Subscribe to our newsletter for updates.</Typography>
                    </div>
                  </div>
                </div>
              </Popover>
            </div>

            {/* Favorite */}
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

            <FormControl sx={{ width: "70px" }}>
              <Select
                labelId="language-select-label"
                id="language-select"
                value={language}
                label="Language"
                onChange={handleLanguageChange}
                IconComponent={(props) => (
                  <ArrowDropDownIcon {...props} sx={{ color: "white !important" }} />
                )}
                sx={{
                  height: "50px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
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

      {/* Newsletter Subscription Modal */}
      <NewsletterModal
        open={isNewsletterModalOpen}
        onClose={() => setIsNewsletterModalOpen(false)}
        onSubscribe={handleSubscribe}
      />
    </div>
  );
};

export default ResponsiveAppBar;