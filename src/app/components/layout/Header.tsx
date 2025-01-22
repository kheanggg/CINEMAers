"use client";
import * as React from "react";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import StarIcon from "@mui/icons-material/Star";
import Link from "next/link";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import axios from "axios";
import Image from "next/image";
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
  Button,
} from "@mui/material";
import { useSession } from "next-auth/react";

// Types remain the same
interface NewsletterModalProps {
  open: boolean;
  onClose: () => void;
  onSubscribe: (email: string) => Promise<void>;
}

interface Country {
  flag: string;
}

// Newsletter Modal Component remains exactly the same
const NewsletterModal: React.FC<NewsletterModalProps> = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await axios.post("/api/subscribe", { email });
      if (response.data.success) {
        setErrorMessage("Successfully subscribed!");
      } else {
        setErrorMessage("Failed to subscribe");
      }
      setEmail("");
      onClose();
    } catch {
      setErrorMessage("Subscription failed. Please try again.");
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
          borderRadius: "12px",
          padding: "16px",
          backgroundColor: "black",
          color: "white",
          width: "50vh",
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
        Subscribe to Newsletter
      </DialogTitle>
      <DialogContent>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <input
            type="email"
            id="emailInput"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2 border ${
              errorMessage
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
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
              textTransform: "none",
              padding: "12px",
              backgroundColor: "#E61414",
              "&:hover": {
                backgroundColor: "#CC1414",
                opacity: 0.9,
              },
            }}
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Header: React.FC = () => {
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [hasNotification, setHasNotification] = useState(true);
  const [language, setLanguage] = useState<string>("EN");
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);

  const countries: { [key: string]: Country } = {
    EN: { flag: "https://flagcdn.com/w320/gb.png" },
    KH: { flag: "https://flagcdn.com/w320/kh.png" },
  };

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
    console.log("Subscribing with email:", email);
    await new Promise((resolve) => setTimeout(resolve, 1500));
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 pt-10">
        <div className="max-w-[1125px] mx-auto">
          <div className="flex justify-between items-center">
            {/* Left side - Login/Profile */}
            <div className="flex gap-3">
              {!session ? (
                <Link href="/login" className="flex gap-3">
                  <IconButton
                    size="large"
                    sx={{
                      backgroundColor: "#414040 !important",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#414040",
                      },
                    }}
                  >
                    <PersonIcon sx={{ fill: "white" }} />
                  </IconButton>
                  <span className="text-xl flex justify-center items-center">
                    LOG IN
                  </span>
                </Link>
              ) : (
                <div className="flex gap-3 items-center">
                  <Image
                    src="/default_profile.png"
                    alt="Profile"
                    width={45}
                    height={45}
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                  />
                  <span className="text-xl flex justify-center items-center">
                    {session.user?.name || "User"}
                  </span>
                </div>
              )}
            </div>

            {/* Right side - Icons and Language */}
            <div className="flex gap-3 items-center">
              {/* Notification */}
              <div className="relative">
                <IconButton
                  size="large"
                  sx={{
                    backgroundColor: "#414040 !important",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#414040",
                    },
                  }}
                  onClick={handleNotificationClick}
                >
                  <NotificationsIcon sx={{ fill: "white" }} />
                </IconButton>
                {hasNotification && (
                  <div className="absolute top-[5px] right-[5px] w-[10px] h-[10px] bg-red-500 rounded-full shadow-md" />
                )}
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleNotificationClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <div className="p-4 max-w-[250px]">
                    <Typography variant="subtitle1" gutterBottom>
                      Notifications
                    </Typography>
                    <div className="flex flex-col gap-2">
                      <div className="border-b border-gray-200 py-2 cursor-pointer">
                        <Typography variant="body2">
                          New feature: Khmer Language is now available!
                        </Typography>
                      </div>
                      <div
                        className="py-2 cursor-pointer"
                        onClick={() =>
                          handleNotificationAction(
                            "Subscribe to our newsletter for updates."
                          )
                        }
                      >
                        <Typography variant="body2">
                          Subscribe to our newsletter for updates.
                        </Typography>
                      </div>
                    </div>
                  </div>
                </Popover>
              </div>

              {/* Favorite */}
              <Link href="/favorite">
                <IconButton
                  size="large"
                  sx={{
                    backgroundColor: "#414040 !important",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#414040",
                    },
                  }}
                >
                  <StarIcon sx={{ fill: "white" }} />
                </IconButton>
              </Link>

              {/* Language Selection */}
              <Image
                src={countries[language].flag}
                alt={`${language} Flag`}
                width={45} // Original dimensions (can adjust if needed)
                height={45}
                style={{
                  width: "50px", // Adjust this to match the desired size
                  height: "40px", // Same as width to maintain aspect ratio
                  borderRadius: "50%", // For rounded appearance
                  objectFit: "cover", // Ensures the image fills the area without distortion
                }}
              />

              <FormControl sx={{ width: "70px" }}>
                <Select
                  value={language}
                  onChange={handleLanguageChange}
                  IconComponent={(props) => (
                    <ArrowDropDownIcon
                      {...props}
                      sx={{ color: "white !important" }}
                    />
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
          </div>
        </div>
      </div>

      <NewsletterModal
        open={isNewsletterModalOpen}
        onClose={() => setIsNewsletterModalOpen(false)}
        onSubscribe={handleSubscribe}
      />
    </header>
  );
};

export default Header;
