import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useUser } from "../../../utils/UserContext/UserContext";
import { useNotification } from "../../../utils/Notification";
import { requestEmailChange, verifyEmailChange } from "../../../utils/BackendCalls/authService";
import { sendVerificationEmail } from "../../../utils/emailService";

const DisplayEmail = ({ user, isDark }) => {
  const { refreshUser } = useUser();
  const { showSuccess, showError } = useNotification();
  const [showEditModal, setShowEditModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [emailStep, setEmailStep] = useState(1);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showEditModal) {
        handleModalClose();
      }
    };

    if (showEditModal) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [showEditModal]);

  const handleRequestEmailChange = async () => {
    if (!newEmail.trim() || !newEmail.includes("@")) {
      setUpdateError("Please enter a valid email address");
      return;
    }

    setIsUpdating(true);
    setUpdateError("");

    try {
      const response = await requestEmailChange(newEmail.trim());
      const code = response.code;
      await sendVerificationEmail(newEmail.trim(), code, user.displayName);
      showSuccess(`Verification code sent to ${newEmail}`);
      setEmailStep(2);
    } catch (error) {
      setUpdateError(error.message || "Failed to send verification code");
      showError(error.message || "Failed to send verification code");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleVerifyEmailChange = async () => {
    if (!verificationCode.trim()) {
      setUpdateError("Please enter the verification code");
      return;
    }

    setIsUpdating(true);
    setUpdateError("");

    try {
      await verifyEmailChange(verificationCode.trim());
      await refreshUser();
      setShowEditModal(false);
      setNewEmail("");
      setVerificationCode("");
      setEmailStep(1);
      showSuccess("Email updated successfully!");
    } catch (error) {
      setUpdateError(error.message || "Failed to verify email");
      showError(error.message || "Failed to verify email");
    } finally {
      setIsUpdating(false);
    }
  };

  const openEditModal = () => {
    setNewEmail("");
    setVerificationCode("");
    setUpdateError("");
    setEmailStep(1);
    setShowEditModal(true);
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    setNewEmail("");
    setVerificationCode("");
    setEmailStep(1);
    setUpdateError("");
  };

  return (
    <>
      {/* Settings row */}
      <div
        className={`flex items-center justify-between px-4 py-3 transition-colors ${
          isDark ? "hover:bg-[#1C2128]" : "hover:bg-gray-50"
        }`}
        style={{ borderBottom: `1px solid ${isDark ? "#21262D" : "#EAEEF2"}` }}
      >
        <div className="flex-1 min-w-0">
          <label className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            Email
          </label>
          <p className={`text-xs mt-0.5 truncate ${isDark ? "text-gray-200" : "text-gray-900"}`}>
            {user.email}
          </p>
        </div>
        <button
          onClick={openEditModal}
          className={`ml-4 px-2.5 py-0.5 rounded-md text-[10px] font-medium transition-colors border shrink-0 ${
            isDark
              ? "border-gray-600 text-gray-300 hover:bg-gray-700 bg-[#21262D]"
              : "border-gray-300 text-gray-600 hover:bg-gray-100 bg-white"
          }`}
        >
          Edit
        </button>
      </div>

      {/* Edit Email Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 transition-opacity duration-300 opacity-100"
          aria-hidden={false}
        >
          <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{ background: isDark ? "rgba(1,4,9,0.85)" : "rgba(0,0,0,0.5)" }}
            onClick={handleModalClose}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md rounded-xl shadow-2xl"
            style={{
              background: isDark ? "#161B22" : "#FFFFFF",
              border: `1px solid ${isDark ? "#30363D" : "#D0D7DE"}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{ borderBottom: `1px solid ${isDark ? "#21262D" : "#D0D7DE"}` }}
            >
              <h2 className={`text-base font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                {emailStep === 1 ? "Change email address" : "Verify email"}
              </h2>
              <button
                type="button"
                onClick={handleModalClose}
                className={`p-1.5 rounded-md transition-colors ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
                aria-label="Close"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              {emailStep === 1 ? (
                <>
                  <label
                    htmlFor="newEmail"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    New email address
                  </label>
                  <input
                    id="newEmail"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className={`w-full px-3 py-2 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark
                        ? "bg-[#0D1117] border border-gray-600 text-gray-200"
                        : "bg-white border border-gray-300 text-gray-900"
                    }`}
                    placeholder="you@example.com"
                    disabled={isUpdating}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isUpdating) handleRequestEmailChange();
                    }}
                  />
                  <p className={`mt-1.5 text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    We&#39;ll send a verification code to this email
                  </p>
                  {updateError && (
                    <p className="mt-2 text-sm text-red-500">{updateError}</p>
                  )}
                </>
              ) : (
                <>
                  <label
                    htmlFor="verificationCode"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Verification code
                  </label>
                  <input
                    id="verificationCode"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className={`w-full px-3 py-2 rounded-md font-mono text-center text-xl tracking-[0.3em] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark
                        ? "bg-[#0D1117] border border-gray-600 text-gray-200"
                        : "bg-white border border-gray-300 text-gray-900"
                    }`}
                    placeholder="000000"
                    maxLength={6}
                    disabled={isUpdating}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isUpdating) handleVerifyEmailChange();
                    }}
                  />
                  <p className={`mt-1.5 text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    Enter the 6-digit code sent to {newEmail}
                  </p>
                  {updateError && (
                    <p className="mt-2 text-sm text-red-500">{updateError}</p>
                  )}
                </>
              )}
            </div>

            <div
              className="px-5 py-3 flex gap-2 justify-end"
              style={{ borderTop: `1px solid ${isDark ? "#21262D" : "#D0D7DE"}` }}
            >
              <button
                type="button"
                onClick={emailStep === 1 ? handleModalClose : () => setEmailStep(1)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                  isDark
                    ? "border-gray-600 text-gray-200 hover:bg-gray-700 bg-[#21262D]"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
                }`}
                disabled={isUpdating}
              >
                {emailStep === 1 ? "Cancel" : "Back"}
              </button>
              <button
                type="button"
                onClick={emailStep === 1 ? handleRequestEmailChange : handleVerifyEmailChange}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${
                  isUpdating ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
                }`}
                style={{ background: "#238636" }}
                disabled={isUpdating}
              >
                {isUpdating
                  ? emailStep === 1 ? "Sending..." : "Verifying..."
                  : emailStep === 1 ? "Send code" : "Verify"
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DisplayEmail;
