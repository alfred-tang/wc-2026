import { useState, useRef, useEffect } from "react";

import supabase from "../../utils/supabase";

import {
    PiPlayFill,
    PiPauseFill,
    PiCaretLeft,
    PiCaretRight,
    PiUser,
    PiLock,
} from "react-icons/pi";

import "./Auth.css";

function Auth({ onSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [started, setStarted] = useState(false);

    const videoRef = useRef(null);
    const emailRef = useRef(null);

    const signIn = async () => {
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.log(error.message);
        } else {
            onSuccess?.();
        }

        setLoading(false);
    };

    const toggleVideo = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }

        setIsPlaying((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        await signIn();
    };

    useEffect(() => {
        if (started) return;

        const handleKeyDown = () => {
            setStarted(true);
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [started]);

    useEffect(() => {
        if (started) {
            emailRef.current?.focus();
        }
    }, [started]);

    return (
        <div className="auth-background">
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                className="background-video"
            >
                <source src="/assets/tournament/intro-opt.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <button className="video-button" onClick={toggleVideo}>
                {isPlaying ? <PiPauseFill /> : <PiPlayFill />}
            </button>

            <div className={`login-container ${started ? "transparent-card" : ""}`}>
                <div className="welcome-board">
                    <img
                        id="world-cup-logo"
                        src="/assets/tournament/wc-2026-logo-white.svg"
                        alt="world-cup-2026-logo"
                    />
                    <h1>
                        Welcome to{" "}
                        <span style={{ color: "var(--light-gold)" }}>World Cup 2026</span>
                    </h1>
                </div>

                {!started && (
                    <div
                        className="press-any-key"
                        onClick={() => setStarted(true)}
                    >
                        Press Any Key
                    </div>
                )}

                {started && (
                    <form className="auth-panel" onSubmit={handleSubmit}>
                        <div className="auth-input">
                            <div className="login-info">
                                <PiUser />
                                <input
                                    ref={emailRef}
                                    placeholder="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="login-info">
                                <PiLock />
                                <input
                                    type="password"
                                    placeholder="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="button-container">
                            <button
                                type="button"
                                className="auth-button back-btn"
                                onClick={() => setStarted(false)}
                            >
                                <PiCaretLeft />
                                Back
                            </button>
                            <button
                                type="submit"
                                className="auth-button login-btn"
                                disabled={loading}
                            >
                                Login
                                <PiCaretRight />
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Auth;
