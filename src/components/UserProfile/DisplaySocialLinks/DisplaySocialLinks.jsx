import { useState, useEffect } from "react";
import { FiGithub, FiLinkedin, FiTwitter, FiEdit, FiX } from "react-icons/fi";
import colors from "../../../utils/color";
import { useUser } from "../../../utils/UserContext/UserContext";
import { useNotification } from "../../../utils/Notification";
import { updateSocialLinks } from "../../../utils/BackendCalls/authService";

const DisplaySocialLinks = ({ user, isDark }) => {
  const { refreshUser } = useUser();
  const { showSuccess, showError } = useNotification();
  const [showEditModal, setShowEditModal] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    github: "",
    linkedin: "",
    twitter: "",
  });
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
      await updateSocialLinks({
        github: socialLinks.github.trim() || null,
        linkedin: socialLinks.linkedin.trim() || null,
        twitter: socialLinks.twitter.trim() || null,
      });
      await refreshUser();
      setShowEditModal(false);
      showSuccess("Social links updated successfully!");
    } catch (error) {
      setUpdateError(error.message || "Failed to update social links");
      showError(error.message || "Failed to update social links");
    } finally {
      setIsUpdating(false);
    }
  };

  const openEditModal = () => {
    setSocialLinks({
      github: user.socialLinks?.github || "",
      linkedin: user.socialLinks?.linkedin || "",
      twitter: user.socialLinks?.twitter || "",
    });
    setUpdateError("");
    setShowEditModal(true);
  };

  const handleInputChange = (platform, value) => {
    setSocialLinks((prev) => ({
      ...prev,
      [platform]: value,
    }));
  };

  const hasAnySocialLink =
    user.socialLinks?.github ||
    user.socialLinks?.linkedin ||
    user.socialLinks?.twitter;

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
                  ? "rgba(249, 115, 22, 0.2)"
                  : "rgba(249, 115, 22, 0.1)",
              }}
            >
              <FiGithub className="w-3.5 h-3.5" style={{ color: "#F97316" }} />
            </div>
            <h3
              className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}
            >
              Social Links
            </h3>
          </div>
          <button
            onClick={openEditModal}
            className={`p-1.5 rounded-md transition-all hover:scale-110 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            title="Edit social links"
          >
            <FiEdit
              className="w-3.5 h-3.5"
              style={{ color: isDark ? colors.blueLight : colors.blueMid }}
            />
          </button>
        </div>

        {hasAnySocialLink ? (
          <div className="flex flex-wrap gap-3">
            {user.socialLinks?.github && (
              <a
                href={
                  user.socialLinks.github.startsWith("http")
                    ? user.socialLinks.github
                    : `https://github.com/${user.socialLinks.github}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 hover:underline ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                <FiGithub className="w-3.5 h-3.5" />
                <span className="text-xs">GitHub</span>
              </a>
            )}
            {user.socialLinks?.linkedin && (
              <a
                href={
                  user.socialLinks.linkedin.startsWith("http")
                    ? user.socialLinks.linkedin
                    : `https://linkedin.com/in/${user.socialLinks.linkedin}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 hover:underline ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                <FiLinkedin className="w-3.5 h-3.5" />
                <span className="text-xs">LinkedIn</span>
              </a>
            )}
            {user.socialLinks?.twitter && (
              <a
                href={
                  user.socialLinks.twitter.startsWith("http")
                    ? user.socialLinks.twitter
                    : `https://twitter.com/${user.socialLinks.twitter}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 hover:underline ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                <FiTwitter className="w-3.5 h-3.5" />
                <span className="text-xs">Twitter</span>
              </a>
            )}
          </div>
        ) : (
          <p
            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            Not set
          </p>
        )}
      </div>

      {/* Edit Social Links Modal */}
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
          aria-labelledby="edit-social-links-modal-title"
          className="relative w-full max-w-md rounded-xl shadow-2xl p-6"
          style={{
            background: isDark ? "#1F2937" : colors.white,
            border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              id="edit-social-links-modal-title"
              className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
            >
              Edit Social Links
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

          <div className="space-y-3 mb-4">
            {/* GitHub */}
            <div>
              <label
                htmlFor="github-input"
                className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                <FiGithub className="w-4 h-4" />
                GitHub
              </label>
              <input
                id="github-input"
                type="text"
                value={socialLinks.github}
                onChange={(e) => handleInputChange("github", e.target.value)}
                placeholder="username or full URL"
                className={`w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 ${
                  isDark
                    ? "bg-gray-800 border-gray-600 text-gray-100 focus:ring-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:ring-blue-400"
                }`}
                disabled={isUpdating}
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label
                htmlFor="linkedin-input"
                className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                <FiLinkedin className="w-4 h-4" />
                LinkedIn
              </label>
              <input
                id="linkedin-input"
                type="text"
                value={socialLinks.linkedin}
                onChange={(e) => handleInputChange("linkedin", e.target.value)}
                placeholder="username or full URL"
                className={`w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 ${
                  isDark
                    ? "bg-gray-800 border-gray-600 text-gray-100 focus:ring-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:ring-blue-400"
                }`}
                disabled={isUpdating}
              />
            </div>

            {/* Twitter */}
            <div>
              <label
                htmlFor="twitter-input"
                className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                <FiTwitter className="w-4 h-4" />
                Twitter
              </label>
              <input
                id="twitter-input"
                type="text"
                value={socialLinks.twitter}
                onChange={(e) => handleInputChange("twitter", e.target.value)}
                placeholder="username or full URL"
                className={`w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 ${
                  isDark
                    ? "bg-gray-800 border-gray-600 text-gray-100 focus:ring-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:ring-blue-400"
                }`}
                disabled={isUpdating}
              />
            </div>
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

export default DisplaySocialLinks;
