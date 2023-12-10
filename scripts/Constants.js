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
};

export const PushBox ={
    IDLE:[-16,-80,32,78],//position calculated from origin
    JUMP:[-16,-91,32,66],
    BEND:[-16,-58,32,58],
    CROUCH:[-16,-50,32,50],
}

export const PUSH_FRICTION=60;