import { Main, Footer } from "../../components/layout/index";
import { HeaderTop, PersonalInf, OrganizationInfo, ConfigProfile} from "./components/index";

export default function Profile() {
  return (
    <Main bottom={<Footer />} top={<HeaderTop/>}>
        <PersonalInf/>
        <OrganizationInfo/>
        <ConfigProfile/>
    </Main>     
  );
}