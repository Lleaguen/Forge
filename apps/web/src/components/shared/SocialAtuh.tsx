'use client'
import { Button } from '../shared/index'
import { AiOutlineGoogle, AiOutlineGithub } from "react-icons/ai";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function SocialAuth() {
  const handleGoogle = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleGitHub = () => {
    window.location.href = `${API_URL}/auth/github`;
  };

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
        <Button variant="outline" onClick={handleGoogle}>
          <AiOutlineGoogle size={18} />
          Google
        </Button>
        <Button variant="outline" onClick={handleGitHub}>
          <AiOutlineGithub size={18} />
          GitHub
        </Button>
      </div>
    </>
  );
}
