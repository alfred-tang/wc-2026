import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { PiSignOutBold, PiListBold, PiXBold } from "react-icons/pi";

import supabase from "../../../utils/supabase.js";

import "./Header.css";

function Header() {
    const [isShrunk, setIsShrunk] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();


    const links = ["Prediction", "Teams", "Standings", "Matches", "Stadiums"];

    const currentPage =
        links.find((link) => location.pathname === `/${link}`) ??
        "Home";

    useEffect(() => {
        const handleScroll = () => {
            setIsShrunk(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

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

                <div className="mobile-page-title">
                    {currentPage}
                </div>

                <nav className={`header-nav ${menuOpen ? "open" : ""}`}>
                    {links.map((link) => (
                        <Link
                            key={link}
                            to={`/${link}`}
                            onClick={() => setMenuOpen(false)}
                            className={`header-link ${location.pathname === `/${link}` ? "active" : ""}`}
                            style={{
                                "--color-hover": `var(--${isShrunk && !menuOpen ? "primary-gold" : "light-gold"})`,
                            }}
                        >
                            {link.toUpperCase()}
                        </Link>
                    ))}
                    <button className="sign-out-button mobile" onClick={handleSignOut}>
                        <PiSignOutBold />
                        <span>Sign Out</span>
                    </button>
                </nav>

                <button
                    className={`mobile-menu-btn ${menuOpen ? "open" : ""}`}
                    onClick={() => setMenuOpen((prev) => !prev)}
                >
                    {menuOpen ? <PiXBold /> : <PiListBold />}
                </button>

                <button className="sign-out-button desktop" onClick={handleSignOut}>
                    <PiSignOutBold />
                </button>
            </div>
        </header>
    );
}

export default Header;
