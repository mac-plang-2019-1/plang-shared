import Html exposing (li, ul, text)

type alias Student =
  { firstName: String
  , middleName: Maybe String
  , lastName: String
  }

fullName : Student -> String
fullName student =
  case student.middleName of
  
    Just middleName ->
      student.firstName
        ++ " " ++ middleName
        ++ " " ++ student.lastName
        
    Nothing ->
      student.firstName
        ++ " " ++ student.lastName

roster : List Student
roster =
  [ { firstName="Sally", middleName=Nothing, lastName="Smith" }
  , { firstName="John", middleName=Just "Q", lastName="Barringtonson IV, Esq." }
  , { firstName="Beyoncé", middleName=Just "Giselle", lastName="Knowles, Esq." }
  ]

main = roster
  |> List.map fullName
  |> List.map (\name -> [text name])
  |> List.map (li [])
  |> ul []

