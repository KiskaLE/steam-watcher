import type { ButtonHTMLAttributes, DOMAttributes } from "react";
import cn from "classnames";

type Props = {
  children: React.ReactNode;
  onClick?: DOMAttributes<HTMLButtonElement>["onClick"];
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  varian: "primary" | "secondary";
};

export default function Button({ children, onClick, type, varian }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn("rounded-md px-4 py-2", {
        "bg-black text-white": varian === "primary",
        "border-2 border-black bg-inherit font-semibold text-black transition-all duration-200 hover:bg-black hover:text-white":
          varian === "secondary",
      })}
    >
      {children}
    </button>
  );
}
