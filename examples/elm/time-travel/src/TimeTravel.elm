port module TimeTravel exposing (gameWithTimeTravel)

import Playground exposing (..)
import Set
import Time as PosixTime

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

    replayHistory events =
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
              "Drag bar to time travel  •  Press T to resume"
            else
              "Press T to freeze time and save history"
      in
        (rawView computer model.rawModel) ++
          [ historyBar black maxVisibleHistory
          , historyBar (rgb 0 0 255) (List.length model.history)
          , historyBar (rgb 128 64 255) model.historyPlaybackPosition
          , words white helpMessage
              |> move 0 (computer.screen.top - historyBarHeight / 2)
          ]

    -- replayHistory sets up the initial state of the game using previously recorded history, if any

    updateWithHistory userMsg computer model =
      let
        xToHistoryIndex x =
          (x - computer.screen.left)
            / computer.screen.width * maxVisibleHistory
          |> round
      in
        -- Pause game & travel in time

        if model.paused && computer.mouse.down && computer.mouse.y > computer.screen.top - historyBarHeight then
          let
            newPlaybackPosition =
              min (List.length model.history) (xToHistoryIndex computer.mouse.x)
          in
            ( { model
                | rawModel = replayHistory (List.take newPlaybackPosition model.history)
                , historyPlaybackPosition = newPlaybackPosition
              }
            , Cmd.none
            )

        -- Toggling pause mode

        else if List.any (\key -> Set.member key computer.keyboard.keysJustPressed) ["t", "T"] then
          ( if model.paused then
              { model
                | paused = False
                , history = List.take model.historyPlaybackPosition model.history  -- start at selected point...
              }
            else
              { model | paused = True}
          , encodeAndSaveHistory model
          )

        -- Paused and doing nothing

        else if model.paused then
          (model, Cmd.none)

        -- Normal gameplay

        else
          ( { model
              | rawModel = rawUpdate computer model.rawModel
              , history = model.history ++ [computer]
              , historyPlaybackPosition = (List.length model.history + 1)
              , paused = False
            }
          , Cmd.none)

    -- initWithHistory sets up the initial state of the game using previously recorded history
    -- if there is any, otherwise starts the game in its normal initial state

    initWithHistory savedHistory =
      let
        recoveredHistory =
          List.map decodeComputer (Maybe.withDefault [] savedHistory)
      in
        { rawModel = replayHistory recoveredHistory
        , history = recoveredHistory
        , historyPlaybackPosition = List.length recoveredHistory
        , paused = not (List.isEmpty recoveredHistory)
        }

    subscriptions =
      always Sub.none
  in
    application viewWithHistory updateWithHistory subscriptions initWithHistory


-- Making Computer storage-friendly

port saveHistory : List EncodableComputer -> Cmd msg

encodeAndSaveHistory model =
  saveHistory (List.map encodeComputer model.history)

type alias EncodableComputer =
  { mouse : Mouse
  , keyboard : EncodableKeyboard
  , screen : Screen
  , time : EncodableTime
  }

encodeComputer : Computer -> EncodableComputer
encodeComputer computer =
  { mouse = computer.mouse
  , keyboard = encodeKeyboard computer.keyboard
  , screen = computer.screen
  , time = encodeTime computer.time
  }

decodeComputer : EncodableComputer -> Computer
decodeComputer computer =
  { mouse = computer.mouse
  , keyboard = decodeKeyboard computer.keyboard
  , screen = computer.screen
  , time = decodeTime computer.time
  }

type alias EncodableKeyboard =
  { up : Bool
  , down : Bool
  , left : Bool
  , right : Bool
  , space : Bool
  , enter : Bool
  , shift : Bool
  , backspace : Bool
  , keys : List String
  , keysJustPressed : List String
  }

encodeKeyboard : Keyboard -> EncodableKeyboard
encodeKeyboard keyboard =
  { up = keyboard.up
  , down = keyboard.down
  , left = keyboard.left
  , right = keyboard.right
  , space = keyboard.space
  , enter = keyboard.enter
  , shift = keyboard.shift
  , backspace = keyboard.backspace
  , keys = Set.toList keyboard.keys
  , keysJustPressed = Set.toList keyboard.keysJustPressed }

decodeKeyboard : EncodableKeyboard -> Keyboard
decodeKeyboard keyboard =
  { up = keyboard.up
  , down = keyboard.down
  , left = keyboard.left
  , right = keyboard.right
  , space = keyboard.space
  , enter = keyboard.enter
  , shift = keyboard.shift
  , backspace = keyboard.backspace
  , keys = Set.fromList keyboard.keys
  , keysJustPressed = Set.fromList keyboard.keysJustPressed }

type alias EncodableTime = Int

encodeTime : Time -> EncodableTime
encodeTime time = PosixTime.posixToMillis (extractPosix time)

decodeTime : EncodableTime -> Time
decodeTime time = makePlaygroundTime (PosixTime.millisToPosix time)
