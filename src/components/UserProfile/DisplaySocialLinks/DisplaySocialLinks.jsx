import { useState, useEffect } from "react";
import { FiX, FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import { useUser } from "../../../utils/UserContext/UserContext";
import { useNotification } from "../../../utils/Notification";
import { updateSocialLinks } from "../../../utils/BackendCalls/authService";

const DisplaySocialLinks = ({ user, isDark }) => {
  const { refreshUser } = useUser();
  const { showSuccess, showError } = useNotification();
  const [showEditModal, setShowEditModal] = useState(false);
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const links = user.socialLinks || {};
  const hasAnyLink = links.github || links.linkedin || links.twitter;

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showEditModal) setShowEditModal(false);
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
    try {
      await updateSocialLinks({
        github: github.trim() || null,
        linkedin: linkedin.trim() || null,
        twitter: twitter.trim() || null,
      });
      await refreshUser();
      setShowEditModal(false);
      showSuccess("Social links updated!");
    } catch (error) {
      showError(error.message || "Failed to update social links");
    } finally {
      setIsUpdating(false);
    }
  };

  const openEditModal = () => {
    setGithub(links.github || "");
    setLinkedin(links.linkedin || "");
    setTwitter(links.twitter || "");
    setShowEditModal(true);
  };

  const formatLink = (url) => {
    if (!url) return "";
    return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  };

  return (
    <>
      {/* Last settings row - no borderBottom */}
      <div
        className={`flex items-center justify-between px-4 py-3 transition-colors rounded-b-lg ${
          isDark ? "hover:bg-[#1C2128]" : "hover:bg-gray-50"
        }`}
      >
        <div className="flex-1 min-w-0">
          <label className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            Social Links
          </label>
          {hasAnyLink ? (
            <div className="flex items-center gap-3 mt-1">
              {links.github && (
                <a href={links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-400 hover:underline">
                  <FiGithub className="w-3 h-3" />
                  <span className="truncate max-w-24">{formatLink(links.github)}</span>
                </a>
              )}
              {links.linkedin && (
                <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-400 hover:underline">
                  <FiLinkedin className="w-3 h-3" />
                  <span className="truncate max-w-24">{formatLink(links.linkedin)}</span>
                </a>
              )}
              {links.twitter && (
                <a href={links.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-400 hover:underline">
                  <FiTwitter className="w-3 h-3" />
                  <span className="truncate max-w-24">{formatLink(links.twitter)}</span>
                </a>
              )}
            </div>
          ) : (
            <p className={`text-xs mt-0.5 ${isDark ? "text-gray-600" : "text-gray-400"}`}>
              Not set
            </p>
          )}
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

      {showEditModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{ background: isDark ? "rgba(1,4,9,0.85)" : "rgba(0,0,0,0.5)" }}
            onClick={() => setShowEditModal(false)}
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
            <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${isDark ? "#21262D" : "#D0D7DE"}` }}>
              <h2 className={`text-base font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>Edit social links</h2>
              <button onClick={() => setShowEditModal(false)} className={`p-1.5 rounded-md transition-colors ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* GitHub */}
              <div>
                <label htmlFor="editGithub" className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  <FiGithub className="w-4 h-4" /> GitHub
                </label>
                <input
                  id="editGithub"
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark ? "bg-[#0D1117] border border-gray-600 text-gray-200" : "bg-white border border-gray-300 text-gray-900"
                  }`}
                  placeholder="https://github.com/username"
                  disabled={isUpdating}
                />
              </div>
              {/* LinkedIn */}
              <div>
                <label htmlFor="editLinkedin" className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  <FiLinkedin className="w-4 h-4" /> LinkedIn
                </label>
                <input
                  id="editLinkedin"
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark ? "bg-[#0D1117] border border-gray-600 text-gray-200" : "bg-white border border-gray-300 text-gray-900"
                  }`}
                  placeholder="https://linkedin.com/in/username"
                  disabled={isUpdating}
                />
              </div>
              {/* Twitter */}
              <div>
                <label htmlFor="editTwitter" className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  <FiTwitter className="w-4 h-4" /> Twitter
                </label>
                <input
                  id="editTwitter"
                  type="url"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark ? "bg-[#0D1117] border border-gray-600 text-gray-200" : "bg-white border border-gray-300 text-gray-900"
                  }`}
                  placeholder="https://twitter.com/username"
                  disabled={isUpdating}
                />
              </div>
              <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>Leave fields empty to clear</p>
            </div>
            <div className="px-5 py-3 flex gap-2 justify-end" style={{ borderTop: `1px solid ${isDark ? "#21262D" : "#D0D7DE"}` }}>
              <button
                onClick={() => setShowEditModal(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                  isDark ? "border-gray-600 text-gray-200 hover:bg-gray-700 bg-[#21262D]" : "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
                }`}
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${isUpdating ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
                style={{ background: "#238636" }}
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DisplaySocialLinks;
