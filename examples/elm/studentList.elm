import Html exposing (li, text, ul)

students=
  [ { firstName="Sally"
    , lastName="Smith"
    , email="sally@example.com"
    }
  , { firstName="Fred"
    , lastName="Jones"
    , email="fred@example.com"
    }
  ]

bullet msg =
  li [] [text msg]

bulletList list =
  ul [] (List.map bullet list)

main =
  bulletList (List.map .firstName students)
