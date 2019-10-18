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
    { students : List Name, newFirst : String, newLast : String }

init : Model
init =
    { students =
        [ { first = "Beyoncé", last = "Knowles" }
        , { first = "Jay", last = "Z" }
        , { first = "Blue Ivy", last = "Carter" }
        ]
    , newFirst = ""
    , newLast = ""
    }


-- UPDATE

type Msg
    = Enroll
    | UpdateFirstName String
    | UpdateLastName String

update : Msg -> Model -> Model
update msg model =
    case msg of
        -- There may be a better way to do this, but I don't know what it is:
        UpdateFirstName value ->
            { model | newFirst = value }

        UpdateLastName value ->
            { model | newLast = value }

        Enroll ->
            { model
                | students =
                    model.students
                        ++ [ { first = model.newFirst, last = model.newLast }
                           ]
                , newFirst = ""
                , newLast = ""
            }


-- VIEW

fullName student =
    student.first ++ " " ++ student.last

listItem toHTML value =
    li [] [ toHTML value ]

listOf format list =
    ul [] (List.map format list)

modelInput model field hint event =
    input [ value (model |> field), placeholder hint, onInput event ] []

view : Model -> Html Msg
view model =
    div []
        [ listOf (fullName >> text |> listItem) model.students
        , modelInput model .newFirst "First Name" UpdateFirstName
        , modelInput model .newLast  "Last name"  UpdateLastName
        , button [ onClick Enroll ] [ text "Enroll" ]
        ]
