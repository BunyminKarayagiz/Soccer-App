import React from "react";

function NavItem({ activeIcon,inActiveIcon, label, active }) {
  return (
    <div
      className={`flex flex-col items-center gap-2 cursor-pointer transition-colors
        ${active ? "text-[#E1FF00]" : "text-white hover:text-[#E1FF00]"}`}
    >
      {active ? (
        <img src={activeIcon} alt={`${label} icon`} className="w-[45px] h-[45px]" />
      ) : (
        <img src={inActiveIcon} alt={`${label} icon`} className="w-[45px] h-[45px]" />
      )}
      <span className="text-xl">{label}</span>
    </div>
  );
}

export default NavItem;
