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

function Footer() {
  return (
    <div className="h-[140px] bg-[#240046] overflow-hidden flex items-center justify-between">
      <div className="flex items-center">
        <img
          src={football}
          alt="Football"
          className="
        ml-[140px]
      mt-[60px]
      w-[244px] h-[262px]
      opacity-60
      z-0
      pointer-events-none
    "
        />

        {/* Title */}
        <h1
          className="
          ml-[-300px]
      text-[80px]
      z-10
      font-inter
    "
        >
          <span className="text-white">Soccer</span>
          <span className="text-[#E1FF00] font-bold">Ball</span>
        </h1>
      </div>

      <div className="flex gap-20 text-white">
        <NavItem
          activeIcon={activeHomeIcon}
          inActiveIcon={homeIcon}
          label="Home"
          active
        />
        <NavItem
          activeIcon={activeCupIcon}
          inActiveIcon={cupIcon}
          label="Leagues"
        />
        <NavItem
          activeIcon={activeTeamIcon}
          inActiveIcon={teamIcon}
          label="Teams"
        />
        <NavItem
          activeIcon={activePlayerIcon}
          inActiveIcon={playerIcon}
          label="Players"
        />
      </div>
      <img
        src={stadIcon}
        alt="Stadium"
        className="w-[340px] h-[310px] rotate-[-40deg] opacity-60 mr-[150px]"
      />
    </div>
  );
}

export default Footer;
