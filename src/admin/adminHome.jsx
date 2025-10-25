import { useState } from "react";
import AdminBanner from "../adminComponents/adminBanner";
import { Link } from "react-router";

function adminHome() {
  return (
    <>
      <div className="transition-all duration-300 min-h-screen max-w-8xl bg-gray-50 pt-6 pb-10 sm:pb-18">
        <div className="mx-auto mb-5 sm:mb-10 flex justify-center">
          <AdminBanner />
        </div>

        <div className="mx-auto w-[85%] px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-10 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Admin Dashboard
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Manage your ticket booking system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link to="/admin/uploadbanner" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v9m0-9l-3 3m3-3l3 3" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Banner Management</h3>
                  <p className="text-gray-600">Upload and manage banners</p>
                </div>
              </div>
            </Link>

            <Link to="/admin/categories" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                  <p className="text-gray-600">Manage event categories</p>
                </div>
              </div>
            </Link>

            <Link to="/admin/eventupload" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h8M8 11h8M8 15h6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Events</h3>
                  <p className="text-gray-600">Create and edit events</p>
                </div>
              </div>
            </Link>

            <Link to="/admin/statuschange" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-full">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v6h6M20 20v-6h-6M4 14v6h6M20 10V4h-6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Status Change</h3>
                  <p className="text-gray-600">Update ticket statuses</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/admin/adminProfile" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>View Admin Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default adminHome;