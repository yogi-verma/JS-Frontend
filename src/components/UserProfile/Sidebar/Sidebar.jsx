import { FiUser, FiZap, FiCalendar } from "react-icons/fi";

const tabs = [
  { key: "profile", label: "User Profile", icon: FiUser },
  { key: "streak", label: "Activity Streak", icon: FiZap },
  { key: "quiz", label: "Quiz History", icon: FiCalendar },
];

const Sidebar = ({ activeTab, setActiveTab, isDark }) => {
  return (
    <nav
      className="rounded-xl overflow-hidden flex flex-col lg:min-h-full"
      style={{
        background: isDark ? "#161B22" : "#FFFFFF",
        border: `1px solid ${isDark ? "#30363D" : "#D0D7DE"}`,
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3"
        style={{ borderBottom: `1px solid ${isDark ? "#21262D" : "#EAEEF2"}` }}
      >
        <h2
          className={`text-xs font-semibold uppercase tracking-wider ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Navigation
        </h2>
      </div>

      {/* Links */}
      <div className="p-2 flex flex-col gap-0.5">
        {tabs.map(({ key, label, icon: Icon }) => { // eslint-disable-line no-unused-vars
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? isDark
                    ? "bg-[#1F6FEB]/15 text-[#58A6FF]"
                    : "bg-blue-50 text-blue-700"
                  : isDark
                  ? "text-gray-400 hover:text-gray-200 hover:bg-[#1C2128]"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon
                className="w-3.5 h-3.5 shrink-0"
                style={
                  isActive
                    ? { color: isDark ? "#58A6FF" : "#2563EB" }
                    : undefined
                }
              />
              <span>{label}</span>
              {isActive && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: isDark ? "#58A6FF" : "#2563EB" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Sidebar;
