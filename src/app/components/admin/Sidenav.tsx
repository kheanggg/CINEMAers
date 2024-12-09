import React from "react";

const SideNav = () => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white p-4">
      <nav>
        {/* Section 1 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Movies</h3>
          <ul className="ml-4">
            <li className="mb-1">
              <span className="font-semibold">+ Movie</span>
              <ul className="ml-4 list-disc list-inside">
                <li className="mt-1">Add Movie</li>
                <li className="mt-1">Remove Movie</li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Analytics</h3>
          <ul className="ml-4">
            <li className="mb-1">
              <span className="font-semibold">+ Reports</span>
              <ul className="ml-4 list-disc list-inside">
                <li className="mt-1">Sales</li>
                <li className="mt-1">Traffic</li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Section 3 */}
        <div>
          <h3 className="text-lg font-bold mb-2">Settings</h3>
          <ul className="ml-4">
            <li className="mb-1">Profile</li>
            <li className="mb-1">Account</li>
            <li className="mb-1">Logout</li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default SideNav;