"use client";
import React, { useEffect, useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "./lib/utils";
import gsap from "gsap";
import { Button } from "./ui/moving-border";

export function NavbarDemo() {
  const [isShortScreen, setIsShortScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight;
      setIsShortScreen(height < 600);
    };

    handleResize(); // on mount
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

  return (
    <>
      <Navbar className="nav1 fixed" isShortScreen={isShortScreen} />

      <div className="relative w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center z-40">
          {/* Download button */}
          <div className="top-2 right-2 absolute z-40 hover:cursor-pointer nav1">
            <Button
              className="hover:cursor-pointer px-4 py-2 text-xs md:text-sm"
              onClick={() => {
                window.open(
                  "https://github.com/akhil-k-se/CypherShare-Peer-to-Peer-Space-Renting-Platform/releases/download/v1.0.1/CypherShare.Setup.1.0.0.exe",
                  "_blank"
                );
              }}
            >
              Download
            </Button>
          </div>

          {/* Logo / Title */}
          <div
            className={`top-6 left-3 absolute z-40 nav1 font-orbitron select-none pointer-events-none hidden lg:block ${
              isShortScreen ? "text-xl xl:top-2" : "text-2xl xl:text-4xl xl:top-5"
            }`}
          >
            CypherShare
          </div>
        </div>
      </div>
    </>
  );
}

function Navbar({ className, isShortScreen }) {
  const [active, setActive] = useState(null);

  return (
    <div
      className={cn(
        "fixed top-2 inset-x-0 max-w-2xl mx-auto z-50 font-montserrat",
        className
      )}
    >
      <Menu setActive={setActive}>
        {/* Platform section */}
        <MenuItem setActive={setActive} active={active} item="Platform">
          <div
            className={`flex flex-col space-y-3 text-sm ${
              isShortScreen ? "text-xs space-y-2" : "text-sm"
            }`}
          >
            <HoveredLink href="/renter-dashboard">Renter Dashboard</HoveredLink>
            <HoveredLink href="/provider-dashboard">Provider Dashboard</HoveredLink>
            <HoveredLink href="/desktop-agent">Desktop Agent</HoveredLink>
            <HoveredLink href="/file-security">File Security</HoveredLink>
          </div>
        </MenuItem>

        {/* Technology section with images */}
        <MenuItem setActive={setActive} active={active} item="Technology">
          <div
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
          </div>
        </MenuItem>

        {/* Pricing section */}
        <MenuItem setActive={setActive} active={active} item="Pricing">
          <div
            className={`flex flex-col space-y-3 text-sm ${
              isShortScreen ? "text-xs space-y-2" : "text-sm"
            }`}
          >
            <HoveredLink href="/pricing/free">Free Tier</HoveredLink>
            <HoveredLink href="/pricing/premium">Premium</HoveredLink>
            <HoveredLink href="/pricing/enterprise">Enterprise</HoveredLink>
            <HoveredLink href="/pricing/comparison">Compare Plans</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
