import { useEffect } from "react";

export default function Modal({ children, isOpen, handleClose }) {
    useEffect(() => {
    const closeOnEscapeKey = e => e.key === "Escape" ? handleClose() : null;
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [handleClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
        document.body.style.overflow = "unset"; // Reset overflow when modal is closed
    };
  }, [isOpen])

    if (!isOpen) return null;

  return (
    <div>
        <div className="fixed inset-0 bg-gray-700/50 z-50 flex items-center justify-center">
            <div className=" shadow-lg max-w-md w-full mx-10">
                {children}
            </div>
        </div>
    </div>
  );
}