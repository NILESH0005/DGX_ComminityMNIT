import React, { useState, useRef, useEffect, useContext } from "react";
import ApiContext from "../context/ApiContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const OtpModal = ({ isOpen, onClose, mobile, userId, password }) => {
  const { fetchData } = useContext(ApiContext);

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef([]);
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  const maxAttempts = 3;

  /* ================= TIMER ================= */

  useEffect(() => {
    if (!isOpen) return;

    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isOpen]);

  /* ================= OTP CHANGE ================= */

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  /* ================= BACKSPACE ================= */

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  /* ================= PASTE ================= */

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 4);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    setOtp([...newOtp, "", "", "", ""].slice(0, 4));
  };

  /* ================= VERIFY OTP ================= */

  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 4) {
      return Swal.fire("Warning", "Enter 4 digit OTP", "warning");
    }

    if (attempts >= maxAttempts) {
      return Swal.fire(
        "Blocked",
        "Maximum attempts reached. Please resend OTP.",
        "error",
      );
    }

    if (verifying) return; // prevents double click

    setVerifying(true);

    try {
      const res = await fetchData("user/verify-otp", "POST", {
        UserID: userId,
        otp: otpCode,
      });

      if (res.success) {
        onClose();

        navigate("/otp-success", {
          state: { regNumber: res?.data?.regNumber },
        });
      } else {
        if (res.blocked) {
          setIsBlocked(true);
          setAttempts(res.attempts || maxAttempts);
          setCanResend(false);

          Swal.fire({
            icon: "error",
            title: "User Blocked",
            text: res.message,
          });

          return;
        }

        const newAttempts = res.attempts ?? attempts + 1;
        setAttempts(newAttempts);

        Swal.fire({
          icon: "error",
          title: "Invalid OTP",
          text: `Attempts left: ${maxAttempts - newAttempts}`,
        });
      }
    } catch {
      Swal.fire("Error", "Verification failed", "error");
    } finally {
      setVerifying(false);
    }
  };

  const resendOtp = async () => {
    try {
      await fetchData("user/resend-otp", "POST", { mobile });

      setTimer(30);
      setCanResend(false);
      setAttempts(0);
      setOtp(["", "", "", ""]);

      Swal.fire("Sent", "New OTP sent successfully", "success");
    } catch {
      Swal.fire("Error", "Failed to resend OTP", "error");
    }
  };
  useEffect(() => {
    if (isOpen) {
      setAttempts(0);
      setOtp(["", "", "", ""]);
      setTimer(30);
      setCanResend(false);

      setTimeout(() => {
        inputs.current[0]?.focus();
      }, 200);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px] text-center">
        <h2 className="text-xl font-semibold mb-6">Enter OTP</h2>

        {/* OTP INPUTS */}
        <div className="flex justify-center gap-3 mb-4" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              type="text"
              value={digit}
              maxLength="1"
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`w-12 h-12 text-center text-xl border rounded-lg ${
                attempts > 0 ? "border-red-400" : "border-gray-300"
              }`}
            />
          ))}
        </div>

        {attempts > 0 && attempts < maxAttempts && (
          <p className="text-red-500 text-sm mb-3">
            Incorrect OTP. Attempts left: {maxAttempts - attempts}
          </p>
        )}
        {isBlocked && (
          <p className="text-red-600 text-sm mb-3 font-semibold">
            User blocked due to multiple OTP attempts. Please contact
            administrator.
          </p>
        )}

        {attempts >= maxAttempts && (
          <p className="text-red-600 text-sm mb-3 font-semibold">
            Maximum attempts reached. Please resend OTP.
          </p>
        )}

        <button
          onClick={handleVerify}
          disabled={isBlocked || verifying}
          className={`w-full py-2 rounded-lg mb-3 text-white ${
            isBlocked || verifying
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-DGXgreen"
          }`}
        >
          {verifying ? "Verifying..." : "Verify OTP"}
        </button>

        {isBlocked ? (
          <p className="text-red-600 text-sm font-semibold">
            OTP verification blocked for 30 minutes
          </p>
        ) : !canResend ? (
          <p className="text-gray-500 text-sm">Resend OTP in {timer}s</p>
        ) : (
          <button onClick={resendOtp} className="text-DGXgreen font-semibold">
            Resend OTP
          </button>
        )}
        <button
          onClick={onClose}
          className="block w-full mt-4 text-sm text-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default OtpModal;
