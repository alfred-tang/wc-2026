import { useState, useRef } from "react";

import supabase from "../../utils/supabase";

import { PiPlayFill, PiPauseFill } from "react-icons/pi";

import "./Auth.css";

function Auth({ onSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);

    const videoRef = useRef(null);

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

            <div className="login-container transparent-card">
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
                <div className="auth-input">
                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="auth-buttons">
                    <button disabled={loading} onClick={signIn}>
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Auth;
