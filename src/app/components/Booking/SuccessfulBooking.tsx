import { useEffect } from "react";
import DoneIcon from "@mui/icons-material/Done";

interface SuccessfulBooking {
    isVisible: boolean;
    onClose: () => void;
}

export default function SuccessfulBooking({ isVisible, onClose }: SuccessfulBooking) {
    // Automatically close after 4 seconds when visible
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 2500);

            // Cleanup timeout when component unmounts or visibility changes
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
            <div className="w-[60%] h-[50%] flex flex-col items-center justify-center">
                <div className="h-full w-full bg-[#1D1B1B] rounded-xl border border-white border-opacity-50 flex flex-col items-center justify-center gap-3">
                    <div className="bg-[#FF0000] rounded-full h-[75px] w-[75px] flex items-center justify-center">
                        <div>
                            <DoneIcon className="text-[50px] text-white" />
                        </div>
                    </div>
                    <h5 className="text-xl">PAYMENT SUCCESSFUL!</h5>
                    <h5>Please check your email for more detail.</h5>
                </div>
            </div>
        </div>
    );
}
