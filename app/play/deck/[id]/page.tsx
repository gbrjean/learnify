import MCQ from "@components/play-multi-game/MCQ"
import OpenEnded from "@components/play-multi-game/OpenEnded"
import { getGameOfGroup } from "@lib/actions/game.actions";
import { getCurrentUser } from "@lib/actions/user.actions";
import { GroupGame } from "@types";


const DeckGame = async ({ params }: { params: { id: string } }) => {

  if(!params.id) return null;

  const session = await getCurrentUser()
  if(!session?.user) return null;

  const group = await getGameOfGroup(params.id, 'deck') as GroupGame | null

  if(!group) return null
  
  if(group.games_type == 'mcq'){
    return <MCQ group={group} />
  } else {
    return <OpenEnded group={group} />
  }
}

export default DeckGame