namespace SpriteKind {
    export const UI = SpriteKind.create()
    export const Bomb = SpriteKind.create()
}
function explode () {
    animation.runImageAnimation(
    bomb,
    assets.animation`Explosion`,
    100,
    false
    )
    nearby_enemies = spriteutils.getSpritesWithin(SpriteKind.Enemy, 60, bomb)
    for (let value of nearby_enemies) {
        sprites.destroy(value)
        enemy_count += -1
        update_enemy_counter()
        info.changeScoreBy(100)
    }
    pause(400)
    bomb.setImage(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `)
    has_bomb = true
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (has_bomb) {
        has_bomb = false
        x_vel = Render.getAttribute(Render.attribute.dirX) * throw_speed
        y_vel = Render.getAttribute(Render.attribute.dirY) * throw_speed
        bomb.setPosition(me.x, me.y)
        bomb.setImage(assets.image`Bomb`)
        bomb.setVelocity(x_vel, y_vel)
        Render.jumpWithHeightAndDuration(bomb, 5, 750)
        timer.after(750, function () {
            explode()
        })
    }
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (projectile, enemy) {
    tilesAdvanced.followUsingPathfinding(enemy, me, 0)
    enemy_count += -1
    update_enemy_counter()
    info.changeScoreBy(100)
    projectile.destroy()
    enemy.destroy(effects.ashes)
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    x_vel = Render.getAttribute(Render.attribute.dirX) * projectile_speed
    y_vel = Render.getAttribute(Render.attribute.dirY) * projectile_speed
    projectile = sprites.createProjectileFromSprite(assets.image`projectile`, me, x_vel, y_vel)
    Render.setSpriteAttribute(projectile, RCSpriteAttribute.ZOffset, randint(-3, 0))
})
function setup_level () {
    tiles.setCurrentTilemap(tilemap`level`)
    tiles.placeOnRandomTile(me, assets.tile`player spawn`)
    info.setLife(3)
    spawn_wave()
}
function update_enemy_counter () {
    enemy_counter.setText("Left in wave:" + enemy_count)
}
function spawn_enemy () {
    ghost = sprites.create(assets.image`ghost`, SpriteKind.Enemy)
    while (spriteutils.distanceBetween(me, ghost) < 300) {
        tiles.placeOnRandomTile(ghost, assets.tile`enemy spawn`)
    }
    tilesAdvanced.followUsingPathfinding(ghost, me, randint(10, 60))
}
function spawn_wave () {
    wave_number += 1
    for (let index = 0; index < wave_number; index++) {
        spawn_enemy()
        enemy_count += 1
    }
    update_enemy_counter()
    music.beamUp.play()
}
function check_danger () {
    nearby_enemies = spriteutils.getSpritesWithin(SpriteKind.Enemy, 80, me)
    if (nearby_enemies.length > 0) {
        warning_sprite.setFlag(SpriteFlag.Invisible, false)
    } else {
        warning_sprite.setFlag(SpriteFlag.Invisible, true)
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (me, enemy) {
    info.changeLifeBy(-1)
    music.knock.play()
    me.vx = enemy.vx * knockback_force
    me.vy = enemy.vy * knockback_force
    Render.jumpWithHeightAndDuration(me, 2, 300)
    timer.after(300, function () {
        me.setVelocity(0, 0)
    })
    enemy.destroy()
    spawn_enemy()
})
function setup_ui () {
    crosshair = sprites.create(assets.image`crosshair`, SpriteKind.UI)
    crosshair.setFlag(SpriteFlag.RelativeToCamera, true)
    warning_sprite = sprites.create(assets.image`warning`, SpriteKind.UI)
    warning_sprite.setFlag(SpriteFlag.RelativeToCamera, true)
    animation.runImageAnimation(
    warning_sprite,
    assets.animation`warning animation`,
    600,
    true
    )
    enemy_counter = textsprite.create("", 1, 3)
    update_enemy_counter()
    enemy_counter.setFlag(SpriteFlag.RelativeToCamera, true)
    enemy_counter.setPosition(80, 115)
}
let crosshair: Sprite = null
let warning_sprite: Sprite = null
let ghost: Sprite = null
let enemy_counter: TextSprite = null
let projectile: Sprite = null
let y_vel = 0
let x_vel = 0
let nearby_enemies: Sprite[] = []
let me: Sprite = null
let bomb: Sprite = null
let throw_speed = 0
let has_bomb = false
let enemy_count = 0
let wave_number = 0
let knockback_force = 0
let projectile_speed = 0
projectile_speed = 120
knockback_force = 4
wave_number = 0
enemy_count = 0
has_bomb = true
throw_speed = 60
bomb = sprites.create(img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `, SpriteKind.Bomb)
me = Render.getRenderSpriteVariable()
Render.moveWithController(4, 3)
setup_ui()
setup_level()
game.onUpdate(function () {
    check_danger()
    if (enemy_count < 1) {
        spawn_wave()
    }
})
