import { UseFormRegisterReturn } from "react-hook-form";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  register?: UseFormRegisterReturn;
  label?: string;
}

export default function Input(props: Props) {
  return (
    <div className="flex flex-col gap-2 text-textColor font-normal">
      {props.label && <label>{props.label}:</label>}
      <input
        className={"min-w-64 w-full py-2 px-3 placeholder:gray-400 rounded-2xl bg-HeaderBgColor outline-none border-2 border-gray-400 focus:border-themeColor focus:border-opacity-70 disabled:opacity-40 sm:disabled:w-custom"}
        {...props}
        {...props.register}
      />
    </div>
  )
}