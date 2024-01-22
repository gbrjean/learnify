import Profile from "@components/Profile";
import { getCurrentUser, getUserProfile } from "@lib/actions/user.actions";
import { UserProfile } from "@types";
import { redirect } from "next/navigation";


const ProfilePage = async () => {

  const session = await getCurrentUser()
  if(!session?.user) return null;

  let profile: UserProfile | null

  try {
    profile = await getUserProfile() as UserProfile | null
    console.log(profile)
  } catch (error) {
    redirect('/')
  }
  
  if(!profile) return null;

  return (
    <Profile data={profile} />
  )
}

export default ProfilePage