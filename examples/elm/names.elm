module Main exposing (Model, Msg(..), Name, fullName, init, listItem, listOf, main, update, view)

import Browser
import Html exposing (Html, button, div, input, li, text, ul)
import Html.Attributes exposing (..)
import Html.Events exposing (..)


-- MAIN

main =
    Browser.sandbox { init = init, update = update, view = view }


-- MODEL

type alias Name =
    { first : String, last : String }

type alias Model =
    { students : List Name }

init : Model
init =
    { students =
        [ { first = "Beyoncé", last = "Knowles" }
        , { first = "Jay", last = "Z" }
        , { first = "Blue Ivy", last = "Carter" }
        ]
    }



-- VIEW

fullName student =
    student.first ++ " " ++ student.last

listItem toHTML value =
    li [] [ toHTML value ]

listOf format list =
    ul [] (List.map format list)

view : Model -> Html Msg
view model =
    div []
        [ listOf (fullName >> text |> listItem) model.students
        ]



-- UPDATE

type Msg = Noop

update : Msg -> Model -> Model
update msg model = model


