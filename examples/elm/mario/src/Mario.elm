module Mario exposing (..)
import Playground exposing (..)


-- HISTORY

gameWithTimeTravel rawView rawUpdate rawInitialModel =
  let
    maxVisibleHistory = 2000
    historySize model = List.length model.history
    historyBarHeight = 64

    replayEvents events =
      List.foldl rawUpdate rawInitialModel events

    -- viewWithHistory adds a time travel bar + help message to the game’s normal UI

    viewWithHistory computer model =
      let
        historyIndexToX index = (index |> toFloat) / maxVisibleHistory * computer.screen.width
        historyBar color index =
          let
            width = historyIndexToX index
          in
            rectangle color width historyBarHeight  
              |> move (computer.screen.left + width / 2) (computer.screen.top - historyBarHeight / 2)
              |> fade 0.7
        helpMessage =
            if model.paused then
              "Press space to resume at selected point in history"
            else
              "Drag across bar to time travel"
      in
        (rawView computer model.rawModel) ++
          [ historyBar blue (List.length model.history)
          , historyBar white model.historyPlaybackPosition
          , words black helpMessage
              |> move 0 (computer.screen.top - historyBarHeight - 20)
          ]

    -- replayEvents sets up the initial state of the game using previously recorded history, if any

    recordHistory computer model =
      let
        xToHistoryIndex x =
          (x - computer.screen.left)
            / computer.screen.width * maxVisibleHistory
          |> round
      in
        -- Pause game & travel in time

        if computer.mouse.down && (model.paused || computer.mouse.y > computer.screen.top - historyBarHeight) then
          let
            newPlaybackPosition =
              min (List.length model.history) (xToHistoryIndex computer.mouse.x)
          in
            { model
              | paused = True
              , rawModel = replayEvents (List.take newPlaybackPosition model.history)
              , historyPlaybackPosition = newPlaybackPosition
            }

        -- Resume normal flow of time

        else if model.paused && computer.keyboard.space then
          { model
            | paused = False
            , history = List.take model.historyPlaybackPosition model.history  -- start at selected point...
            , historyPlaybackPosition = 0  -- ...and remove selection
          }

        -- Paused and doing nothing

        else if model.paused then
          model

        -- Normal gameplay

        else
          { model
            | rawModel = rawUpdate computer model.rawModel
            , history = model.history ++ [computer]
            , paused = False
          }

    -- replayRecordedHistory sets up the initial state of the game using previously recorded history
    -- if there is any, otherwise starts the game in its normal initial state

    replayRecordedHistory =
      { rawModel = rawInitialModel
      , history = []
      , historyPlaybackPosition = 0
      , paused = False
      }
  in
    game viewWithHistory recordHistory replayRecordedHistory


-- MAIN

main = gameWithTimeTravel view update initialState

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
