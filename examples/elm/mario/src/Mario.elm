module Mario exposing (..)
import Playground exposing (..)


-- MAIN

type XDirection = Left | Right

main =
  game view update
    { x = 0
    , y = 0
    , vx = 0
    , vy = 0
    , dir = Right
    , trace = []
    , gravity = 4.2
    }


-- VIEW

view computer mario =
  let
    w = computer.screen.width
    h = computer.screen.height
    b = computer.screen.bottom
    convertY y = (b + 76 + y)
  in
  [ rectangle (rgb 174 238 238) w h  -- sky
  , rectangle (rgb 74 163 41) w 100  -- ground
      |> moveY b
  , mario.trace
      |> List.map flipY  -- polygon uses flipped Y, apparently??
      |> pathToPolygonVertices 1.5
      |> polygon black
      |> move 0 (b + 76)
      |> fade 0.5
  , marioSprite mario
      |> image 70 70
      |> move mario.x (b + 76 + mario.y)
  ]

-- Elm’s playground package doesn't have any way to stroke a path.
-- This function makes a polygon that traces across the given points
-- offset slightly, then traces in reverse order with the opposite offset.
pathToPolygonVertices thickness path =
  (path |> offsetPath (thickness, -thickness))
  ++
  (List.reverse path |> offsetPath (-thickness, thickness))

offsetPath offset points =
    List.map (pointAdd offset) points

pointAdd (x0, y0) (x1, y1) =
  (x0 + x1, y0 + y1)

flipY (x, y) =
  (x, -y)

marioSprite mario =
  let
    stance =
      if mario.y > 0 then
        "jump"
      else if mario.vx /= 0 then
        "walk"
      else
        "stand"
    direction =
      case mario.dir of
        Left -> "left"
        Right -> "right"
  in
    "https://elm-lang.org/images/mario/" ++ stance ++ "/" ++ direction ++ ".gif"


-- UPDATE

update computer mario =
  let
    dt = 2
    vx =
      let keyX = (toX computer.keyboard) in
        if keyX /= 0 then keyX else (mario.vx * 0.9)
    vy =
      if mario.vy == 0 && computer.keyboard.up then
        mario.gravity
      else
        mario.vy - dt / 8
    newX = mario.x + dt * vx
    newY = max 0 (mario.y + dt * vy)
  in
    { mario
      | x = newX
      , y = newY
      , vx = vx
      , vy = (newY - mario.y) / dt
      , dir =
          if vx == 0 then
            mario.dir  -- face direction of last movement when standing still
          else if vx < 0 then Left else Right
      , trace = addPointUnlessDuplicate (newX, newY) mario.trace
    }

addPointUnlessDuplicate point path =
  if (List.head path) == Just point then
    path
  else
    point :: path
