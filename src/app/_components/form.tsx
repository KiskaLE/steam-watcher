import { type InputHTMLAttributes } from "react";
import cn from "classnames";

type FieldProps = {
  id: string;
  name: string;
  type: InputHTMLAttributes<HTMLInputElement>["type"];
  value?: InputHTMLAttributes<HTMLInputElement>["value"];
  onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
  onBlur?: InputHTMLAttributes<HTMLInputElement>["onBlur"];
  label?: string;
  errorMessage?: string;
};

export function Input({
  id,
  name,
  type,
  value,
  onChange,
  onBlur,
  errorMessage,
  label,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      {label ? <label htmlFor={name}>{label}</label> : null}
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        className={cn("rounded-md border px-2 py-1 focus:outline-none", {
          "border-red-500": errorMessage,
        })}
      />
      {errorMessage ? (
        <em className="text-red-500" role="alert">
          {errorMessage}
        </em>
      ) : null}
    </div>
  );
}
