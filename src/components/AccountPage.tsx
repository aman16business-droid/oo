import React, { useState } from "react";
import { motion } from "motion/react";
import {
  PackageSearch,
  MapPin,
  Wallet,
  Award,
  User,
  LogOut,
} from "lucide-react";
import { useAppContext } from "../AppContext";

type Tab = "orders" | "address" | "wallet" | "rewards" | "account";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const { setUser, setCurrentView } = useAppContext();

  const handleLogout = () => {
    setUser(null);
    setCurrentView("home");
  };

  const tabs = [
    { id: "orders", label: "Order history", icon: <PackageSearch size={18} /> },
    { id: "address", label: "Shipping Address", icon: <MapPin size={18} /> },
    { id: "wallet", label: "Wallet Details", icon: <Wallet size={18} /> },
    { id: "rewards", label: "Loyalty Rewards", icon: <Award size={18} /> },
    { id: "account", label: "Account details", icon: <User size={18} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return (
          <p className="text-[#333] text-[15px]">
            You haven't placed any orders yet.
          </p>
        );
      case "address":
        return <p className="text-[#333] text-[15px]">No saved addresses.</p>;
      case "wallet":
        return <p className="text-[#333] text-[15px]">Wallet balance: ₹0.00</p>;
      case "rewards":
        return (
          <p className="text-[#333] text-[15px]">You have 0 reward points.</p>
        );
      case "account":
        return (
          <p className="text-[#333] text-[15px]">
            Account details will appear here.
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#F6F6F6] rounded-3xl border border-gray-200 p-6 md:p-12 flex flex-col md:flex-row gap-8 md:gap-16 min-h-[500px]"
      >
        <div className="w-full md:w-64 flex flex-col gap-1 shrink-0 md:border-r border-gray-300 md:pr-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "text-black bg-white shadow-sm border border-gray-100"
                  : "text-gray-600 hover:bg-white/50 hover:text-black"
              }`}
            >
              <span
                className={`transition-colors ${activeTab === tab.id ? "text-black" : "text-gray-500"}`}
              >
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3.5 mt-8 text-sm font-bold text-gray-600 hover:text-red-600 transition-colors"
          >
            <span className="text-gray-500">
              <LogOut size={18} />
            </span>
            Log out
          </button>
        </div>

        <div className="flex-1 pt-4">{renderContent()}</div>
      </motion.div>
    </div>
  );
}
