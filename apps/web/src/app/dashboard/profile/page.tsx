import { Main, Footer } from '@/components/layout/index'
import { HeaderTop, PersonalInf, OrganizationInfo, ConfigProfile } from '@/app/profile/components/index'

export default function ProfilePage() {
  return (
    <Main bottom={<Footer />} top={<HeaderTop />}>
      <PersonalInf />
      <OrganizationInfo />
      <ConfigProfile />
    </Main>
  )
}