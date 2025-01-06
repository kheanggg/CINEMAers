import React from 'react';

interface NoSeatSelectedProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function NoSeatSelected({ isVisible, onClose }: NoSeatSelectedProps) {
    
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-[#1D1B1B] p-6 rounded-xl border border-white border-opacity-50 w-[400px]">
                <h3 className="text-xl mb-4">No Seat Were Selected</h3>
                <p className="mb-6">Please select a seat.</p>
                <div className="flex justify-end gap-4">
                    <button
                        className="px-4 py-2 bg-[#FF0000] rounded hover:bg-[#CC0000] transition-colors"
                        onClick={onClose}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}