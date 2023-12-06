import MCQ from "@components/play-single-game/MCQ"
import OpenEnded from "@components/play-single-game/OpenEnded"
import { getGame } from "@lib/actions/game.actions";
import { getCurrentUser } from "@lib/actions/user.actions";
import { Game } from "@types";


const QuizGame = async ({ params }: { params: { id: string } }) => {

  if(!params.id) return null;

  const session = await getCurrentUser()
  if(!session?.user) return null;

  const game = await getGame(params.id) as Game | null

  if(!game) return null
  
  if(game.game_type == 'mcq'){
    return <MCQ game={game} />
  } else {
    return <OpenEnded game={game} />
  }
}

export default QuizGame