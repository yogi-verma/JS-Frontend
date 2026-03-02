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
      {/* GitHub-style avatar */}
      <div className="relative w-full flex justify-center">
        <div className="relative group">
          {user.photo ? (
            <img
              src={user.photo}
              alt={user.displayName}
              onClick={() => setShowImageModal(true)}
              className="w-32 h-32 rounded-full object-cover cursor-pointer transition-all duration-200 hover:opacity-90"
              style={{
                border: `2px solid ${isDark ? "#30363D" : "#D0D7DE"}`,
              }}
              title="Click to view full size"
            />
          ) : (
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-semibold cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${colors.blueLight}, ${colors.blueDark})`,
                color: "#FFFFFF",
                border: `2px solid ${isDark ? "#30363D" : "#D0D7DE"}`,
              }}
              onClick={() => openEditPhotoModal()}
            >
              {getInitials(user.displayName)}
            </div>
          )}

          {/* Camera button - visible on hover */}
          <button
            onClick={openEditPhotoModal}
            className="absolute bottom-2 right-2 p-1.5 rounded-full shadow-lg transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100"
            style={{
              background: isDark ? "#21262D" : "#FFFFFF",
              border: `2px solid ${isDark ? "#30363D" : "#D0D7DE"}`,
            }}
            title="Change photo"
          >
            <FiCamera
              className="w-3 h-3"
              style={{ color: isDark ? "#E6EDF3" : "#24292F" }}
            />
          </button>

          {/* Status Badge */}
          <button
            onClick={openEditStatusModal}
            className="absolute bottom-2 left-2 rounded-full shadow-lg transition-all transform hover:scale-110 cursor-pointer"
            style={{
              background: isDark ? "#21262D" : "#FFFFFF",
              border: `2px solid ${isDark ? "#30363D" : "#D0D7DE"}`,
              padding: currentStatusInfo ? "4px 8px" : "4px 6px",
            }}
            title={currentStatusInfo ? `Status: ${currentStatusInfo.label}` : "Set status"}
          >
            {currentStatusInfo ? (
              <span className="text-sm leading-none">{currentStatusInfo.icon}</span>
            ) : (
              <span className="text-xs leading-none" style={{ color: isDark ? "#8B949E" : "#656D76" }}>
                😀
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ===== Image View Modal ===== */}
      {user.photo && (
        <div
          className={`fixed inset-0 z-60 flex items-center justify-center p-4 transition-all duration-300 ${
            showImageModal ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden={!showImageModal}
        >
          <div
            className="absolute inset-0 backdrop-blur-lg"
            style={{ background: isDark ? "rgba(1,4,9,0.92)" : "rgba(0,0,0,0.80)" }}
            onClick={() => setShowImageModal(false)}
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={() => setShowImageModal(false)}
            className={`fixed top-5 right-5 p-2 rounded-full z-70 transition-all hover:scale-110 ${
              isDark
                ? "bg-gray-800/80 hover:bg-gray-700 text-gray-200 border border-gray-600/50"
                : "bg-white/90 hover:bg-white text-gray-800 border border-gray-200"
            }`}
            aria-label="Close"
          >
            <FiX className="w-5 h-5" />
          </button>

          <div
            role="dialog"
            aria-modal="true"
            className={`relative max-w-4xl w-full mx-auto transition-transform duration-300 ${
              showImageModal ? "scale-100" : "scale-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: isDark ? "#161B22" : "#FFFFFF",
                border: `1px solid ${isDark ? "#30363D" : "#D0D7DE"}`,
              }}
            >
              <div className="p-3">
                <img
                  src={user.photo}
                  alt={user.displayName}
                  className="w-full h-auto object-contain rounded-lg mx-auto"
                  style={{ maxHeight: "75vh" }}
                />
              </div>
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{
                  borderTop: `1px solid ${isDark ? "#21262D" : "#D0D7DE"}`,
                  background: isDark ? "#0D1117" : "#F6F8FA",
                }}
              >
                <div>
                  <p className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                    {user.displayName}&#39;s Profile Photo
                  </p>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    Press Esc to close
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowImageModal(false);
                    openEditPhotoModal();
                  }}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${
                    isDark
                      ? "border-gray-600 text-gray-200 hover:bg-gray-700 bg-[#21262D]"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FiCamera className="w-3.5 h-3.5" />
                    Change
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Edit Photo Modal ===== */}
      <div
        className={`fixed inset-0 z-60 flex items-center justify-center p-4 transition-opacity duration-300 ${
          showEditPhotoModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!showEditPhotoModal}
      >
        <div
          className="absolute inset-0 backdrop-blur-sm"
          style={{ background: isDark ? "rgba(1,4,9,0.85)" : "rgba(0,0,0,0.5)" }}
          onClick={() => setShowEditPhotoModal(false)}
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
              Edit profile picture
            </h2>
            <button
              type="button"
              onClick={() => setShowEditPhotoModal(false)}
              className={`p-1.5 rounded-md transition-colors ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
              aria-label="Close"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5">
            {newPhotoUrl && (
              <div className="mb-4 flex justify-center">
                <img
                  src={newPhotoUrl}
                  alt="Preview"
                  className="w-36 h-36 rounded-full object-cover"
                  style={{ border: `2px solid ${isDark ? "#30363D" : "#D0D7DE"}` }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="photoFile"
                className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                Upload a photo
              </label>
              <input
                id="photoFile"
                type="file"
                accept="image/*"
                onChange={handlePhotoFileChange}
                className={`w-full px-3 py-2 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:cursor-pointer ${
                  isDark
                    ? "bg-[#0D1117] border border-gray-600 text-gray-200 file:bg-[#21262D] file:text-gray-200"
                    : "bg-white border border-gray-300 text-gray-900 file:bg-gray-100 file:text-gray-700"
                }`}
                disabled={isUpdating}
              />
              <p className={`mt-1.5 text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                JPG, PNG, GIF, WebP — Max 5MB
              </p>
              {updateError && (
                <p className="mt-2 text-sm text-red-500">{updateError}</p>
              )}
            </div>
          </div>

          <div
            className="px-5 py-3 flex gap-2 justify-end"
            style={{ borderTop: `1px solid ${isDark ? "#21262D" : "#D0D7DE"}` }}
          >
            <button
              type="button"
              onClick={() => setShowEditPhotoModal(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                isDark
                  ? "border-gray-600 text-gray-200 hover:bg-gray-700 bg-[#21262D]"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
              }`}
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdatePhoto}
              className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${
                isUpdating ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
              }`}
              style={{ background: "#238636" }}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Set new photo"}
            </button>
          </div>
        </div>
      </div>

      {/* ===== Edit Status Modal ===== */}
      <div
        className={`fixed inset-0 z-60 flex items-center justify-center p-4 transition-opacity duration-300 ${
          showEditStatusModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!showEditStatusModal}
      >
        <div
          className="absolute inset-0 backdrop-blur-sm"
          style={{ background: isDark ? "rgba(1,4,9,0.85)" : "rgba(0,0,0,0.5)" }}
          onClick={() => !isUpdating && setShowEditStatusModal(false)}
          aria-hidden="true"
        />

        <div
          role="dialog"
          aria-modal="true"
          className="relative rounded-xl shadow-2xl max-w-md w-full"
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
              Edit status
            </h2>
            <button
              type="button"
              onClick={() => !isUpdating && setShowEditStatusModal(false)}
              className={`p-1.5 rounded-md transition-colors ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
              aria-label="Close"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5">
            <p className={`text-xs mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              What&#39;s happening?
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value)}
                  className={`p-3 rounded-lg border text-sm transition-all ${
                    selectedStatus === option.value
                      ? isDark
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-blue-500 bg-blue-50"
                      : isDark
                        ? "border-gray-600 hover:border-gray-500 bg-[#0D1117]"
                        : "border-gray-200 hover:border-gray-300 bg-gray-50"
                  }`}
                  disabled={isUpdating}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{option.icon}</span>
                    <span className={`font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                      {option.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelectedStatus(null)}
              className={`w-full p-2 rounded-lg border text-sm font-medium mb-4 transition-colors ${
                selectedStatus === null
                  ? isDark
                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                    : "border-blue-500 bg-blue-50 text-blue-600"
                  : isDark
                    ? "border-gray-600 hover:border-gray-500 bg-[#0D1117] text-gray-300"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50 text-gray-600"
              }`}
              disabled={isUpdating}
            >
              {selectedStatus === null ? "✓ " : ""}Clear status
            </button>

            {updateError && (
              <div
                className="mb-2 p-3 rounded-lg text-sm"
                style={{
                  background: isDark ? "rgba(248,81,73,0.1)" : "#FFF1F0",
                  color: isDark ? "#F85149" : "#CF222E",
                  border: `1px solid ${isDark ? "rgba(248,81,73,0.4)" : "#FFD8D3"}`,
                }}
              >
                {updateError}
              </div>
            )}
          </div>

          <div
            className="px-5 py-3 flex gap-2 justify-end"
            style={{ borderTop: `1px solid ${isDark ? "#21262D" : "#D0D7DE"}` }}
          >
            <button
              onClick={() => setShowEditStatusModal(false)}
              disabled={isUpdating}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                isDark
                  ? "border-gray-600 text-gray-200 hover:bg-gray-700 bg-[#21262D]"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateStatus}
              disabled={isUpdating}
              className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${
                isUpdating ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
              }`}
              style={{ background: "#238636" }}
            >
              {isUpdating ? "Saving..." : "Set status"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisplayImage;
