import { Button } from '../shared/index'
import { AiOutlineGoogle, AiOutlineGithub } from "react-icons/ai";
export default function SocialAuth() {
    return (
        <>
        <div className="flex items-center gap-4 my-6">
            <span className="h-px flex-1 bg-[#FF7A1A]" />
            <span className="text-xs text-[#FF7A1A] font-medium">
              OR CONTINUE WITH
            </span>
            <span className="h-px flex-1 bg-[#FF7A1A]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline">
              <AiOutlineGoogle />
              Google
            </Button>
            <Button variant="outline">
              <AiOutlineGithub />
              GitHub
            </Button>
          </div>
          </>
    );
}