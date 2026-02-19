import { useState, useEffect } from "react";
import { FiBriefcase, FiEdit, FiX } from "react-icons/fi";
import colors from "../../../utils/color";
import { useUser } from "../../../utils/UserContext/UserContext";
import { useNotification } from "../../../utils/Notification";
import { updateTitle } from "../../../utils/BackendCalls/authService";

const DisplayTitle = ({ user, isDark }) => {
  const { refreshUser } = useUser();
  const { showSuccess, showError } = useNotification();
  const [showEditModal, setShowEditModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
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
    setIsUpdating(true);
    setUpdateError("");

    try {
      await updateTitle(newTitle.trim() || null);
      await refreshUser();
      setShowEditModal(false);
      setNewTitle("");
      showSuccess("Job title updated successfully!");
    } catch (error) {
      setUpdateError(error.message || "Failed to update job title");
      showError(error.message || "Failed to update job title");
    } finally {
      setIsUpdating(false);
    }
  };

  const openEditModal = () => {
    setNewTitle(user.title || "");
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
                  ? "rgba(139, 92, 246, 0.2)"
                  : "rgba(139, 92, 246, 0.1)",
              }}
            >
              <FiBriefcase className="w-3.5 h-3.5" style={{ color: "#8B5CF6" }} />
            </div>
            <h3
              className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}
            >
              Job Title
            </h3>
          </div>
          <button
            onClick={openEditModal}
            className={`p-1.5 rounded-md transition-all hover:scale-110 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            title="Edit job title"
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
          {user.title || "Not set"}
        </p>
      </div>

      {/* Edit Title Modal */}
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
          aria-labelledby="edit-title-modal-title"
          className="relative w-full max-w-md rounded-xl shadow-2xl p-6"
          style={{
            background: isDark ? "#1F2937" : colors.white,
            border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              id="edit-title-modal-title"
              className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
            >
              Edit Job Title
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
              htmlFor="title-input"
              className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              Job Title
            </label>
            <input
              id="title-input"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g., Senior Software Engineer"
              className={`w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 ${
                isDark
                  ? "bg-gray-800 border-gray-600 text-gray-100 focus:ring-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-blue-400"
              }`}
              disabled={isUpdating}
            />
          </div>

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

          <div className="flex gap-3">
            <button
              onClick={() => setShowEditModal(false)}
              disabled={isUpdating}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              } disabled:opacity-50`}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="flex-1 px-4 py-3 rounded-lg font-medium transition hover:opacity-90 disabled:opacity-50"
              style={{
                background: isDark ? colors.blueDark : colors.blueLight,
                color: colors.textLight,
              }}
            >
              {isUpdating ? "Updating..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisplayTitle;
