export const GameView={
    HEIGHT:222,
    WIDTH:384
};

export const FighterDirection ={
    LEFT: -1,
    RIGHT: 1
};

export const FighterState={
    IDLE:'idle',
    WALK_FORWARD: 'walkForward',
    WALK_BACKWARD:'walkBackward',
    JUMP_UP:'jumpUp',
    JUMP_FORWARD: 'jumpForward',
    JUMP_BACKWARD:'jumpBackward',
    CROUCH_DOWN:'crouchDown',
    CROUCH:'crouch',
    CROUCH_UP:'crouchUp',
    SLASH:'slash',
    KICK:'kick',
    HURT:'hurt',
    SPECIAL:'special',
};

export const PushBox ={
    IDLE:[-16,-80,32,78],//position calculated from origin
    JUMP:[-16,-91,32,66],
    BEND:[-16,-58,32,58],
    CROUCH:[-16,-50,32,50],
}

export const PUSH_FRICTION=60;

export const HurtBoxTurtle ={
    IDLE:[[-10,-74,24,20],[-26,-54,40,22],[-24,-31,40,32]],//position calculated from origin
}
export const HurtBoxNinja ={
    IDLE:[[-8,-86,24,14],[-18,-72,40,40],[-20,-31,40,32]],//position calculated from origin
}

export const FighterAttackType ={
    SLASH:'slash',
    KICK:'kick',
    SPECIAL:'special'
}


export const FighterId ={
    NINJA:'Ninja',
    TURTLE:'Turtle'
}

export const HEALTH_MAX_HIT_POINTS=144;
export const HEALTH_COLOR='#F3F300'; //remaining health -yellow color
export const HEALTH_DAMAGE_COLOR='#F30000';//damage points -red color

export const FighterAttackBaseData ={
    [FighterAttackType.SLASH]:{
        damage:5
    },
    [FighterAttackType.KICK]:{
        damage:2
    },
    [FighterAttackType.SPECIAL]:{
        damage:5
    }
}

export const NinjaStarState={
    ACTIVE: 'active',
    COLLIDED: 'collided',
}

// export const NinjaStarCollidedState ={
//     NONE:'none',
//     OPPONENT:'opponent',
//     NINJASTAR:'ninjaStar'
// }