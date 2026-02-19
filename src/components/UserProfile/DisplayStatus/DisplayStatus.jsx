import { useState, useEffect } from "react";
import { useUser } from "../../../utils/UserContext/UserContext";
import { useNotification } from "../../../utils/Notification";
import { updateStatus } from "../../../utils/BackendCalls/authService";
import colors from "../../../utils/color";
import { FiEdit2 } from "react-icons/fi";

const DisplayStatus = ({ user, isDark }) => {
  const { refreshUser } = useUser();
  const { showSuccess, showError } = useNotification();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(user.status || null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  // Status options with icons and labels
  const statusOptions = [
    { value: "busy", label: "Busy", icon: "⏰", color: "#EF4444" }, // Red
    { value: "focusing", label: "Focusing", icon: "🎯", color: "#8B5CF6" }, // Purple
    { value: "building", label: "Building", icon: "🔨", color: "#F59E0B" }, // Orange
    { value: "optimistic", label: "Optimistic", icon: "✨", color: "#10B981" }, // Green
  ];

  const openEditModal = () => {
    setSelectedStatus(user.status || null);
    setUpdateError("");
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    setUpdateError("");
    setIsUpdating(true);

    try {
      await updateStatus(selectedStatus);
      await refreshUser();
      setShowEditModal(false);
      showSuccess("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      setUpdateError(error.message || "Failed to update status");
      showError(error.message || "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleModalClose = () => {
    if (!isUpdating) {
      setShowEditModal(false);
      setUpdateError("");
    }
  };

  // ESC key handler
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && showEditModal && !isUpdating) {
        setShowEditModal(false);
        setUpdateError("");
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showEditModal, isUpdating]);

  // Manage body overflow
  useEffect(() => {
    if (showEditModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showEditModal]);

  const getCurrentStatusInfo = () => {
    if (!user.status) return null;
    return statusOptions.find((opt) => opt.value === user.status);
  };

  const currentStatusInfo = getCurrentStatusInfo();

  return (
    <>
      <div
        className="rounded-lg p-4 shadow-sm"
        style={{
          background: isDark ? "#1F2937" : colors.white,
          border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
        }}
      >
        <div className="flex items-start justify-between mb-2">
          <h3
            className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Status
          </h3>
          <button
            onClick={openEditModal}
            className={`p-1 rounded-md transition hover:opacity-80 ${
              isDark
                ? "text-blue-400 hover:bg-gray-700"
                : "text-blue-600 hover:bg-gray-100"
            }`}
            title="Edit status"
          >
            <FiEdit2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {currentStatusInfo ? (
            <>
              <span className="text-xl">{currentStatusInfo.icon}</span>
              <p
                className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}
                style={{ color: isDark ? currentStatusInfo.color : undefined }}
              >
                {currentStatusInfo.label}
              </p>
            </>
          ) : (
            <p
              className={`text-sm italic ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              No status set
            </p>
          )}
        </div>
      </div>

      {/* Edit Status Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleModalClose}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 backdrop-blur-md"
            style={{
              background: isDark
                ? "rgba(0, 0, 0, 0.85)"
                : "rgba(0, 0, 0, 0.7)",
            }}
          />

          {/* Modal */}
          <div
            className="relative rounded-lg shadow-lg max-w-md w-full p-4"
            style={{
              background: isDark ? "#1F2937" : colors.white,
              border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className={`text-lg font-bold mb-3 ${isDark ? "text-gray-100" : "text-gray-900"}`}
            >
              Update Status
            </h2>

            <p
              className={`text-xs mb-5 ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Choose your current status to let others know what you're up to.
            </p>

            {/* Status Options Grid */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
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
                    <span className="text-base">{option.icon}</span>
                    <span
                      className={`text-xs font-medium ${
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
              className={`w-full p-3 rounded-lg border mb-3 transition ${
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
                onClick={handleModalClose}
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
                onClick={handleUpdate}
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
      )}
    </>
  );
};

export default DisplayStatus;
