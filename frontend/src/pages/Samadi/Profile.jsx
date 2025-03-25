import React from 'react';

const Profile = () => {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-xl">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">User Profile</h1>
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-full focus:outline-none">
          Settings
        </button>
      </div>

      {/* Profile Picture */}
      <div className="flex justify-center mb-8">
        <img
          className="w-32 h-32 rounded-full object-cover shadow-lg"
          src="https://via.placeholder.com/150"
          alt="Profile"
        />
      </div>

      {/* User Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <p className="text-lg font-semibold text-gray-800">John Doe</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <p className="text-lg font-semibold text-gray-800">john_doe</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="text-lg font-semibold text-gray-800">john.doe@example.com</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <p className="text-lg font-semibold text-gray-800">+123 456 7890</p>
        </div>
      </div>

      {/* Bio Section */}
      <div className="mt-8">
        <label className="block text-sm font-medium text-gray-700">Bio</label>
        <p className="text-lg text-gray-800">
          Hello! I'm John, a software engineer passionate about technology and coding. Always learning new things and improving my skills!
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-between items-center">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full focus:outline-none">
          Edit Profile
        </button>
        <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full focus:outline-none">
          Log Out
        </button>
      </div>

      {/* Account Settings Section */}
      <div className="mt-8 p-6 bg-gray-100 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Account Settings</h2>
        <ul>
          <li className="flex justify-between py-2">
            <span className="text-gray-700">Change Password</span>
            <button className="text-blue-500 hover:text-blue-700">Edit</button>
          </li>
          <li className="flex justify-between py-2">
            <span className="text-gray-700">Two-Factor Authentication</span>
            <button className="text-blue-500 hover:text-blue-700">Enable</button>
          </li>
          <li className="flex justify-between py-2">
            <span className="text-gray-700">Email Preferences</span>
            <button className="text-blue-500 hover:text-blue-700">Edit</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Profile;
