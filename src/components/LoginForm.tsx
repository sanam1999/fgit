// src/components/LoginForm.tsx
import { useState } from "react";
import { Mail, Lock, ArrowRight, RefreshCw, ChevronLeft, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authService, type AuthUser } from "../services/authService";
type View = "login" | "otp" | "forgot" | "forgot-otp" | "reset-success";

const PRIMARY = "#1F8278";
const btnStyle: React.CSSProperties = { backgroundColor: PRIMARY, color: "#fff", border: "none" };
const linkStyle: React.CSSProperties = { color: PRIMARY };

interface LoginFormProps {
    onAuthSuccess?: (token: string, user: AuthUser) => void;
}

export default function LoginForm({ onAuthSuccess }: LoginFormProps) {
    const [view, setView] = useState<View>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ── OTP helpers ──────────────────────────────────────────────────────────
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const digit = value.slice(-1);
        const next = [...otp];
        next[index] = digit;
        setOtp(next);
        if (digit && index < 5) {
            setTimeout(() => document.getElementById(`otp-${index + 1}`)?.focus(), 0);
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0)
            document.getElementById(`otp-${index - 1}`)?.focus();
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(""));
            document.getElementById("otp-5")?.focus();
        }
    };

    const resetOtp = () => setOtp(["", "", "", "", "", ""]);

    // ── Resend ────────────────────────────────────────────────────────────────
    const handleResend = async (purpose: "login" | "reset") => {
        try {
            await authService.resendOtp(email, purpose);
            setError(null);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    // ── Step 1: Login ─────────────────────────────────────────────────────────
    const handleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.login(email, password);
            resetOtp();
            setView("otp");
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    // ── Step 2: Verify OTP ────────────────────────────────────────────────────
    const handleVerifyOtp = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { token, user } = await authService.verifyOtp(email, otp.join(""));
            onAuthSuccess?.(token, user);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    // ── Forgot: send reset OTP ────────────────────────────────────────────────
    const handleForgotSend = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.forgotPassword(email);
            resetOtp();
            setView("forgot-otp");
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    // ── Reset: verify OTP + new password ─────────────────────────────────────
    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
        if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
        setIsLoading(true);
        setError(null);
        try {
            await authService.resetPassword(email, otp.join(""), newPassword);
            setView("reset-success");
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    // ── Shared UI pieces ──────────────────────────────────────────────────────
    const logoMark = (
        <div className="flex items-center justify-center gap-2 mb-8">
            <img style={{ height: 40 }} src="/prolabr_logo.jpeg" alt="Prolab R" />
            <span className="text-lg font-semibold tracking-tight">Prolab R</span>
        </div>
    );

    const card = (children: React.ReactNode) => (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-background rounded-2xl shadow-lg border border-border/60 p-8">
                {logoMark}
                {children}
            </div>
        </div>
    );

    const BackBtn = ({ to, label = "Back" }: { to: View; label?: string }) => (
        <button
            onClick={() => { setView(to); setError(null); }}
            className="flex items-center gap-1 text-sm hover:opacity-70 mb-6 transition-opacity"
            style={linkStyle}
        >
            <ChevronLeft className="h-4 w-4" /> {label}
        </button>
    );

    const ErrorMsg = () =>
        error ? <p className="text-sm text-destructive">{error}</p> : null;

    const OtpGrid = () => (
        <div className="flex gap-2 justify-between" onPaste={handleOtpPaste}>
            {otp.map((digit, i) => (
                <Input
                    key={i}
                    id={`otp-${i}`}
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="h-12 w-12 text-center text-lg font-semibold p-0"
                    style={digit ? { borderColor: PRIMARY } : {}}
                />
            ))}
        </div>
    );

    const ResendBtn = ({ purpose }: { purpose: "login" | "reset" }) => (
        <p className="text-sm text-center text-muted-foreground mt-4">
            Didn't receive it?{" "}
            <button className="hover:underline font-medium" style={linkStyle}
                onClick={() => handleResend(purpose)}>
                Resend code
            </button>
        </p>
    );

    // ── VIEWS ─────────────────────────────────────────────────────────────────

    if (view === "login") return card(
        <>
            <h1 className="text-2xl font-bold tracking-tight mb-1">Welcome back</h1>
            <p className="text-sm text-muted-foreground mb-6">Sign in to your account</p>
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="email" type="email" placeholder="you@company.com" className="pl-9"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && document.getElementById("password")?.focus()} />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <button type="button" className="text-xs hover:underline font-medium" style={linkStyle}
                            onClick={() => { setView("forgot"); setError(null); }}>
                            Forgot password?
                        </button>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="password" type="password" placeholder="••••••••" className="pl-9"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !(!email || !password) && handleLogin()} />
                    </div>
                </div>
                <ErrorMsg />
                <Button className="w-full gap-2" style={btnStyle}
                    onClick={handleLogin} disabled={!email || !password || isLoading}>
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <>Continue <ArrowRight className="h-4 w-4" /></>}
                </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-6">
                We'll send a one-time code to verify your identity.
            </p>
        </>
    );

    if (view === "otp") return card(
        <>
            <BackBtn to="login" label="Back to login" />
            <h1 className="text-2xl font-bold tracking-tight mb-1">Check your email</h1>
            <p className="text-sm text-muted-foreground mb-6">
                We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
            </p>
            <div className="space-y-5">
                <OtpGrid />
                <ErrorMsg />
                <Button className="w-full gap-2" style={btnStyle}
                    onClick={handleVerifyOtp} disabled={otp.join("").length !== 6 || isLoading}>
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <>Verify & Sign In <ArrowRight className="h-4 w-4" /></>}
                </Button>
            </div>
            <ResendBtn purpose="login" />
        </>
    );

    if (view === "forgot") return card(
        <>
            <BackBtn to="login" label="Back to login" />
            <h1 className="text-2xl font-bold tracking-tight mb-1">Forgot password?</h1>
            <p className="text-sm text-muted-foreground mb-6">
                Enter your email and we'll send you a reset code.
            </p>
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="forgot-email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="forgot-email" type="email" placeholder="you@company.com" className="pl-9"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !!email && handleForgotSend()} />
                    </div>
                </div>
                <ErrorMsg />
                <Button className="w-full gap-2" style={btnStyle}
                    onClick={handleForgotSend} disabled={!email || isLoading}>
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <>Send Reset Code <ArrowRight className="h-4 w-4" /></>}
                </Button>
            </div>
        </>
    );

    if (view === "forgot-otp") return card(
        <>
            <BackBtn to="forgot" />
            <h1 className="text-2xl font-bold tracking-tight mb-1">Reset password</h1>
            <p className="text-sm text-muted-foreground mb-6">
                Enter the code sent to <span className="font-medium text-foreground">{email}</span> and choose a new password.
            </p>
            <div className="space-y-5">
                <div>
                    <Label className="mb-2 block">Verification Code</Label>
                    <OtpGrid />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="new-password" type="password" placeholder="••••••••" className="pl-9"
                            value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="confirm-password" type="password" placeholder="••••••••" className="pl-9"
                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                </div>
                <ErrorMsg />
                <Button className="w-full gap-2" style={btnStyle}
                    onClick={handleResetPassword}
                    disabled={otp.join("").length !== 6 || !newPassword || !confirmPassword || isLoading}>
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <>Reset Password <ArrowRight className="h-4 w-4" /></>}
                </Button>
            </div>
            <ResendBtn purpose="reset" />
        </>
    );

    if (view === "reset-success") return card(
        <div className="text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl mx-auto mb-4"
                style={{ backgroundColor: `${PRIMARY}18` }}>
                <ShieldCheck className="h-7 w-7" style={{ color: PRIMARY }} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Password reset!</h1>
            <p className="text-sm text-muted-foreground mb-6">
                Your password has been updated. You can now sign in with your new password.
            </p>
            <Button className="w-full" style={btnStyle} onClick={() => {
                setView("login"); resetOtp(); setNewPassword(""); setConfirmPassword(""); setError(null);
            }}>
                Back to Sign In
            </Button>
        </div>
    );

    return null;
}