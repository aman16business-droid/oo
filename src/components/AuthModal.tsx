import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Zap } from "lucide-react";
import { useAppContext } from "../AppContext";

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, setUser } = useAppContext();
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(23);
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  useEffect(() => {
    if (!isAuthModalOpen) {
      setTimeout(() => {
        setStep("mobile");
        setMobile("");
        setOtp(["", "", "", ""]);
        setTimer(23);
      }, 300);
    }
  }, [isAuthModalOpen]);

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length === 10) {
      setStep("otp");
      setTimer(23);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = () => {
    const fullOtp = otp.join("");
    if (fullOtp.length === 4) {
      // successful login
      setUser({ phone: `+91 ${mobile}`, joined: new Date().toISOString() });
      setIsAuthModalOpen(false);
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsAuthModalOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl min-h-[500px]"
          >
            {/* Close button for mobile */}
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="md:hidden absolute top-4 right-4 z-10 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Left Side (Black) */}
            <div className="flex-1 bg-black text-white p-8 md:p-12 flex flex-col items-center justify-center text-center relative border-r border-[#1a1a1a]">
              <div className="flex items-end justify-center gap-6 mb-12 flex-wrap">
                <div className="flex flex-col leading-none">
                  <span className="text-4xl md:text-5xl font-black tracking-[-0.05em] uppercase italic leading-none">
                    SHADOW
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Welcome!
                </h2>
                <p className="text-xl font-medium tracking-tight opacity-90">
                  Register to avail the best deals!
                </p>
              </div>
            </div>

            {/* Right Side (White) */}
            <div className="w-full md:w-[450px] bg-white p-8 md:p-12 flex flex-col relative rounded-t-2xl md:rounded-t-none md:rounded-l-[20px] md:-ml-4 scale-y-[1.01]">
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="hidden md:flex absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex-1 flex flex-col justify-center max-w-[320px] mx-auto w-full">
                {step === "mobile" ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full flex-col flex"
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-[#0A1A2F] mb-3">
                        Login/Signup
                      </h3>
                      <p className="text-[15px] text-gray-500 font-medium tracking-tight">
                        Enter Mobile Number
                      </p>
                    </div>

                    <form onSubmit={handleMobileSubmit} className="space-y-6">
                      <div className="flex rounded-xl overflow-hidden border border-gray-300 focus-within:border-black transition-colors">
                        <div className="bg-gray-50 px-4 py-3.5 border-r border-gray-300 flex items-center justify-center shrink-0">
                          <span className="text-[18px] mr-2">🇮🇳</span>
                          <span className="text-[15px] font-medium text-[#0A1A2F]">
                            +91
                          </span>
                        </div>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={mobile}
                          onChange={(e) =>
                            setMobile(e.target.value.replace(/\D/g, ""))
                          }
                          placeholder="Enter Mobile Number"
                          className="flex-1 px-4 py-3.5 text-[15px] font-medium text-[#0A1A2F] focus:outline-none placeholder:text-gray-400"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={mobile.length !== 10}
                        className="w-full border border-gray-300 rounded-xl py-3.5 font-bold text-[15px] text-black hover:border-black hover:bg-gray-50 transition-all disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:bg-transparent"
                      >
                        Submit
                      </button>
                    </form>

                    <div className="mt-10 text-center">
                      <p className="text-[12px] text-gray-500 leading-relaxed max-w-[260px] mx-auto mb-6">
                        By logging in, you're agreeing to our <br />
                        <a
                          href="#"
                          className="underline font-medium hover:text-black"
                        >
                          Privacy Policy
                        </a>{" "}
                        <a
                          href="#"
                          className="underline font-medium hover:text-black"
                        >
                          Terms of Service
                        </a>
                      </p>

                      <a
                        href="#"
                        className="text-[13px] text-gray-500 font-medium underline hover:text-black transition-colors"
                      >
                        Trouble logging in?
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full flex-col flex"
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-[#0A1A2F] mb-3">
                        OTP Verification
                      </h3>
                      <p className="text-[15px] text-gray-500 font-medium tracking-tight mb-2">
                        We have sent verification code to
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-[16px] font-bold text-[#0A1A2F] tracking-wide">
                          +91 {mobile}
                        </span>
                        <button
                          onClick={() => setStep("mobile")}
                          className="px-2.5 py-0.5 rounded-full border border-green-500 text-green-600 text-xs font-semibold hover:bg-green-50 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-center gap-3 mb-6">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={otpRefs[i]}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(i, e)}
                          className={`w-[50px] h-[55px] text-center text-xl font-semibold border rounded-xl focus:outline-none transition-colors ${digit ? "border-gray-400 bg-gray-50" : "border-gray-200"} focus:border-black`}
                        />
                      ))}
                    </div>

                    <div className="text-center mb-8">
                      {timer > 0 ? (
                        <p className="text-[14px] text-[#0A1A2F] font-medium flex items-center justify-center gap-1.5">
                          <svg
                            className="w-4 h-4 opacity-70"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          Resend OTP in {timer} Sec
                        </p>
                      ) : (
                        <button
                          onClick={() => setTimer(23)}
                          className="text-[14px] text-[#0A1A2F] font-bold hover:opacity-70 transition-opacity"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>

                    <button
                      onClick={handleVerify}
                      disabled={otp.join("").length !== 4}
                      className="w-full bg-[#E5E7EB] text-white font-bold text-[16px] py-3.5 rounded-xl transition-colors disabled:bg-gray-100 disabled:text-gray-400 Enabled:bg-[#0A1A2F]"
                      style={{
                        backgroundColor:
                          otp.join("").length === 4 ? "#0A1A2F" : "",
                      }}
                    >
                      Verify
                    </button>

                    <div className="mt-8 text-center">
                      <a
                        href="#"
                        className="text-[13px] text-gray-500 font-medium underline hover:text-black transition-colors"
                      >
                        Trouble logging in?
                      </a>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
