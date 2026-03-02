import { useState } from "react";
import { Mail, Lock, ArrowRight, RefreshCw, ChevronLeft, KeyRound, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type View = "login" | "otp" | "forgot" | "forgot-otp" | "reset-success";

const PRIMARY = "#1F8278";

const btnStyle: React.CSSProperties = {
    backgroundColor: PRIMARY,
    color: "#fff",
    border: "none",
};

const linkStyle: React.CSSProperties = {
    color: PRIMARY,
};

export default function Login() {
    const [view, setView] = useState<View>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const next = [...otp];
        next[index] = value.slice(-1);
        setOtp(next);
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(""));
            document.getElementById("otp-5")?.focus();
        }
    };

    const fakeAsync = (cb: () => void, ms = 1200) => {
        setIsLoading(true);
        setError(null);
        setTimeout(() => { setIsLoading(false); cb(); }, ms);
    };

    const handleLogin = () => fakeAsync(() => setView("otp"));
    const handleVerifyOtp = () => fakeAsync(() => alert("Logged in successfully!"));
    const handleForgotSend = () => fakeAsync(() => setView("forgot-otp"));
    const handleResetPassword = () => {
        if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
        fakeAsync(() => setView("reset-success"));
    };

    const logoMark = (
        <div className="flex items-center gap-2 mb-8">
            <div className="">
                <img style={{ height: 40 }} src="/prolabr_logo.jpeg" alt="" />
            </div>
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

    // ─── LOGIN ────────────────────────────────────────────────────────────────
    if (view === "login") return card(
        <>
            <h1 className="text-2xl font-bold tracking-tight mb-1">Welcome back</h1>

            <div className="space-y-4 mt-4">
                <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@company.com"
                            className="pl-9"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <button
                            type="button"
                            className="text-xs hover:underline font-medium"
                            style={linkStyle}
                            onClick={() => setView("forgot")}
                        >
                            Forgot password?
                        </button>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-9"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                    className="w-full gap-2"
                    style={btnStyle}
                    onClick={handleLogin}
                    disabled={!email || !password || isLoading}
                >
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <>Continue <ArrowRight className="h-4 w-4" /></>}
                </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-6">
                We'll send a one-time code to verify your identity.
            </p>
        </>
    );

    // ─── OTP VERIFY (after login) ─────────────────────────────────────────────
    if (view === "otp") return card(
        <>
            <button
                onClick={() => setView("login")}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                style={{ color: PRIMARY }}
            >
                <ChevronLeft className="h-4 w-4" /> Back
            </button>



            <h1 className="text-2xl font-bold tracking-tight mb-1">Check your email</h1>
            <p className="text-sm text-muted-foreground mb-6">
                We sent a 6-digit code to <span className="font-medium text-foreground">{email || "your email"}</span>
            </p>

            <div className="flex gap-2 justify-between mb-6" onPaste={handleOtpPaste}>
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
                        style={digit ? { borderColor: PRIMARY, outlineColor: PRIMARY } : {}}
                    />
                ))}
            </div>

            {error && <p className="text-sm text-destructive mb-3">{error}</p>}

            <Button
                className="w-full gap-2"
                style={btnStyle}
                onClick={handleVerifyOtp}
                disabled={otp.join("").length !== 6 || isLoading}
            >
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <>Verify & Sign In <ArrowRight className="h-4 w-4" /></>}
            </Button>

            <p className="text-sm text-center text-muted-foreground mt-4">
                Didn't receive it?{" "}
                <button className="hover:underline font-medium" style={linkStyle} onClick={() => { }}>
                    Resend code
                </button>
            </p>
        </>
    );

    // ─── FORGOT PASSWORD ──────────────────────────────────────────────────────
    if (view === "forgot") return card(
        <>
            <button
                onClick={() => setView("login")}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                style={{ color: PRIMARY }}
            >
                <ChevronLeft className="h-4 w-4" /> Back to login
            </button>

           

            <h1 className="text-2xl font-bold tracking-tight mb-1">Forgot password?</h1>
            <p className="text-sm text-muted-foreground mb-6">
                Enter your email and we'll send you a reset code.
            </p>

            <div className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="forgot-email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="forgot-email"
                            type="email"
                            placeholder="you@company.com"
                            className="pl-9"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                    className="w-full gap-2"
                    style={btnStyle}
                    onClick={handleForgotSend}
                    disabled={!email || isLoading}
                >
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <>Send Reset Code <ArrowRight className="h-4 w-4" /></>}
                </Button>
            </div>
        </>
    );

    // ─── FORGOT OTP + NEW PASSWORD ────────────────────────────────────────────
    if (view === "forgot-otp") return card(
        <>
            <button
                onClick={() => setView("forgot")}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                style={{ color: PRIMARY }} >
                <ChevronLeft className="h-4 w-4" /> Back
            </button>


            <h1 className="text-2xl font-bold tracking-tight mb-1">Reset password</h1>
            <p className="text-sm text-muted-foreground mb-6">
                Enter the code sent to <span className="font-medium text-foreground">{email}</span> and choose a new password.
            </p>

            <div className="space-y-5">
                <div>
                    <Label className="mb-2 block">Verification Code</Label>
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
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="new-password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-9"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="confirm-password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-9"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                    className="w-full gap-2"
                    style={btnStyle}
                    onClick={handleResetPassword}
                    disabled={otp.join("").length !== 6 || !newPassword || !confirmPassword || isLoading}
                >
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <>Reset Password <ArrowRight className="h-4 w-4" /></>}
                </Button>
            </div>
        </>
    );

    // ─── SUCCESS ──────────────────────────────────────────────────────────────
    if (view === "reset-success") return card(
        <div className="text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl mx-auto mb-4" style={{ backgroundColor: `${PRIMARY}18` }}>
                <ShieldCheck className="h-7 w-7" style={{ color: PRIMARY }} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Password reset!</h1>
            <p className="text-sm text-muted-foreground mb-6">
                Your password has been updated successfully. You can now sign in with your new password.
            </p>
            <Button
                className="w-full"
                style={btnStyle}
                onClick={() => { setView("login"); setOtp(["", "", "", "", "", ""]); setNewPassword(""); setConfirmPassword(""); }}
            >
                Back to Sign In
            </Button>
        </div>
    );

    return null;
}