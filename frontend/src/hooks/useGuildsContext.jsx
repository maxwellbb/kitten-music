import { GuildsContext } from "../context/GuildsContext"
import { useContext } from "react"

export const useGuildsContext = () => {
  const context = useContext(GuildsContext)

  if(!context) {
    throw Error('Guilds context not found')
  }

  return context
}