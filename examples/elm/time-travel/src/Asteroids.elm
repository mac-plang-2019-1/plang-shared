module Asteroids exposing (..)

import Playground exposing (..)
import TimeTravel exposing (..)
import Random
import Time as PosixTime


-- PHYSICS PARAMETERS

asteroidCount = 10
initialAsteroidSpeed = 2
largeAsteroidRadius = 30
shipSize = 16
asteroidColor = (rgb 160 160 160)
shipColor = (rgb 255 200 60)
bulletColor = white


-- MAIN

main = gameWithTimeTravel view update initialState

type alias GameObject =
  { x : Float
  , y : Float
  , dx : Float
  , dy : Float
  , dir : Float
  , spin : Float
  , radius : Float
  , shape : List (Float, Float)
  }

type alias Model =
  { ship : GameObject
  , asteroids : List GameObject
  , bullets : List GameObject 
  }

initialState : Model
initialState =
  { ship = { x = 0, y = 0, dir = 0, spin = 0, dx = 0, dy = 0, radius = shipSize, shape = shipShape}
  , asteroids = []
  , bullets = []
  }

shipShape =
  [ (shipSize,        0)
  , (shipSize * -0.8, shipSize * 0.7)
  , (shipSize * -0.4, 0)
  , (shipSize * -0.8, shipSize * -0.7)
  ]


-- VIEW

view computer model =
  [rectangle black computer.screen.width computer.screen.height]
    ++ [model.ship      |> viewGameObject shipColor 1.0]
    ++ (model.asteroids |> List.map (viewGameObject asteroidColor 0.7))
    ++ (model.bullets   |> List.map (viewGameObject bulletColor 1.0))

viewGameObject : Color -> Float -> GameObject -> Shape
viewGameObject color opacity obj =
  polygon color obj.shape
    |> fade opacity
    |> rotate obj.dir
    |> move obj.x obj.y


-- UPDATE

update computer model =
  { model
    | ship      = (shipControls computer >> moveObject computer) model.ship
    , asteroids = List.map (moveObject computer) model.asteroids |> regenerateIfEmpty computer
    , bullets   = List.map (moveObject computer) model.bullets
  }

shipControls : Computer -> GameObject -> GameObject
shipControls computer ship =
  let
    thrust = 0.1 * toY computer.keyboard
    dir = degrees ship.dir
  in
    { ship
      | spin = -5 * toX computer.keyboard
      , dx = ship.dx + thrust * (cos (degrees ship.dir))
      , dy = ship.dy + thrust * (sin (degrees ship.dir))
    }

regenerateIfEmpty : Computer -> List GameObject -> List GameObject
regenerateIfEmpty computer asteroids =
  if not (List.isEmpty asteroids) then
    asteroids
  else
    let
      randomX = Random.float computer.screen.left computer.screen.right
      randomY = Random.float computer.screen.bottom computer.screen.top
      randomAngle = Random.float 0 (2 * pi)

      addRandomAsteroid index (list, seed0) =
        let
          (x, seed1) = Random.step randomX seed0
          (y, seed2) = Random.step randomY seed1
          (dir, seed3) = Random.step randomAngle seed2
          (spin, seed4) = Random.step randomAngle seed3
          (shape, seed5) = randomAsteroidShape largeAsteroidRadius seed4

          (dx, dy) = (initialAsteroidSpeed * cos(dir), initialAsteroidSpeed * sin(dir))
        in
          ( { x = x, y = y, dir = 0, spin = spin, dx = dx, dy = dy, radius = largeAsteroidRadius, shape = shape} :: list
          , seed5
          )

      initialSeed = Random.initialSeed (PosixTime.posixToMillis (extractPosix computer.time))

      (result, lastSeed) = List.foldl addRandomAsteroid ([], initialSeed) (List.range 1 asteroidCount)
    in
      result

randomAsteroidShape : Number -> Random.Seed -> (List (Float, Float), Random.Seed)
randomAsteroidShape radius seed0 =
  let
    randomRadius = Random.float (radius * 0.9) (radius * 1.5)
    vertexCount = 3 + round (radius / 3)
    addRandomVertex index (list, seed1) =
      let
        (r, seed2) = (Random.step randomRadius seed1)
        theta = (toFloat index) / (toFloat vertexCount) * pi * 2
        x = r * cos(theta)
        y = r * sin(theta)
      in
        ( (x,y) :: list
        , seed2
        )
  in
    List.foldl addRandomVertex ([], seed0) (List.range 1 vertexCount)

moveObject : Computer -> GameObject -> GameObject
moveObject computer obj =
  { obj
    | x = obj.x + obj.dx |> wrap (computer.screen.left - largeAsteroidRadius)   (computer.screen.right + largeAsteroidRadius)
    , y = obj.y + obj.dy |> wrap (computer.screen.bottom - largeAsteroidRadius) (computer.screen.top + largeAsteroidRadius)
    , dir = obj.dir + obj.spin
  }

wrap min max x =
  let
    diff = max - min
  in
    if max <= min then
      x
    else if x > max then
      x - diff
    else if x < min then
      x + diff
    else
      x
