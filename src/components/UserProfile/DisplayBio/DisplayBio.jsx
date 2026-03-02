import { useState, useEffect } from "react";
import { FiEdit, FiX } from "react-icons/fi";
import { useUser } from "../../../utils/UserContext/UserContext";
import { useNotification } from "../../../utils/Notification";
import { updateBio } from "../../../utils/BackendCalls/authService";

const DisplayBio = ({ user, isDark }) => {
  const { refreshUser } = useUser();
  const { showSuccess, showError } = useNotification();
  const [showEditModal, setShowEditModal] = useState(false);
  const [newBio, setNewBio] = useState("");
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
      await updateBio(newBio.trim());
      await refreshUser();
      setShowEditModal(false);
      setNewBio("");
      showSuccess("Bio updated successfully!");
    } catch (error) {
      setUpdateError(error.message || "Failed to update bio");
      showError(error.message || "Failed to update bio");
    } finally {
      setIsUpdating(false);
    }
  };

  const openEditModal = () => {
    setNewBio(user.bio || "");
    setUpdateError("");
    setShowEditModal(true);
  };

  return (
    <>
      {/* Sidebar bio - GitHub style */}
      <div className="group relative">
        <p
          className={`text-sm leading-relaxed ${
            user.bio
              ? isDark ? "text-gray-300" : "text-gray-600"
              : isDark ? "text-gray-500 italic" : "text-gray-400 italic"
          }`}
        >
          {user.bio || "Add a bio"}
        </p>
        <button
          onClick={openEditModal}
          className={`absolute -top-1 -right-1 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${
            isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"
          }`}
          title="Edit bio"
        >
          <FiEdit className="w-3 h-3" />
        </button>
      </div>

      {/* Edit Bio Modal */}
      <div
        className={`fixed inset-0 z-60 flex items-center justify-center p-4 transition-opacity duration-300 ${
          showEditModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!showEditModal}
      >
        <div
          className="absolute inset-0 backdrop-blur-sm"
          style={{ background: isDark ? "rgba(1,4,9,0.85)" : "rgba(0,0,0,0.5)" }}
          onClick={() => setShowEditModal(false)}
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
              Edit bio
            </h2>
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className={`p-1.5 rounded-md transition-colors ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
              aria-label="Close"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5">
            <label
              htmlFor="bio"
              className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              Tell us about yourself
            </label>
            <textarea
              id="bio"
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              className={`w-full px-3 py-2 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                isDark
                  ? "bg-[#0D1117] border border-gray-600 text-gray-200"
                  : "bg-white border border-gray-300 text-gray-900"
              }`}
              placeholder="Write a short bio..."
              disabled={isUpdating}
              rows={4}
            />
            {updateError && (
              <p className="mt-2 text-sm text-red-500">{updateError}</p>
            )}
          </div>

          <div
            className="px-5 py-3 flex gap-2 justify-end"
            style={{ borderTop: `1px solid ${isDark ? "#21262D" : "#D0D7DE"}` }}
          >
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
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
              onClick={handleUpdate}
              className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${
                isUpdating ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
              }`}
              style={{ background: "#238636" }}
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

export default DisplayBio;
