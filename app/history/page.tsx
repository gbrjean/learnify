import History from "@components/History";
import { getCurrentUser } from "@lib/actions/user.actions";

const HistoryPage = async () => {

  const session = await getCurrentUser()
  if(!session?.user) return null;
  

  return (
    <History />
  )
}

export default HistoryPage