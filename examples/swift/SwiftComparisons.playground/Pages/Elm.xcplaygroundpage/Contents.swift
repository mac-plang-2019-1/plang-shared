
/*

type alias Model =
    { entries : List Entry
    , field : String
    , uid : Int
    , visibility : String
    }


type alias Entry =
    { description : String
    , completed : Bool
    , editing : Bool
    , id : Int
    }

*/

struct Model
    {
    var entries: [Entry]
    var field: String
    var uid: Int
    var visibility: String
    }

struct Entry
    {
    var description: String
    var completed: Bool
    var editing: Bool
    var id: Int
    }

/*

type Msg
    = NoOp
    | UpdateField String
    | EditingEntry Int Bool
    | UpdateEntry Int String
    | Add
    | Delete Int
    | DeleteComplete
    | Check Int Bool
    | CheckAll Bool
    | ChangeVisibility String

*/

enum Msg
    {
    case NoOp
    case UpdateField(String)
    case EditingEntry(Int, Bool)
    case UpdateEntry(Int, String)
    case Add
    case Delete(Int)
    case DeleteComplete
    case Check(Int, Bool)
    case CheckAll(Bool)
    case ChangeVisibility(String)
    }

/*
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ...stuff...

        Add ->
            ...stuff...

        UpdateField str ->
            ...stuff with str...
*/

func update(msg: Msg, model: Model) -> Model {
    switch msg {
        case .NoOp:
            break // stuff

        case .Add:
            break // stuff

        case .UpdateField(let str):
            print(str) // stuff with str

        default:
            break //.... more cases....
    }
    return model
}

