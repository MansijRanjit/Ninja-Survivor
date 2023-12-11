import { FighterId } from "../Constants.js";
import { createDefaultFighterState } from "./fighterState.js";

export const gameState ={
    fighters: [
        createDefaultFighterState(FighterId.NINJA),
        createDefaultFighterState(FighterId.TURTLE)
    ],
}