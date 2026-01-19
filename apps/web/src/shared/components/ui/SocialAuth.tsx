import { Button } from '../../../shared/components/ui'
import { AiOutlineGoogle, AiOutlineGithub } from 'react-icons/ai'

export function SocialAuth() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button variant="outline">
        <AiOutlineGoogle className="text-lg" />
        Google
      </Button>

      <Button variant="outline">
        <AiOutlineGithub className="text-lg"  />
        GitHub
      </Button>
    </div>
  )
}
