//Control enum
export const Control={
    LEFT:'left',
    RIGHT: 'right',
    UP:'up',
    DOWN:'down',
    SLASH:'slash',
    KICK:'kick',
    SPECIAL: 'special',
};

export const controls=[
    {
        keyboard:{
            [Control.LEFT]:'KeyA',
            [Control.RIGHT]:'KeyD',
            [Control.UP]:'KeyW',
            [Control.DOWN]:'KeyS',
            [Control.SLASH]:'KeyR',
            [Control.KICK]:'KeyT',
            [Control.SPECIAL]:'KeyY'
        }     
    },
    {
        keyboard:{
            [Control.LEFT] :'ArrowLeft',
            [Control.RIGHT]:'ArrowRight',
            [Control.UP]:'ArrowUp',
            [Control.DOWN]:'ArrowDown',
            [Control.SLASH]:'Slash',
            [Control.KICK]:'Period',
            [Control.SPECIAL]:'Comma'
        },
    }
]