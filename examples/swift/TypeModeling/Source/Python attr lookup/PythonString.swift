import Foundation

public class PythonString: PythonObject {
    public static let type = PythonType(named: "str")

    private let value: String

    public init(_ value: String) {
        self.value = value
        super.init(PythonString.type)
    }

    public override var description: String {
        return value
    }
}

