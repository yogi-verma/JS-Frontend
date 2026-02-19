import { useState, useEffect } from "react";
import { FiUser, FiEdit, FiX } from "react-icons/fi";
import colors from "../../../utils/color";
import { useUser } from "../../../utils/UserContext/UserContext";
import { useNotification } from "../../../utils/Notification";
import { updateDisplayName } from "../../../utils/BackendCalls/authService";

const DisplayName = ({ user, isDark }) => {
  const { refreshUser } = useUser();
  const { showSuccess, showError } = useNotification();
  const [showEditModal, setShowEditModal] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showEditModal) {
        setShowEditModal(false);
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

  const handleUpdate = async () => {
    if (!newDisplayName.trim()) {
      setUpdateError("Display name cannot be empty");
      return;
    }

    setIsUpdating(true);
    setUpdateError("");

    try {
      await updateDisplayName(newDisplayName.trim());
      await refreshUser();
      setShowEditModal(false);
      setNewDisplayName("");
      showSuccess("Display name updated successfully!");
    } catch (error) {
      setUpdateError(error.message || "Failed to update display name");
      showError(error.message || "Failed to update display name");
    } finally {
      setIsUpdating(false);
    }
  };

  const openEditModal = () => {
    setNewDisplayName(user.displayName || "");
    setUpdateError("");
    setShowEditModal(true);
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
                  ? "rgba(96, 165, 250, 0.2)"
                  : "rgba(96, 165, 250, 0.1)",
              }}
            >
              <FiUser className="w-3.5 h-3.5" style={{ color: colors.blueLight }} />
            </div>
            <h3
              className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}
            >
              Display Name
            </h3>
          </div>
          <button
            onClick={openEditModal}
            className={`p-1.5 rounded-md transition-all hover:scale-110 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            title="Edit display name"
          >
            <FiEdit
              className="w-3.5 h-3.5"
              style={{ color: isDark ? colors.blueLight : colors.blueMid }}
            />
          </button>
        </div>
        <p
          className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
        >
          {user.displayName || "Not set"}
        </p>
      </div>

      {/* Edit Display Name Modal */}
      <div
        className={`fixed inset-0 z-60 flex items-center justify-center p-4 transition-opacity duration-300 ${
          showEditModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!showEditModal}
      >
        <div
          className="absolute inset-0 backdrop-blur-sm"
          style={{
            background: `${isDark ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 0, 0, 0.7)"}`,
          }}
          onClick={() => setShowEditModal(false)}
          aria-hidden="true"
        />

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
          <div className="flex items-center justify-between mb-6">
            <h2
              id="edit-name-modal-title"
              className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
            >
              Edit Display Name
            </h2>
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}
              aria-label="Close modal"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
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
                  handleUpdate();
                }
              }}
            />
            {updateError && (
              <p className="mt-2 text-sm text-red-500">{updateError}</p>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
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
              onClick={handleUpdate}
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
    </>
  );
};

export default DisplayName;
