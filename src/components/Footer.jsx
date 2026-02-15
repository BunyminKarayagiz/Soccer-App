import React from "react";
import NavItem from "./NavItem";
import football from "../assets/footerIcons/football.png";
import homeIcon from "../assets/footerIcons/homeIcon.png";
import activeHomeIcon from "../assets/footerIcons/activeHomeIcon.png";
import cupIcon from "../assets/footerIcons/cupIcon.png";
import activeCupIcon from "../assets/footerIcons/activeCupIcon.png";
import teamIcon from "../assets/footerIcons/teamIcon.png";
import activeTeamIcon from "../assets/footerIcons/activeTeamIcon.png";
import playerIcon from "../assets/footerIcons/playerIcon.png";
import activePlayerIcon from "../assets/footerIcons/activePlayerIcon.png";
import stadIcon from "../assets/footerIcons/stadIcon.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-auto min-h-[140px] md:h-[140px] bg-[#240046] overflow-hidden flex flex-col md:flex-row items-center justify-between py-6 md:py-0 px-4 md:px-0">
      <div className="flex items-center mb-6 md:mb-0">
        <img
          src={football}
          alt="Football"
          className="
        hidden md:block
        ml-0 md:ml-[140px]
      mt-0 md:mt-[60px]
      w-[150px] md:w-[244px] h-[161px] md:h-[262px]
      opacity-60
      z-0
      pointer-events-none
    "
        />

        {/* Title */}
        <h1
          onClick={() => {
            navigate(`/`);
          }}
          className="
          ml-0 md:ml-[-300px]
      text-4xl md:text-[80px]
      z-10
      font-inter
      cursor-pointer
    "
        >
          <span className="text-white">Soccer</span>
          <span className="text-[#E1FF00] font-bold">Ball</span>
        </h1>
      </div>

      <div className="flex gap-6 md:gap-20 text-white flex-wrap justify-center">
        <NavItem
          onClick={() => {
            navigate(`/`);
          }}
          activeIcon={activeHomeIcon}
          inActiveIcon={homeIcon}
          label="Home"
          active={location.pathname === "/"}
        />
        <NavItem
          onClick={() => {
            navigate(`/leagues`);
          }}
          activeIcon={activeCupIcon}
          inActiveIcon={cupIcon}
          label="Leagues"
          active={isActive("/league")}
        />
        <NavItem
          onClick={() => {
            navigate(`/teams`);
          }}
          activeIcon={activeTeamIcon}
          inActiveIcon={teamIcon}
          label="Teams"
           active={isActive("/team")}
        />
        <NavItem
          onClick={() => {
            navigate(`/players`);
          }}
          activeIcon={activePlayerIcon}
          inActiveIcon={playerIcon}
          label="Players"
           active={isActive("/player")}
        />
      </div>
      <img
        src={stadIcon}
        alt="Stadium"
        className="hidden md:block w-[200px] md:w-[340px] h-[182px] md:h-[310px] rotate-[-40deg] opacity-60 mr-0 md:mr-[150px] mt-6 md:mt-0"
      />
    </div>
  );
}

export default Footer;
