import { Button } from "../../../components/shared";
import { FiX } from "react-icons/fi";

export default function ConfigProfile() {
  return (
    <div className="
      mt-8 flex items-center justify-between
      border-t border-brand-border
      pt-6
    ">
      {/* Danger */}
      <Button
        className="
          flex items-center gap-2
          bg-transparent
          text-sm font-bold
          text-red-500
          transition-opacity
          hover:opacity-80
          hover:bg-transparent
          w-60
        "
      >
        <FiX size={14} className="rounded border border-red-300 p-0.5" />
        Deactivate My Account
      </Button>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          className="
            rounded-xl
            bg-slate-100 px-8 py-3
            text-sm font-bold text-slate-600
            transition-colors
            hover:bg-slate-200
            dark:bg-brand-surface2
            dark:text-brand-text
          "
        >
          Cancel
        </Button>

        <Button
          className="
            rounded-xl
            bg-brand-primary px-8 py-3
            text-sm font-bold text-white
            shadow-lg shadow-brand-primary/20
            transition-colors
            hover:bg-brand-primaryHover
          "
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
