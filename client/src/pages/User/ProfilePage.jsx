import React from 'react';
import { Header } from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import UserProfileSidebar from "../../components/layout/UserProfileSidebar";

export const ProfilePage = () => {
    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#16211C]">
            <Header />
            <main className="max-w-7xl mx-auto px-6 py-16 flex gap-8">
                <UserProfileSidebar />
                <div className="flex-1 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h1 className="text-2xl font-semibold mb-6">My Profile</h1>
                    <p>Profile content goes here.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProfilePage;