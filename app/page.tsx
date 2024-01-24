import Homepage from "@components/Homepage"
import { getCurrentUser } from "@lib/actions/user.actions";
import { fetchHomepage } from "@lib/actions/others.actions";
import { PopularTopic } from "@types";
import { redirect } from "next/navigation";


const Page = async () => {

  const session = await getCurrentUser()
  if(!session?.user) redirect("/login");

  let data

  try {
    data = await fetchHomepage()
  } catch (error) {
    redirect('/')
  }

  if(!data) return null;

  return (
    <Homepage 
      topics={data.topics as PopularTopic[] | null} 
      history={Array.isArray(data.history) ? data.history : null} 
    />
  )
}

export default Page