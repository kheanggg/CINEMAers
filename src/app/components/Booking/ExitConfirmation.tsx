import React from 'react';

interface ExitConfirmationProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function ExitConfirmation({ isVisible, onClose, onConfirm }: ExitConfirmationProps) {
    
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-[#1D1B1B] p-6 rounded-xl border border-white border-opacity-50 w-[400px]">
                <h3 className="text-xl mb-4">Exit Confirmation</h3>
                <p className="mb-6">Are you sure you want to exit? Your seat selection will be lost.</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-[#FF0000] rounded hover:bg-[#CC0000] transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}