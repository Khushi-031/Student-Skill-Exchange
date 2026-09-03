import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";

function ResetPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        // Password validation
        const passwordPattern =
            /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

        if (!passwordPattern.test(password)) {
            setError(
                "Password must be at least 8 characters and contain one uppercase letter and one special character."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:3000/reset-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        newPassword: password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            setMessage("Password reset successfully! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            console.log("Reset password error:", error);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="reset-page">

            <div className="reset-card">

                <h1>Reset Password</h1>

                <p className="reset-subtitle">
                    Enter your email and create a new password.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="reset-form-group">
                        <label>
                            Email<span className="required-star">*</span>
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="reset-form-group">
                        <label>
                            New Password<span className="required-star">*</span>
                        </label>

                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <p className="password-hint">
                            Password must contain at least 8 characters,
                            one uppercase letter and one special character.
                        </p>
                    </div>

                    <div className="reset-form-group">
                        <label>
                            Confirm Password
                            <span className="required-star">*</span>
                        </label>

                        <input
                            type="password"
                            placeholder="Enter password again"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            required
                        />
                    </div>

                    {error && (
                        <p className="reset-error">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p className="reset-success">
                            {message}
                        </p>
                    )}

                    <button type="submit" className="reset-btn">
                        Reset Password
                    </button>

                </form>

                <p className="back-login">
                    Remember your password?{" "}
                    <span onClick={() => navigate("/login")}>
                        Login
                    </span>
                </p>

            </div>

        </div>
    );
}

export default ResetPassword;
