import { useState, useEffect } from "react";
import { FiMail, FiEdit, FiX } from "react-icons/fi";
import colors from "../../../utils/color";
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
  const [emailStep, setEmailStep] = useState(1); // 1: Enter email, 2: Enter code

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
      <div
        className="rounded-lg p-4 shadow-sm"
        style={{
          background: isDark ? "#1F2937" : colors.white,
          border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{
                background: isDark
                  ? "rgba(59, 130, 246, 0.2)"
                  : "rgba(59, 130, 246, 0.1)",
              }}
            >
              <FiMail className="w-3.5 h-3.5" style={{ color: colors.blueMid }} />
            </div>
            <h3
              className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}
            >
              Email Address
            </h3>
          </div>
          <button
            onClick={openEditModal}
            className={`p-1.5 rounded-md transition-all hover:scale-110 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            title="Change email"
          >
            <FiEdit
              className="w-3.5 h-3.5"
              style={{ color: isDark ? colors.blueLight : colors.blueMid }}
            />
          </button>
        </div>
        <p
          className={`text-sm break-all ${isDark ? "text-gray-300" : "text-gray-700"}`}
        >
          {user.email}
        </p>
      </div>

      {/* Edit Email Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 transition-opacity duration-300 opacity-100"
          aria-hidden={false}
        >
          <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{
              background: `${isDark ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 0, 0, 0.7)"}`,
            }}
            onClick={handleModalClose}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-email-modal-title"
            className="relative w-full max-w-md rounded-lg shadow-lg p-4"
            style={{
              background: isDark ? "#1F2937" : colors.white,
              border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                id="edit-email-modal-title"
                className={`text-lg font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
              >
                {emailStep === 1 ? "Change Email" : "Verify Email"}
              </h2>
              <button
                type="button"
                onClick={handleModalClose}
                className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}
                aria-label="Close modal"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {emailStep === 1 ? (
              <>
                <div className="mb-6">
                  <label
                    htmlFor="newEmail"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    New Email Address
                  </label>
                  <input
                    id="newEmail"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none ${
                      isDark
                        ? "bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    }`}
                    placeholder="Enter new email address"
                    disabled={isUpdating}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isUpdating) {
                        handleRequestEmailChange();
                      }
                    }}
                  />
                  <p
                    className={`mt-2 text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    We'll send a verification code to this email via EmailJS
                  </p>
                  {updateError && (
                    <p className="mt-2 text-sm text-red-500">{updateError}</p>
                  )}
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className={`px-5 py-2.5 rounded-lg font-medium transition hover:opacity-80 ${
                      isDark
                        ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleRequestEmailChange}
                    className={`px-5 py-2.5 rounded-lg font-medium transition hover:opacity-90 ${
                      isUpdating ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    style={{
                      background: isDark ? colors.blueDark : colors.blueLight,
                      color: colors.textLight,
                    }}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Sending..." : "Send Code"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label
                    htmlFor="verificationCode"
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Verification Code
                  </label>
                  <input
                    id="verificationCode"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none font-mono text-center text-2xl tracking-widest ${
                      isDark
                        ? "bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    }`}
                    placeholder="000000"
                    maxLength={6}
                    disabled={isUpdating}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isUpdating) {
                        handleVerifyEmailChange();
                      }
                    }}
                  />
                  <p
                    className={`mt-2 text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Enter the 6-digit code sent to {newEmail}
                  </p>
                  {updateError && (
                    <p className="mt-2 text-sm text-red-500">{updateError}</p>
                  )}
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setEmailStep(1)}
                    className={`px-5 py-2.5 rounded-lg font-medium transition hover:opacity-80 ${
                      isDark
                        ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                    disabled={isUpdating}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyEmailChange}
                    className={`px-5 py-2.5 rounded-lg font-medium transition hover:opacity-90 ${
                      isUpdating ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    style={{
                      background: isDark ? colors.blueDark : colors.blueLight,
                      color: colors.textLight,
                    }}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Verifying..." : "Verify"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DisplayEmail;
