enum ActionKind {
    Walking,
    Idle,
    Jumping,
    下に進む,
    上に進む,
    左に進む,
    右に進む,
    下方向に攻撃
}
namespace SpriteKind {
    export const Sword = SpriteKind.create()
    export const EnemyProjectile = SpriteKind.create()
    export const Trap = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Trap, function (sprite, otherSprite) {
    if (!(sprites.readDataBoolean(mySprite, "damaging"))) {
        sprites.setDataBoolean(mySprite, "damaging", true)
        sprites.setDataBoolean(mySprite, "visible", true)
        statusbars.getStatusBarAttachedTo(StatusBarKind.Health, sprite).value += -5
        music.play(music.createSoundEffect(WaveShape.Square, 571, 1, 255, 0, 400, SoundExpressionEffect.Vibrato, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
        scene.cameraShake(4, 500)
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.EnemyProjectile, function (sprite, otherSprite) {
    if (!(sprites.readDataBoolean(mySprite, "damaging"))) {
        sprites.setDataBoolean(mySprite, "damaging", true)
        sprites.setDataBoolean(mySprite, "visible", true)
        statusbars.getStatusBarAttachedTo(StatusBarKind.Health, sprite).value += -10
        music.play(music.createSoundEffect(WaveShape.Square, 571, 1, 255, 0, 400, SoundExpressionEffect.Vibrato, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
        scene.cameraShake(4, 500)
    }
})
function 初期設定 () {
    mySprite = sprites.create(assets.image`myImage4`, SpriteKind.Player)
    sprites.setDataNumber(mySprite, "attacking", 0)
    sprites.setDataNumber(mySprite, "direction", 0)
    sprites.setDataBoolean(mySprite, "damaging", false)
    sprites.setDataBoolean(mySprite, "fighting", false)
    mySprite.z = 20
    プレイヤーHP = statusbars.create(20, 4, StatusBarKind.Health)
    プレイヤーHP.setColor(7, 1)
    プレイヤーHP.attachToSprite(mySprite, -3, 0)
    controller.moveSprite(mySprite)
}
function ボス体当たり () {
    sprites.setDataBoolean(ボス, "dushing", true)
    sprites.setDataNumber(ボス, "direction", 0)
    ボス.setVelocity(0, 0)
    ボス.ax = 0
    ボス.ay = 0
    animation.stopAnimation(animation.AnimationTypes.All, mySprite)
    animation.runImageAnimation(
    ボス,
    assets.animation`boss_dushing`,
    50,
    false
    )
}
statusbars.onStatusReached(StatusBarKind.Health, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 50, function (status) {
    status.setColor(4, 1)
})
function ボス生成 () {
    ボス = sprites.create(assets.image`myImage35`, SpriteKind.Enemy)
    sprites.setDataNumber(ボス, "direction", 0)
    敵HP = statusbars.create(20, 4, StatusBarKind.Health)
    敵HP.attachToSprite(ボス)
    敵HP.setColor(7, 1)
    敵HP.setOffsetPadding(0, 5)
    ボス.setVelocity(25, 25)
    ボス.setBounceOnWall(true)
    ボス.setPosition(136, 91)
    ボス.z = 10
}
statusbars.onZero(StatusBarKind.Health, function (status) {
    if (status.spriteAttachedTo().kind() == SpriteKind.Enemy) {
        sprites.destroy(status.spriteAttachedTo(), effects.spray, 500)
        pause(500)
        game.gameOver(true)
    } else {
        game.gameOver(false)
    }
})
statusbars.onStatusReached(StatusBarKind.Health, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 20, function (status) {
    status.setColor(2, 1)
})
sprites.onOverlap(SpriteKind.Sword, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (!(sprites.readDataBoolean(ボス, "damaging"))) {
        sprites.setDataBoolean(ボス, "damaging", true)
        sprites.setDataBoolean(ボス, "visible", true)
        statusbars.getStatusBarAttachedTo(StatusBarKind.Health, otherSprite).value += -10
        music.play(music.createSoundEffect(WaveShape.Noise, 3929, 3163, 255, 0, 500, SoundExpressionEffect.Tremolo, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
    }
})
function ボス飛び道具生成 () {
    sprites.destroyAllSpritesOfKind(SpriteKind.EnemyProjectile)
    sprites.setDataBoolean(ボス, "attacking", true)
    sprites.setDataNumber(ボス, "direction", 0)
    ボス.setVelocity(0, 0)
    ボス.ax = 0
    ボス.ay = 0
    animation.stopAnimation(animation.AnimationTypes.All, mySprite)
    animation.runImageAnimation(
    ボス,
    assets.animation`boss_attacking`,
    50,
    false
    )
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (!(sprites.readDataBoolean(mySprite, "damaging"))) {
        sprites.setDataBoolean(mySprite, "damaging", true)
        sprites.setDataBoolean(mySprite, "visible", true)
        if (sprites.readDataBoolean(ボス, "dushing")) {
            statusbars.getStatusBarAttachedTo(StatusBarKind.Health, sprite).value += -20
        } else {
            statusbars.getStatusBarAttachedTo(StatusBarKind.Health, sprite).value += -10
        }
        music.play(music.createSoundEffect(WaveShape.Square, 571, 1, 255, 0, 400, SoundExpressionEffect.Vibrato, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
        scene.cameraShake(4, 500)
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (sprites.readDataNumber(mySprite, "attacking") != 1) {
        music.play(music.createSoundEffect(WaveShape.Square, 1, 1595, 255, 0, 100, SoundExpressionEffect.Warble, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
        controller.moveSprite(mySprite, 0, 0)
        sprites.setDataNumber(mySprite, "attacking", 1)
        sprites.setDataSprite(mySprite, "sword", sprites.create(assets.image`Unused`, SpriteKind.Sword))
        sprites.readDataSprite(mySprite, "sword").setPosition(mySprite.x, mySprite.y)
        if (sprites.readDataNumber(mySprite, "direction") == 0 || sprites.readDataNumber(mySprite, "direction") == 3) {
            animation.stopAnimation(animation.AnimationTypes.All, mySprite)
            animation.runImageAnimation(
            mySprite,
            assets.animation`attack_to_downward`,
            75,
            false
            )
            animation.runImageAnimation(
            sprites.readDataSprite(mySprite, "sword"),
            assets.animation`sword_to_downward`,
            75,
            false
            )
        } else if (sprites.readDataNumber(mySprite, "direction") == 1) {
            animation.stopAnimation(animation.AnimationTypes.All, mySprite)
            animation.runImageAnimation(
            mySprite,
            assets.animation`attack_to_upward`,
            75,
            false
            )
            animation.runImageAnimation(
            sprites.readDataSprite(mySprite, "sword"),
            assets.animation`sword_to_upward`,
            75,
            false
            )
        } else if (sprites.readDataNumber(mySprite, "direction") == 2) {
            animation.stopAnimation(animation.AnimationTypes.All, mySprite)
            animation.runImageAnimation(
            mySprite,
            assets.animation`attack_to_rightward`,
            75,
            false
            )
            animation.runImageAnimation(
            sprites.readDataSprite(mySprite, "sword"),
            assets.animation`sword_to_rightward`,
            75,
            false
            )
        } else if (sprites.readDataNumber(mySprite, "direction") == 4) {
            animation.stopAnimation(animation.AnimationTypes.All, mySprite)
            animation.runImageAnimation(
            mySprite,
            assets.animation`attack_to_leftward`,
            75,
            false
            )
            animation.runImageAnimation(
            sprites.readDataSprite(mySprite, "sword"),
            assets.animation`sword_to_leftward`,
            75,
            false
            )
        }
        pause(375)
        sprites.destroy(sprites.readDataSprite(mySprite, "sword"))
        sprites.setDataNumber(mySprite, "attacking", 0)
        controller.moveSprite(mySprite)
    }
})
let mySprite2: Sprite = null
let 敵HP: StatusBarSprite = null
let ボス: Sprite = null
let プレイヤーHP: StatusBarSprite = null
let mySprite: Sprite = null
初期設定()
ボス生成()
scene.setBackgroundColor(13)
tiles.setCurrentTilemap(tilemap`レベル1`)
scene.cameraFollowSprite(mySprite)
tiles.placeOnRandomTile(mySprite, sprites.dungeon.stairSouth)
game.onUpdate(function () {
    if (!(sprites.readDataBoolean(mySprite, "fighting"))) {
        if (mySprite.x > 60 || mySprite.y > 60) {
            sprites.setDataBoolean(mySprite, "fighting", true)
            scene.cameraShake(4, 500)
            music.play(music.createSoundEffect(WaveShape.Square, 103, 1, 255, 0, 300, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
            for (let 値 of tiles.getTilesByType(assets.tile`myTile0`)) {
                tiles.setTileAt(値, sprites.dungeon.floorDark0)
                tiles.setWallAt(値, true)
            }
        }
    }
})
game.onUpdate(function () {
    if (sprites.readDataNumber(mySprite, "attacking") != 1) {
        if (mySprite.vx > 0) {
            if (sprites.readDataNumber(mySprite, "direction") != 2) {
                animation.stopAnimation(animation.AnimationTypes.All, mySprite)
                animation.runImageAnimation(
                mySprite,
                assets.animation`move_to_rightward`,
                100,
                true
                )
                sprites.setDataNumber(mySprite, "direction", 2)
                プレイヤーHP.positionDirection(CollisionDirection.Top)
            }
        } else if (mySprite.vx < 0) {
            if (sprites.readDataNumber(mySprite, "direction") != 4) {
                animation.stopAnimation(animation.AnimationTypes.All, mySprite)
                animation.runImageAnimation(
                mySprite,
                assets.animation`move_to_leftward`,
                100,
                true
                )
                sprites.setDataNumber(mySprite, "direction", 4)
                プレイヤーHP.positionDirection(CollisionDirection.Top)
            }
        } else if (mySprite.vy > 0) {
            if (sprites.readDataNumber(mySprite, "direction") != 3) {
                animation.stopAnimation(animation.AnimationTypes.All, mySprite)
                animation.runImageAnimation(
                mySprite,
                assets.animation`move_to_downward`,
                100,
                true
                )
                sprites.setDataNumber(mySprite, "direction", 3)
                プレイヤーHP.positionDirection(CollisionDirection.Top)
            }
        } else if (mySprite.vy < 0) {
            if (sprites.readDataNumber(mySprite, "direction") != 1) {
                animation.stopAnimation(animation.AnimationTypes.All, mySprite)
                animation.runImageAnimation(
                mySprite,
                assets.animation`move_to_upward`,
                100,
                true
                )
                sprites.setDataNumber(mySprite, "direction", 1)
                プレイヤーHP.positionDirection(CollisionDirection.Bottom)
            }
        } else {
            animation.stopAnimation(animation.AnimationTypes.All, mySprite)
            if (sprites.readDataNumber(mySprite, "direction") == 1) {
                mySprite.setImage(assets.image`myImage15`)
            } else if (sprites.readDataNumber(mySprite, "direction") == 2) {
                mySprite.setImage(assets.image`myImage`)
            } else if (sprites.readDataNumber(mySprite, "direction") == 3) {
                mySprite.setImage(assets.image`myImage4`)
            } else if (sprites.readDataNumber(mySprite, "direction") == 4) {
                mySprite.setImage(assets.image`myImage0`)
            } else {
                mySprite.setImage(assets.image`myImage4`)
            }
        }
    }
})
game.onUpdate(function () {
    if (!(sprites.readDataBoolean(ボス, "attacking"))) {
        if (Math.abs(ボス.vx) > 0 && Math.abs(ボス.vy) > 0) {
            if (Math.abs(ボス.vy / ボス.vx) >= 1) {
                if (ボス.vy > 0) {
                    if (sprites.readDataNumber(ボス, "direction") != 3) {
                        animation.stopAnimation(animation.AnimationTypes.All, ボス)
                        animation.runImageAnimation(
                        ボス,
                        assets.animation`boss_moves_to_downward`,
                        500,
                        true
                        )
                        sprites.setDataNumber(ボス, "direction", 3)
                    }
                } else if (ボス.vy < 0) {
                    if (sprites.readDataNumber(ボス, "direction") != 1) {
                        animation.stopAnimation(animation.AnimationTypes.All, ボス)
                        animation.runImageAnimation(
                        ボス,
                        assets.animation`boss_moves_to_upward`,
                        500,
                        true
                        )
                        sprites.setDataNumber(ボス, "direction", 1)
                    }
                }
            } else {
                if (ボス.vx > 0) {
                    if (sprites.readDataNumber(ボス, "direction") != 2) {
                        animation.stopAnimation(animation.AnimationTypes.All, ボス)
                        animation.runImageAnimation(
                        ボス,
                        assets.animation`boss_moves_to_rightward`,
                        500,
                        true
                        )
                        sprites.setDataNumber(ボス, "direction", 2)
                    }
                } else if (ボス.vx < 0) {
                    if (sprites.readDataNumber(ボス, "direction") != 4) {
                        animation.stopAnimation(animation.AnimationTypes.All, ボス)
                        animation.runImageAnimation(
                        ボス,
                        assets.animation`boss_moves_to_leftward`,
                        500,
                        true
                        )
                        sprites.setDataNumber(ボス, "direction", 4)
                    }
                }
            }
        } else {
            if (sprites.readDataNumber(ボス, "direction") == 1) {
                ボス.setImage(assets.image`myImage39`)
            } else if (sprites.readDataNumber(mySprite, "direction") == 2) {
                ボス.setImage(assets.image`myImage41`)
            } else if (sprites.readDataNumber(ボス, "direction") == 3) {
                ボス.setImage(assets.image`myImage36`)
            } else if (sprites.readDataNumber(ボス, "direction") == 4) {
                ボス.setImage(assets.image`myImage45`)
            } else {
                ボス.setImage(assets.image`myImage36`)
            }
        }
    }
    if (!(sprites.readDataBoolean(ボス, "attacking")) && !(sprites.readDataBoolean(ボス, "dushing"))) {
        ボス.vx = Math.min(ボス.vx, 40)
        ボス.vy = Math.min(ボス.vy, 40)
    }
})
game.onUpdate(function () {
    for (let 値2 of sprites.allOfKind(SpriteKind.Trap)) {
        if (!(sprites.readDataBoolean(値2, "vanishing")) && game.runtime() - sprites.readDataNumber(値2, "spawnedAt") > 8000) {
            sprites.setDataBoolean(値2, "visible", true)
            sprites.setDataBoolean(値2, "vanishing", true)
        }
        if (sprites.readDataBoolean(値2, "vanishing") && game.runtime() - sprites.readDataNumber(値2, "spawnedAt") > 10000) {
            sprites.destroy(値2)
        }
    }
})
game.onUpdateInterval(50, function () {
    if (sprites.readDataBoolean(mySprite, "damaging")) {
        mySprite.setFlag(SpriteFlag.Invisible, sprites.readDataBoolean(mySprite, "visible"))
        sprites.setDataBoolean(mySprite, "visible", !(sprites.readDataBoolean(mySprite, "visible")))
    }
    if (sprites.readDataBoolean(ボス, "damaging")) {
        ボス.setFlag(SpriteFlag.Invisible, sprites.readDataBoolean(ボス, "visible"))
        sprites.setDataBoolean(ボス, "visible", !(sprites.readDataBoolean(ボス, "visible")))
    }
    for (let 値3 of sprites.allOfKind(SpriteKind.Trap)) {
        if (sprites.readDataBoolean(値3, "vanishing")) {
            値3.setFlag(SpriteFlag.Invisible, sprites.readDataBoolean(値3, "visible"))
            sprites.setDataBoolean(値3, "visible", !(sprites.readDataBoolean(値3, "visible")))
        }
    }
})
game.onUpdateInterval(7000, function () {
    if (game.runtime() > 1000) {
        if (Math.percentChance(50)) {
            ボス飛び道具生成()
        } else {
            ボス体当たり()
        }
    }
})
game.onUpdateInterval(2000, function () {
    if (!(sprites.readDataBoolean(ボス, "attacking")) && !(sprites.readDataBoolean(ボス, "dushing"))) {
        if (Math.percentChance(100 - 敵HP.value)) {
            music.play(music.createSoundEffect(WaveShape.Square, 113, 0, 255, 0, 100, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
            mySprite2 = sprites.create(img`
                . . . . . 6 6 6 . . . . . . . . 
                . . . . 6 6 1 1 6 . . . . . . . 
                . . . 6 6 9 1 1 6 6 . . . . . . 
                . . . 6 9 9 9 9 9 6 . . . . . . 
                . . . 6 9 9 9 9 9 6 . . . . . . 
                . . . . 6 9 9 9 6 . . . . . . . 
                . . . . . 6 6 6 . . . 6 6 . . . 
                . . . . . . . . . . 6 9 9 6 . . 
                . . . . . . . . . . 6 9 9 6 . . 
                . . . . 6 6 . . . . . 6 6 . . . 
                . . . . 6 6 6 6 6 6 6 6 . . . . 
                . . 6 6 9 9 9 9 9 9 9 9 6 6 . . 
                . . 6 6 9 9 9 9 9 9 9 9 6 6 . . 
                . . . . 6 6 6 6 6 6 6 6 . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                `, SpriteKind.Trap)
            mySprite2.setPosition(ボス.x, ボス.y)
            sprites.changeDataNumberBy(mySprite2, "spawnedAt", game.runtime())
            mySprite2.z = 0
        }
    }
})
game.onUpdateInterval(200, function () {
    if (!(sprites.readDataBoolean(ボス, "attacking")) && !(sprites.readDataBoolean(ボス, "dushing"))) {
        ボス.ax += randint(-3, 3)
        ボス.ay += randint(-3, 3)
    }
})
