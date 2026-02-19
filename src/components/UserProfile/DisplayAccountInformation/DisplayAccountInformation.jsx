import colors from "../../../utils/color";

const DisplayAccountInformation = ({ user, isDark }) => {
  return (
    <div
      className="mt-4 rounded-lg p-4 shadow-sm"
      style={{
        background: isDark ? "#1F2937" : colors.white,
        border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
      }}
    >
      <h3
        className={`text-sm font-semibold mb-3 ${isDark ? "text-gray-200" : "text-gray-800"}`}
      >
        Account Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <p
            className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            User ID
          </p>
          <p
            className={`text-xs mt-1 font-mono ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            {user._id || user.googleId || "N/A"}
          </p>
        </div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p
              className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Account Type
            </p>
            <p
              className={`text-xs mt-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              {user.googleId ? "Google OAuth" : "Standard"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayAccountInformation;
