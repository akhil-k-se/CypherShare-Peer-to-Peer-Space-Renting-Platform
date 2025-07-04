import React, { useEffect, useState } from "react";
import { HoveredLink, Menu, MenuItem } from "./navbar-menu";
import { cn } from "../lib/utils";
import gsap from "gsap";
import { Button } from "./moving-border";
import SoundToggle from "../SoundToggle";
import { playClickSound } from "../playClickSound";
import { useNavigate } from "react-router-dom";
import { HiOutlineMenu, HiX } from "react-icons/hi"; // For hamburger icon

export function NavbarDemo({ onLoginClick }) {
  const [isShortScreen, setIsShortScreen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight;
      setIsShortScreen(height < 600);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".nav1",
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 2, ease: "power4.out" }
    );
  }, []);

  const handleNavClick = (id) => {
    const target = document.getElementById(id);
    if (target && window.smoother) {
      playClickSound();
      window.smoother.scrollTo(target, true, "top top");
      setMobileMenuOpen(false); // close menu
    }
  };

  return (
    <>
      <div className="w-full px-4 pt-2 flex items-center justify-between z-40 nav1 h-[70px] absolute">
        <div
          className={`font-orbitron select-none ${
            isShortScreen ? "text-lg" : "text-xl xl:text-4xl"
          }`}
        >
          CypherShare
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 z-50 hidden sm:block">
          <Navbar
            onLoginClick={onLoginClick}
            className="relative"
            isShortScreen={isShortScreen}
          />
        </div>

        <div className="flex items-center gap-2">
          <SoundToggle />
          <Button
            className={`hover:cursor-pointer px-4 py-2 ${
              isShortScreen ? "text-xs" : "text-sm"
            }`}
            onClick={() => {
              playClickSound();
              window.open(
                "https://github.com/akhil-k-se/CypherShare-Peer-to-Peer-Space-Renting-Platform/releases/download/v1.0.3/CypherShare.Setup.1.0.3.exe",
                "_blank"
              );
            }}
          >
            Download
          </Button>

          <button
            className="sm:hidden text-white text-3xl"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <HiX /> : <HiOutlineMenu />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden fixed top-16 left-0 w-full bg-black text-white z-50 shadow-xl py-4 px-6 font-montserrat space-y-4">
          <div
            onClick={() => handleNavClick("how-it-works")}
            className="cursor-pointer hover:text-blue-400"
          >
            How It Works
          </div>
          <div
            onClick={() => handleNavClick("features")}
            className="cursor-pointer hover:text-blue-400"
          >
            Features
          </div>
          <div
            onClick={() => handleNavClick("pricing")}
            className="cursor-pointer hover:text-blue-400"
          >
            Pricing
          </div>
          <div
            onClick={() => {
              onLoginClick();
              setMobileMenuOpen(false);
            }}
            className="cursor-pointer hover:text-blue-400"
          >
            Login
          </div>
        </div>
      )}
    </>
  );
}

function Navbar({ className, isShortScreen, onLoginClick }) {
  const [active, setActive] = useState(null);
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "fixed top-2 inset-x-0 max-w-2xl mx-auto z-50 font-montserrat ",
        className
      )}
    >
      <Menu setActive={setActive}>
        {/* Platform section */}
        {/* <MenuItem setActive={setActive} active={active} item="Home">
          <div
            className={`flex flex-col space-y-3 text-sm ${
              isShortScreen ? "text-xs space-y-2" : "text-sm"
            }`}
          >
            <HoveredLink href="/renter-dashboard">Renter Dashboard</HoveredLink>
            <HoveredLink href="/provider-dashboard">
              Provider Dashboard
            </HoveredLink>
            <HoveredLink href="/desktop-agent">Desktop Agent</HoveredLink>
            <HoveredLink href="/file-security">File Security</HoveredLink>
          </div>
        </MenuItem> */}

        {/* Technology section with images */}
        <MenuItem
          setActive={setActive}
          active={active}
          item="How It Works"
          onClick={() => {
            playClickSound(); // optional

            const target = document.getElementById("how-it-works");
            if (target && window.smoother) {
              console.log(target);
              window.smoother.scrollTo(target, true, "top top");
            }
          }}
        >
          {/* <div
            className={`grid ${
              isShortScreen ? "grid-cols-1 gap-4" : "grid-cols-2 gap-10"
            } text-sm p-4`}
          >
            <ProductItem
              title="IPFS Storage"
              href="/ipfs"
              src="https://upload.wikimedia.org/wikipedia/commons/8/8a/IPFS_logo.svg"
              description="Decentralized file storage using IPFS nodes."
            />
            <ProductItem
              title="AES-256 Encryption"
              href="/encryption"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Lock-red.svg/1200px-Lock-red.svg.png"
              description="Military-grade encryption for all transfers."
            />
            {!isShortScreen && (
              <>
                <ProductItem
                  title="Electron Agent"
                  href="/desktop-agent"
                  src="https://upload.wikimedia.org/wikipedia/commons/9/91/Electron_Software_Framework_Logo.svg"
                  description="Lightweight desktop agent to serve & sync files."
                />
                <ProductItem
                  title="Sync Engine"
                  href="/sync"
                  src="https://cdn-icons-png.flaticon.com/512/545/545680.png"
                  description="Auto sync files between IPFS and user nodes."
                />
              </>
            )}
          </div> */}
        </MenuItem>

        <MenuItem
          setActive={setActive}
          active={active}
          item="Features"
          onClick={() => {
            playClickSound(); // optional

            const target = document.getElementById("features");
            if (target && window.smoother) {
              console.log(target);
              window.smoother.scrollTo(target, true, "top top");
            }
          }}
        ></MenuItem>

        <MenuItem
          setActive={setActive}
          active={active}
          item="Pricing"
          onClick={() => {
            playClickSound(); // optional

            const target = document.getElementById("pricing");
            if (target && window.smoother) {
              console.log(target);
              window.smoother.scrollTo(target, true, "top top");
            }
          }}
        >
          <div
            className={`flex flex-col space-y-3 text-sm ${
              isShortScreen ? "text-xs space-y-2" : "text-sm"
            }`}
          >
            <HoveredLink href="/pricing/free">Free Tier</HoveredLink>
            <HoveredLink href="/pricing/premium">Premium</HoveredLink>
            <HoveredLink href="/pricing/enterprise">Enterprise</HoveredLink>
            {/* <HoveredLink href="/pricing/comparison">Compare Plans</HoveredLink> */}
          </div>
        </MenuItem>

        <MenuItem
          setActive={setActive}
          active={active}
          onClick={onLoginClick}
          item="Login"
        ></MenuItem>
      </Menu>
    </div>
  );
}
