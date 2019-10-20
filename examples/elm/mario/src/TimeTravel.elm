module TimeTravel exposing (gameWithTimeTravel)

import Playground exposing (..)

type alias TimeTravelModel gameModel =
  { history : List Computer
  , historyPlaybackPosition : Int
  , paused : Bool
  , rawModel : gameModel
  }

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
          [ historyBar black (List.length model.history)
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
