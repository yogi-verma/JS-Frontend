import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../utils/UserContext/UserContext";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";
import { useNotification } from "../../utils/Notification";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import colors from "../../utils/color";
import {
  FiMail,
  FiUser,
  FiFileText,
  FiArrowLeft,
  FiX,
  FiEdit,
  FiCamera,
} from "react-icons/fi";
import {
  updateDisplayName,
  updateBio,
  requestEmailChange,
  verifyEmailChange,
  updatePhoto,
} from "../../utils/BackendCalls/authService";
import { sendVerificationEmail, initEmailJS } from "../../utils/emailService";

const UserProfile = () => {
  const { user, refreshUser } = useUser();
  const { isDark } = useTheme();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const [showImageModal, setShowImageModal] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [showEditBioModal, setShowEditBioModal] = useState(false);
  const [showEditEmailModal, setShowEditEmailModal] = useState(false);
  const [showEditPhotoModal, setShowEditPhotoModal] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [emailStep, setEmailStep] = useState(1); // 1: Enter email, 2: Enter code

  // Initialize EmailJS on component mount
  useEffect(() => {
    initEmailJS();
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (showEditNameModal) setShowEditNameModal(false);
        else if (showEditBioModal) setShowEditBioModal(false);
        else if (showEditEmailModal) setShowEditEmailModal(false);
        else if (showEditPhotoModal) setShowEditPhotoModal(false);
        else if (showImageModal) setShowImageModal(false);
      }
    };

    if (
      showImageModal ||
      showEditNameModal ||
      showEditBioModal ||
      showEditEmailModal ||
      showEditPhotoModal
    ) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [
    showImageModal,
    showEditNameModal,
    showEditBioModal,
    showEditEmailModal,
    showEditPhotoModal,
  ]);

  const handleUpdateDisplayName = async () => {
    if (!newDisplayName.trim()) {
      setUpdateError("Display name cannot be empty");
      return;
    }

    setIsUpdating(true);
    setUpdateError("");

    try {
      await updateDisplayName(newDisplayName.trim());
      await refreshUser(); // Refresh user data to reflect changes
      setShowEditNameModal(false);
      setNewDisplayName("");
      showSuccess("Display name updated successfully!");
    } catch (error) {
      setUpdateError(error.message || "Failed to update display name");
      showError(error.message || "Failed to update display name");
    } finally {
      setIsUpdating(false);
    }
  };

  const openEditNameModal = () => {
    setNewDisplayName(user.displayName || "");
    setUpdateError("");
    setShowEditNameModal(true);
  };

  const handleUpdateBio = async () => {
    setIsUpdating(true);
    setUpdateError("");

    try {
      await updateBio(newBio.trim());
      await refreshUser(); // Refresh user data to reflect changes
      setShowEditBioModal(false);
      setNewBio("");
      showSuccess("Bio updated successfully!");
    } catch (error) {
      setUpdateError(error.message || "Failed to update bio");
      showError(error.message || "Failed to update bio");
    } finally {
      setIsUpdating(false);
    }
  };

  const openEditBioModal = () => {
    setNewBio(user.bio || "");
    setUpdateError("");
    setShowEditBioModal(true);
  };

  // ===== Email Functions =====
  const handleRequestEmailChange = async () => {
    if (!newEmail.trim() || !newEmail.includes("@")) {
      setUpdateError("Please enter a valid email address");
      return;
    }

    setIsUpdating(true);
    setUpdateError("");

    try {
      // Request verification code from backend
      const response = await requestEmailChange(newEmail.trim());

      // Backend returns the code, now send it via EmailJS
      const code = response.code;

      // Send email using EmailJS
      await sendVerificationEmail(newEmail.trim(), code, user.displayName);

      showSuccess(`Verification code sent to ${newEmail}`);
      setEmailStep(2); // Move to verification step
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
      setShowEditEmailModal(false);
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

  const openEditEmailModal = () => {
    setNewEmail("");
    setVerificationCode("");
    setUpdateError("");
    setEmailStep(1);
    setShowEditEmailModal(true);
  };

  const handleEmailModalClose = () => {
    setShowEditEmailModal(false);
    setNewEmail("");
    setVerificationCode("");
    setEmailStep(1);
    setUpdateError("");
  };

  // ===== Photo Functions =====
  const handlePhotoFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUpdateError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUpdateError("Image size must be less than 5MB");
      return;
    }

    setUpdateError("");

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPhotoUrl(reader.result); // This will be a base64 data URL
    };
    reader.onerror = () => {
      setUpdateError("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const handleUpdatePhoto = async () => {
    if (!newPhotoUrl || newPhotoUrl.trim() === "") {
      setUpdateError("Please select a photo");
      return;
    }

    setIsUpdating(true);
    setUpdateError("");

    try {
      await updatePhoto(newPhotoUrl);
      await refreshUser();
      setShowEditPhotoModal(false);
      setNewPhotoUrl("");
      showSuccess("Photo updated successfully!");
    } catch (error) {
      setUpdateError(error.message || "Failed to update photo");
      showError(error.message || "Failed to update photo");
    } finally {
      setIsUpdating(false);
    }
  };

  const openEditPhotoModal = () => {
    setNewPhotoUrl("");
    setUpdateError("");
    setShowEditPhotoModal(true);
  };

  if (!user) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ background: isDark ? "#111827" : "#F9FAFB" }}
      >
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h2
              className={`text-2xl font-bold mb-4 ${isDark ? "text-gray-100" : "text-gray-800"}`}
            >
              Please log in to view your profile
            </h2>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 rounded-lg font-medium transition hover:opacity-90"
              style={{
                background: isDark ? colors.blueDark : colors.blueLight,
                color: colors.textLight,
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getInitials = (displayName) => {
    if (!displayName) return "?";
    const names = displayName.split(" ");
    if (names.length >= 2) {
      return (
        names[0].charAt(0) + names[names.length - 1].charAt(0)
      ).toUpperCase();
    }
    return displayName.charAt(0).toUpperCase();
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: isDark ? "#111827" : "#F9FAFB" }}
    >
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className={`flex items-center gap-2 hover:cursor-pointer mb-6 px-4 py-2 rounded-lg transition-all hover:opacity-80 ${
            isDark
              ? "text-gray-300 hover:text-gray-100"
              : "text-gray-600 hover:text-gray-800"
          }`}
          style={{
            background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
          }}
        >
          <FiArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        {/* Profile Header Card */}
        <div
          className="rounded-2xl shadow-lg overflow-hidden mb-6"
          style={{
            background: isDark ? "#1F2937" : colors.white,
            border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
          }}
        >
          {/* Banner */}
          <div
            className="h-32 sm:h-40"
            style={{
              background: `linear-gradient(135deg, ${colors.blueLight} 0%, ${colors.blueMid} 50%, ${colors.blueDark} 100%)`,
            }}
          />

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-20">
              {/* Profile Photo */}
              <div className="relative group">
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt={user.displayName}
                    onClick={() => setShowImageModal(true)}
                    className={`w-30 h-30 rounded-full border-4 object-cover shadow-xl cursor-pointer transition-transform hover:scale-105 ${
                      isDark ? "border-gray-800" : "border-white"
                    }`}
                    title="Click to view full size"
                  />
                ) : (
                  <div
                    className={`w-30 h-30 rounded-full border-4 flex items-center justify-center text-4xl font-bold shadow-xl ${
                      isDark ? "border-gray-800" : "border-white"
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${colors.blueLight}, ${colors.blueMid})`,
                      color: colors.textLight,
                    }}
                  >
                    {getInitials(user.displayName)}
                  </div>
                )}
                {/* Edit Photo Button */}
                <button
                  onClick={openEditPhotoModal}
                  className={`absolute bottom-0 right-0 p-2 rounded-full shadow-lg transition-all transform hover:scale-110 ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-white hover:bg-gray-50"
                  }`}
                  style={{
                    border: `2px solid ${isDark ? "#1F2937" : colors.white}`,
                  }}
                  title="Edit photo"
                >
                  <FiCamera
                    className="w-4 h-4"
                    style={{
                      color: isDark ? colors.blueLight : colors.blueMid,
                    }}
                  />
                </button>
              </div>

              {/* Name and Basic Info */}
              <div className="flex-1 text-center sm:text-left mt-4 sm:mt-0 sm:mb-4">
                <h1
                  className={`text-3xl font-bold mb-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}
                >
                  {user.displayName}
                </h1>
                <p
                  className={`text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Display Name Card */}
          <div
            className="rounded-xl p-6 shadow-md"
            style={{
              background: isDark ? "#1F2937" : colors.white,
              border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: isDark
                      ? "rgba(96, 165, 250, 0.2)"
                      : "rgba(96, 165, 250, 0.1)",
                  }}
                >
                  <FiUser
                    className="w-5 h-5"
                    style={{ color: colors.blueLight }}
                  />
                </div>
                <h3
                  className={`text-lg font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}
                >
                  Display Name
                </h3>
              </div>
              <button
                onClick={openEditNameModal}
                className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                title="Edit display name"
              >
                <FiEdit
                  className="w-4 h-4"
                  style={{ color: isDark ? colors.blueLight : colors.blueMid }}
                />
              </button>
            </div>
            <p
              className={`text-base ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              {user.displayName || "Not set"}
            </p>
          </div>

          {/* Email Card */}
          <div
            className="rounded-xl p-6 shadow-md"
            style={{
              background: isDark ? "#1F2937" : colors.white,
              border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: isDark
                      ? "rgba(59, 130, 246, 0.2)"
                      : "rgba(59, 130, 246, 0.1)",
                  }}
                >
                  <FiMail
                    className="w-5 h-5"
                    style={{ color: colors.blueMid }}
                  />
                </div>
                <h3
                  className={`text-lg font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}
                >
                  Email Address
                </h3>
              </div>
              <button
                onClick={openEditEmailModal}
                className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                title="Change email"
              >
                <FiEdit
                  className="w-4 h-4"
                  style={{ color: isDark ? colors.blueLight : colors.blueMid }}
                />
              </button>
            </div>
            <p
              className={`text-base break-all ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              {user.email}
            </p>
          </div>

          {/* Bio Card - Full Width */}
          <div
            className="md:col-span-2 rounded-xl p-6 shadow-md"
            style={{
              background: isDark ? "#1F2937" : colors.white,
              border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: isDark
                      ? "rgba(30, 64, 175, 0.2)"
                      : "rgba(30, 64, 175, 0.1)",
                  }}
                >
                  <FiFileText
                    className="w-5 h-5"
                    style={{ color: colors.blueDark }}
                  />
                </div>
                <h3
                  className={`text-lg font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}
                >
                  Bio
                </h3>
              </div>
              <button
                onClick={openEditBioModal}
                className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                title="Edit bio"
              >
                <FiEdit
                  className="w-4 h-4"
                  style={{ color: isDark ? colors.blueLight : colors.blueMid }}
                />
              </button>
            </div>
            <p
              className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              {user.bio || "No bio added yet. Tell us about yourself!"}
            </p>
          </div>
        </div>

        {/* Account Info */}
        <div
          className="mt-6 rounded-xl p-6 shadow-md"
          style={{
            background: isDark ? "#1F2937" : colors.white,
            border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
          }}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${isDark ? "text-gray-200" : "text-gray-800"}`}
          >
            Account Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p
                className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                User ID
              </p>
              <p
                className={`text-sm mt-1 font-mono ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                {user._id || user.googleId || "N/A"}
              </p>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Account Type
                </p>
                <p
                  className={`text-sm mt-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  {user.googleId ? "Google OAuth" : "Standard"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Image Modal */}
      {user.photo && (
        <div
          className={`fixed inset-0 z-60 flex items-center justify-center p-4 transition-all duration-300 ${
            showImageModal ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden={!showImageModal}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 backdrop-blur-lg"
            style={{
              background: `${isDark ? "rgba(0, 0, 0, 0.92)" : "rgba(0, 0, 0, 0.85)"}`,
            }}
            onClick={() => setShowImageModal(false)}
            aria-hidden="true"
          />

          {/* Close Button - Fixed Position */}
          <button
            type="button"
            onClick={() => setShowImageModal(false)}
            className={`fixed top-6 right-6 p-3 rounded-full shadow-2xl transition-all duration-200 hover:scale-110 hover:rotate-90 z-[70] backdrop-blur-md ${
              isDark
                ? "bg-gray-800/80 hover:bg-gray-700/90 text-gray-100 border border-gray-600/50"
                : "bg-white/90 hover:bg-white text-gray-800 border border-gray-200"
            }`}
            aria-label="Close modal"
            title="Close (Esc)"
          >
            <FiX className="w-6 h-6" />
          </button>

          {/* Modal Content */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="image-modal-title"
            className={`relative max-w-5xl w-full mx-auto transition-transform duration-300 ${
              showImageModal ? "scale-100" : "scale-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Container */}
            <div
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: isDark ? "#1F2937" : colors.white,
                border: `2px solid ${isDark ? "#374151" : "#E5E7EB"}`,
              }}
            >
              {/* Image Wrapper */}
              <div className="relative p-4 sm:p-6">
                <img
                  src={user.photo}
                  alt={user.displayName}
                  className="w-full h-auto object-contain rounded-xl mx-auto"
                  style={{ 
                    maxHeight: "75vh",
                    boxShadow: isDark 
                      ? "0 10px 40px rgba(0, 0, 0, 0.5)" 
                      : "0 10px 40px rgba(0, 0, 0, 0.15)"
                  }}
                />
              </div>

              {/* Image Info */}
              <div
                className="px-6 py-4 border-t"
                style={{
                  borderColor: isDark ? "#374151" : "#E5E7EB",
                  background: isDark ? "#111827" : "#F9FAFB",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      id="image-modal-title"
                      className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}
                    >
                      {user.displayName}'s Profile Photo
                    </h3>
                    <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Click outside or press Esc to close
                    </p>
                  </div>
                  <button
                    className={`px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 ${
                      isDark
                        ? "bg-blue-900/50 hover:bg-blue-800/60 text-blue-200"
                        : "bg-blue-100 hover:bg-blue-200 text-blue-700"
                    }`}
                    title="Change photo"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowImageModal(false);
                      openEditPhotoModal();
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <FiCamera className="w-4 h-4" />
                      <span className="hidden sm:inline">Change Photo</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Display Name Modal */}
      <div
        className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 ${
          showEditNameModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!showEditNameModal}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 backdrop-blur-sm"
          style={{
            background: `${isDark ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 0, 0, 0.7)"}`,
          }}
          onClick={() => setShowEditNameModal(false)}
          aria-hidden="true"
        />

        {/* Modal Content */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-name-modal-title"
          className="relative w-full max-w-md rounded-xl shadow-2xl p-6"
          style={{
            background: isDark ? "#1F2937" : colors.white,
            border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <h2
              id="edit-name-modal-title"
              className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
            >
              Edit Display Name
            </h2>
            <button
              type="button"
              onClick={() => setShowEditNameModal(false)}
              className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}
              aria-label="Close modal"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Input Field */}
          <div className="mb-6">
            <label
              htmlFor="displayName"
              className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none ${
                isDark
                  ? "bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
              }`}
              placeholder="Enter your display name"
              disabled={isUpdating}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isUpdating) {
                  handleUpdateDisplayName();
                }
              }}
            />
            {updateError && (
              <p className="mt-2 text-sm text-red-500">{updateError}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setShowEditNameModal(false)}
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
              onClick={handleUpdateDisplayName}
              className={`px-5 py-2.5 rounded-lg font-medium transition hover:opacity-90 ${
                isUpdating ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{
                background: isDark ? colors.blueDark : colors.blueLight,
                color: colors.textLight,
              }}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Bio Modal */}
      <div
        className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 ${
          showEditBioModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!showEditBioModal}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 backdrop-blur-sm"
          style={{
            background: `${isDark ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 0, 0, 0.7)"}`,
          }}
          onClick={() => setShowEditBioModal(false)}
          aria-hidden="true"
        />

        {/* Modal Content */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-bio-modal-title"
          className="relative w-full max-w-md rounded-xl shadow-2xl p-6"
          style={{
            background: isDark ? "#1F2937" : colors.white,
            border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <h2
              id="edit-bio-modal-title"
              className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
            >
              Edit Bio
            </h2>
            <button
              type="button"
              onClick={() => setShowEditBioModal(false)}
              className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}
              aria-label="Close modal"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Input Field */}
          <div className="mb-6">
            <label
              htmlFor="bio"
              className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              Bio
            </label>
            <textarea
              id="bio"
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none resize-none ${
                isDark
                  ? "bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
              }`}
              placeholder="Tell us about yourself..."
              disabled={isUpdating}
              rows={5}
            />
            {updateError && (
              <p className="mt-2 text-sm text-red-500">{updateError}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setShowEditBioModal(false)}
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
              onClick={handleUpdateBio}
              className={`px-5 py-2.5 rounded-lg font-medium transition hover:opacity-90 ${
                isUpdating ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{
                background: isDark ? colors.blueDark : colors.blueLight,
                color: colors.textLight,
              }}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Email Modal */}
      {showEditEmailModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 opacity-100"
          aria-hidden={false}
        >
          <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{
              background: `${isDark ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 0, 0, 0.7)"}`,
            }}
            onClick={handleEmailModalClose}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-email-modal-title"
            className="relative w-full max-w-md rounded-xl shadow-2xl p-6"
            style={{
              background: isDark ? "#1F2937" : colors.white,
              border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                id="edit-email-modal-title"
                className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
              >
                {emailStep === 1 ? "Change Email" : "Verify Email"}
              </h2>
              <button
                type="button"
                onClick={handleEmailModalClose}
                className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}
                aria-label="Close modal"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {emailStep === 1 ? (
              /* Step 1: Enter new email */
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
                    onClick={handleEmailModalClose}
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
              /* Step 2: Enter verification code */
              <>
                <div className="mb-6">
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

      {/* Edit Photo Modal */}
      <div
        className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 ${
          showEditPhotoModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!showEditPhotoModal}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 backdrop-blur-sm"
          style={{
            background: `${isDark ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 0, 0, 0.7)"}`,
          }}
          onClick={() => setShowEditPhotoModal(false)}
          aria-hidden="true"
        />

        {/* Modal Content */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-photo-modal-title"
          className="relative w-full max-w-md rounded-xl shadow-2xl p-6"
          style={{
            background: isDark ? "#1F2937" : colors.white,
            border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <h2
              id="edit-photo-modal-title"
              className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
            >
              Edit Photo
            </h2>
            <button
              type="button"
              onClick={() => setShowEditPhotoModal(false)}
              className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}
              aria-label="Close modal"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Preview */}
          {newPhotoUrl && (
            <div className="mb-4 flex justify-center">
              <img
                src={newPhotoUrl}
                alt="Photo preview"
                className="w-32 h-32 rounded-full object-cover border-2"
                style={{ borderColor: isDark ? "#374151" : "#E5E7EB" }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}

          {/* File Upload Input */}
          <div className="mb-6">
            <label
              htmlFor="photoFile"
              className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              Select Photo
            </label>
            <input
              id="photoFile"
              type="file"
              accept="image/*"
              onChange={handlePhotoFileChange}
              className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:cursor-pointer ${
                isDark
                  ? "bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-500 file:bg-blue-900 file:text-blue-200 hover:file:bg-blue-800"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
              }`}
              disabled={isUpdating}
            />
            <p
              className={`mt-2 text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Supported formats: JPG, PNG, GIF, WebP (Max 5MB)
            </p>
            {updateError && (
              <p className="mt-2 text-sm text-red-500">{updateError}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setShowEditPhotoModal(false)}
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
              onClick={handleUpdatePhoto}
              className={`px-5 py-2.5 rounded-lg font-medium transition hover:opacity-90 ${
                isUpdating ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{
                background: isDark ? colors.blueDark : colors.blueLight,
                color: colors.textLight,
              }}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
