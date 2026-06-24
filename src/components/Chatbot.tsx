import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  X,
  Send,
  Image as ImageIcon,
  ArrowLeft,
  Mail,
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "model";
  text: string;
  isQuickAction?: boolean;
};

const QUICK_ACTIONS = [
  { label: "Return or exchange an item", icon: "🔄" },
  { label: "Where's my order?", icon: "📦" },
  { label: "Shipping & delivery info", icon: "🚚" },
  { label: "Help me find a product", icon: "🛍️" },
  { label: "Any deals or codes?", icon: "🏷️" },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Pre-chat form states
  const [isPreChat, setIsPreChat] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial load
    setMessages([{ id: "1", role: "model", text: "Hey 👋 How can we help?" }]);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
      return;
    }

    const interval = setInterval(() => {
      setShowTooltip(true);

      setTimeout(() => {
        setShowTooltip(false);
      }, 4000);
    }, 14000);

    const initialTimeout = setTimeout(() => {
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
      }, 4000);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, isPreChat]);

  const handleSend = async (text: string, isQuickAction = false) => {
    if (!text.trim()) return;

    const newMessages = [
      ...messages,
      { id: Date.now().toString(), role: "user" as const, text, isQuickAction },
    ];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      // Send history excluding the last message (which is new) and only the text role
      const history = messages.map((m) => ({ role: m.role, text: m.text }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.text || "Failed to get a response from the server.");
      }

      if (data.redirect === "whatsapp") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "model",
            text: "Connecting you to our human support team on WhatsApp right now.",
          },
        ]);
        setTimeout(() => {
          window.open(
            "https://wa.me/919999999999?text=Hi%20Shadow%20Support,%20I%20need%20help!",
            "_blank",
          );
        }, 1500);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), role: "model", text: data.text },
        ]);
      }
    } catch (error: any) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "model",
          text: error?.message || "Sorry, I'm having trouble connecting right now.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.message.trim()
    )
      return;

    setIsPreChat(false);
    // You could also save name/phone to context/localStorage here if desired
    handleSend(formData.message);
  };

  const handleUploadImage = () => {
    // Simulate image upload for returns/exchanges
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      if (input.files && input.files[0]) {
        handleSend(
          `[Uploaded image: ${input.files[0].name}] I have attached the photo for verification.`,
        );
      }
    };
    input.click();
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <div className="fixed bottom-[130px] md:bottom-6 right-4 md:right-6 z-[90] flex flex-col items-end gap-3">
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="bg-white text-black px-4 py-3 rounded-2xl shadow-2xl border border-gray-100 text-[14px] font-medium pointer-events-none relative"
                >
                  Need help? 👋
                  <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-gray-100 transform rotate-45 rounded-sm"></div>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all overflow-hidden"
            >
              <MessageSquare className="w-6 h-6" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed bottom-[130px] md:bottom-6 right-4 md:right-6 w-[calc(100vw-32px)] md:w-[380px] h-auto max-h-[85vh] bg-white border border-gray-100 shadow-2xl rounded-2xl flex flex-col z-[100] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 -ml-1 hover:bg-gray-50 rounded-full transition-colors flex items-center justify-center mr-1"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold font-sans tracking-tight">
                    S
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-[14px] tracking-tight text-gray-900">
                    Shadow Support
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[11px] font-medium text-emerald-600">
                      Online
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    window.open("https://wa.me/919999999999", "_blank")
                  }
                  className="px-2.5 py-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm border border-[#1DA851]"
                  aria-label="WhatsApp Support"
                  title="WhatsApp Support"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                  <span className="text-[11px] font-bold tracking-tight">WhatsApp</span>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-gray-50 text-gray-500 rounded-full transition-colors w-8 h-8 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 bg-white flex flex-col gap-3">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 text-[13px] leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-black text-white rounded-[16px] rounded-br-sm"
                        : "bg-[#EAEAEA] text-black rounded-[16px] rounded-bl-sm border-none shadow-none font-medium"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Quick Actions (only in Pre-Chat) */}
              {isPreChat && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-wrap gap-1.5 mb-1"
                >
                  {QUICK_ACTIONS.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          message: `${action.icon} ${action.label}`,
                        }))
                      }
                      className="text-left bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800 font-medium text-[11px] px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <span>{action.icon}</span>
                      {action.label}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Pre-Chat Form */}
              {isPreChat && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 shadow-sm mb-2"
                >
                  <form
                    onSubmit={handleStartChat}
                    className="flex flex-col gap-2.5"
                  >
                    <div>
                      <label className="block text-[11px] font-medium text-gray-900 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, name: e.target.value }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-[12px] focus:outline-none focus:border-gray-400 placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-gray-900 mb-1">
                        Phone Number<span className="text-red-500">*</span>
                      </label>
                      <div className="flex border border-gray-200 rounded-lg overflow-hidden focus-within:border-gray-400 transition-colors">
                        <div className="bg-white flex items-center px-2 border-r border-gray-200 gap-1 select-none">
                          <span className="text-[14px]">🇮🇳</span>
                          <span className="text-[12px] text-gray-400">v</span>
                          <span className="text-[12px] ml-0.5 text-gray-800">
                            +91
                          </span>
                        </div>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          minLength={10}
                          pattern="[0-9]{10}"
                          placeholder="10-digit mobile number"
                          value={formData.phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setFormData((p) => ({
                              ...p,
                              phone: val,
                            }))
                          }}
                          className="w-full px-2 py-1.5 text-[12px] focus:outline-none bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-medium text-gray-900">
                          Message <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <textarea
                        required
                        rows={2}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            message: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-[12px] focus:outline-none focus:border-gray-400 resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={
                        !formData.name || formData.phone.length !== 10 || !formData.message
                      }
                      className="w-full bg-black hover:bg-gray-800 text-white font-medium text-[13px] py-2 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-1"
                    >
                      <Mail className="w-4 h-4 text-white stroke-2" />
                      Start Chat
                    </button>
                  </form>
                </motion.div>
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#EAEAEA] rounded-[20px] rounded-bl-sm px-4 py-3.5 flex items-center gap-1.5">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area (Only visible after pre-chat is complete) */}
            {!isPreChat && (
              <div className="px-4 py-4 bg-white border-t border-gray-100 flex items-center gap-2">
                <button
                  onClick={handleUploadImage}
                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-colors flex-shrink-0"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend(inputValue);
                  }}
                  className="flex-1 flex border border-gray-200 rounded-xl focus-within:border-gray-400 transition-colors overflow-hidden"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-white text-[14px] px-4 py-2.5 focus:outline-none placeholder:text-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-white hover:bg-gray-50 text-gray-600 px-4 transition-colors disabled:opacity-50 disabled:hover:bg-white flex items-center justify-center border-l border-gray-100"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
