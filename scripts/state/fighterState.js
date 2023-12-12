import { HEALTH_MAX_HIT_POINTS } from "../Constants.js";

export const createDefaultFighterState =(id) => ({
    id,
    //battles:0,
    hitPoints:HEALTH_MAX_HIT_POINTS,
});