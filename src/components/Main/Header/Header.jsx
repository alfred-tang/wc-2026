import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { PiSignOutBold } from "react-icons/pi";

import supabase from "../../../utils/supabase.js";

import "./Header.css";

function Header() {
    const [isShrunk, setIsShrunk] = useState(false);

    const [session, setSession] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    const links = ["prediction", "teams", "standings", "matches", "stadiums"];

    useEffect(() => {
        const handleScroll = () => {
            setIsShrunk(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);


    const handleSignOut = async (e) => {
        e.preventDefault();

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.log("Error signing out:", error);
        }

        navigate("/");
    };

    return (
        <header>
            <div className={`header-background ${isShrunk ? "shrink" : ""}`}></div>
            <div className={`header ${isShrunk ? "shrink" : ""}`}>
                <div className="logo-container">
                    <img
                        id="world-cup-logo"
                        src="/assets/tournament/wc-2026-logo.svg"
                        alt="world-cup-2026-logo"
                    />
                    <div className="logo-background">
                        <img
                            id="world-cup-logo"
                            src="/assets/tournament/wc-2026-logo-white.svg"
                            alt="world-cup-2026-logo"
                        />
                    </div>
                </div>

                {links.map((link) => (
                    <Link
                        key={link}
                        to={`/${link}`}
                        className={`header-link ${location.pathname === `/${link}` ? "active" : ""}`}
                        style={{
                            "--color-hover": `var(--${isShrunk ? "primary-gold" : "light-gold"})`,
                        }}
                    >
                        {link.toUpperCase()}
                    </Link>
                ))}

                <button className="sign-out-button" onClick={handleSignOut}>
                    <PiSignOutBold />
                </button>
            </div>
        </header>
    );
}

export default Header;
