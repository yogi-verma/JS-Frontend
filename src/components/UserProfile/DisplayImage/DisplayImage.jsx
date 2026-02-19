import { useState, useEffect } from "react";
import { FiCamera, FiX } from "react-icons/fi";
import colors from "../../../utils/color";
import { useUser } from "../../../utils/UserContext/UserContext";
import { useNotification } from "../../../utils/Notification";
import { updatePhoto, updateStatus } from "../../../utils/BackendCalls/authService";

const DisplayImage = ({ user, isDark, getInitials }) => {
  const { refreshUser } = useUser();
  const { showSuccess, showError } = useNotification();
  const [showImageModal, setShowImageModal] = useState(false);
  const [showEditPhotoModal, setShowEditPhotoModal] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(user.status || null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  // Status options with icons and labels
  const statusOptions = [
    { value: "busy", label: "Busy", icon: "⏰", color: "#EF4444" },
    { value: "focusing", label: "Focusing", icon: "🎯", color: "#8B5CF6" },
    { value: "building", label: "Building", icon: "🔨", color: "#F59E0B" },
    { value: "optimistic", label: "Optimistic", icon: "✨", color: "#10B981" },
  ];

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (showEditPhotoModal) setShowEditPhotoModal(false);
        else if (showEditStatusModal) setShowEditStatusModal(false);
        else if (showImageModal) setShowImageModal(false);
      }
    };

    if (showImageModal || showEditPhotoModal || showEditStatusModal) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [showImageModal, showEditPhotoModal, showEditStatusModal]);

  const handlePhotoFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUpdateError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUpdateError("Image size must be less than 5MB");
      return;
    }

    setUpdateError("");

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPhotoUrl(reader.result);
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

  const openEditStatusModal = () => {
    setSelectedStatus(user.status || null);
    setUpdateError("");
    setShowEditStatusModal(true);
  };

  const handleUpdateStatus = async () => {
    setUpdateError("");
    setIsUpdating(true);

    try {
      await updateStatus(selectedStatus);
      await refreshUser();
      setShowEditStatusModal(false);
      showSuccess("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      setUpdateError(error.message || "Failed to update status");
      showError(error.message || "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getCurrentStatusInfo = () => {
    if (!user.status) return null;
    return statusOptions.find((opt) => opt.value === user.status);
  };

  const currentStatusInfo = getCurrentStatusInfo();

  return (
    <>
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
            className={`w-30 h-30 rounded-full border-4 flex items-center justify-center text-3xl font-bold shadow-xl ${
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
        
        {/* Status Badge */}
        {currentStatusInfo && (
          <button
            onClick={openEditStatusModal}
            className={`absolute bottom-0 left-0 p-1.5 rounded-full shadow-lg transition-all transform hover:scale-110 cursor-pointer ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-white hover:bg-gray-50"
            }`}
            style={{
              border: `2px solid ${isDark ? "#1F2937" : colors.white}`,
            }}
            title={`Status: ${currentStatusInfo.label} - Click to change`}
          >
            <span className="text-base leading-none">{currentStatusInfo.icon}</span>
          </button>
        )}
        
        {/* Add Status Button (when no status set) */}
        {!currentStatusInfo && (
          <button
            onClick={openEditStatusModal}
            className={`absolute bottom-0 left-0 w-6 h-6 flex items-center justify-center rounded-full shadow-lg transition-all transform hover:scale-110 text-lg ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-400"
                : "bg-white hover:bg-gray-50 text-gray-500"
            }`}
            style={{
              border: `2px solid ${isDark ? "#1F2937" : colors.white}`,
            }}
            title="Set status"
          >
            +
          </button>
        )}
      </div>

      {/* Image Modal */}
      {user.photo && (
        <div
          className={`fixed inset-0 z-60 flex items-center justify-center p-4 transition-all duration-300 ${
            showImageModal ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden={!showImageModal}
        >
          <div
            className="absolute inset-0 backdrop-blur-lg"
            style={{
              background: `${isDark ? "rgba(0, 0, 0, 0.92)" : "rgba(0, 0, 0, 0.85)"}`,
            }}
            onClick={() => setShowImageModal(false)}
            aria-hidden="true"
          />

          <button
            type="button"
            onClick={() => setShowImageModal(false)}
            className={`fixed top-6 right-6 p-2 rounded-full shadow-xl transition-all duration-200 hover:scale-110 hover:rotate-90 z-70 backdrop-blur-md ${
              isDark
                ? "bg-gray-800/80 hover:bg-gray-700/90 text-gray-100 border border-gray-600/50"
                : "bg-white/90 hover:bg-white text-gray-800 border border-gray-200"
            }`}
            aria-label="Close modal"
            title="Close (Esc)"
          >
            <FiX className="w-5 h-5" />
          </button>

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="image-modal-title"
            className={`relative max-w-5xl w-full mx-auto transition-transform duration-300 ${
              showImageModal ? "scale-100" : "scale-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: isDark ? "#1F2937" : colors.white,
                border: `2px solid ${isDark ? "#374151" : "#E5E7EB"}`,
              }}
            >
              <div className="relative p-3 sm:p-4">
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
                      className={`text-base font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}
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

      {/* Edit Photo Modal */}
      <div
        className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 ${
          showEditPhotoModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!showEditPhotoModal}
      >
        <div
          className="absolute inset-0 backdrop-blur-sm"
          style={{
            background: `${isDark ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 0, 0, 0.7)"}`,
          }}
          onClick={() => setShowEditPhotoModal(false)}
          aria-hidden="true"
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-photo-modal-title"
          className="relative w-full max-w-md rounded-lg shadow-lg p-4"
          style={{
            background: isDark ? "#1F2937" : colors.white,
            border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
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

          <div className="mb-4">
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

      {/* Edit Status Modal */}
      <div
        className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 ${
          showEditStatusModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!showEditStatusModal}
      >
        <div
          className="absolute inset-0 backdrop-blur-md"
          style={{
            background: isDark
              ? "rgba(0, 0, 0, 0.85)"
              : "rgba(0, 0, 0, 0.7)",
          }}
          onClick={() => !isUpdating && setShowEditStatusModal(false)}
          aria-hidden="true"
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-status-modal-title"
          className="relative rounded-lg shadow-lg max-w-md w-full p-4"
          style={{
            background: isDark ? "#1F2937" : colors.white,
            border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2
            id="edit-status-modal-title"
            className={`text-xl font-bold mb-3 ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Update Status
          </h2>

          <p
            className={`text-xs mb-5 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Choose your current status to let others know what you're up to.
          </p>

          {/* Status Options Grid */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedStatus === option.value
                    ? "border-blue-500 scale-105"
                    : isDark
                    ? "border-gray-600 hover:border-gray-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                style={{
                  background:
                    selectedStatus === option.value
                      ? isDark
                        ? "rgba(59, 130, 246, 0.1)"
                        : "rgba(59, 130, 246, 0.05)"
                      : isDark
                      ? "#374151"
                      : "#F9FAFB",
                }}
                disabled={isUpdating}
              >
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-2xl">{option.icon}</span>
                  <span
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Clear Status Button */}
          <button
            onClick={() => setSelectedStatus(null)}
            className={`w-full p-2.5 rounded-lg border mb-5 transition ${
              selectedStatus === null
                ? "border-blue-500 bg-blue-50"
                : isDark
                ? "border-gray-600 hover:border-gray-500 bg-gray-700"
                : "border-gray-200 hover:border-gray-300 bg-gray-50"
            }`}
            disabled={isUpdating}
          >
            <span
              className={`text-sm font-medium ${
                selectedStatus === null
                  ? "text-blue-600"
                  : isDark
                  ? "text-gray-300"
                  : "text-gray-700"
              }`}
            >
              {selectedStatus === null ? "✓ " : ""}Clear Status
            </span>
          </button>

          {updateError && (
            <div
              className="mb-4 p-3 rounded-lg text-sm"
              style={{
                background: isDark ? "#7F1D1D" : "#FEE2E2",
                color: isDark ? "#FCA5A5" : "#991B1B",
              }}
            >
              {updateError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowEditStatusModal(false)}
              disabled={isUpdating}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateStatus}
              disabled={isUpdating}
              className="flex-1 px-4 py-2.5 rounded-lg font-medium transition hover:opacity-90 disabled:opacity-50"
              style={{
                background: isDark ? colors.blueDark : colors.blueLight,
                color: colors.textLight,
              }}
            >
              {isUpdating ? "Updating..." : "Save Status"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisplayImage;
