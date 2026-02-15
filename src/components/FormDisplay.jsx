function FormDisplay({ form }) {
  return (
    <div className="flex">
      {form.split("").map((char, index) => {
        let color = "";
        if (char === "W") color = "text-green-600";
        if (char === "L") color = "text-red-600";
        if (char === "D") color = "text-gray-500";

        return (
          <div
            key={index}
            className={`w-[3vh] h-[3vh] max-w-[3vh] ${color} flex items-center justify-center rounded-[.3vh] text-[1.5vh] font-bold`}
          >
            {char}
          </div>
        );
      })}
    </div>
  );
}

export default FormDisplay;