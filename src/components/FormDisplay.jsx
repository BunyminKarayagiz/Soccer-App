function FormDisplay({ form }) {
  return (
    <div className="flex gap-0.5 justify-center">
      {form.split("").map((char, index) => {
        let color = "";
        if (char === "W") color = "text-green-600";
        if (char === "L") color = "text-red-600";
        if (char === "D") color = "text-gray-500";

        return (
          <div
            key={index}
            className={`w-[18px] h-[18px] sm:w-[3vh] sm:h-[3vh] ${color} flex items-center justify-center rounded-sm sm:rounded-[.3vh] text-[10px] sm:text-[1.5vh] font-bold`}
          >
            {char}
          </div>
        );
      })}
    </div>
  );
}

export default FormDisplay;