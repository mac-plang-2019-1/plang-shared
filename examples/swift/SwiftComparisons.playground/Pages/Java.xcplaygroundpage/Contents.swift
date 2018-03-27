public class PythonObject {
    private let attrs: [String:PythonObject] = [:]
    private let type: PythonType
    private var mro: [PythonObject]?

    init(type: PythonType) {
        self.type = type
    }

    // These are implemented in a very “direct from Java” style; we’ll clean them up later:

    public func getMRO() -> [PythonObject] {
        if(mro == nil) {
            mro = buildMRO()
        }
        return mro!
    }

    internal func buildMRO() -> [PythonObject] {
        var result = [PythonObject]()
        result.append(self)
        result.append(contentsOf: type.getMRO())
        return result
    }
}


class PythonType: PythonObject { }

/*

public class PythonObject {
    private final Map<String,PythonObject> attrs = new HashMap<>();
    private final PythonType type;
    private List<PythonObject> mro;

    PythonObject(PythonType type) {
        this.type = type;
    }

    public final PythonType getType() {
        return type;
    }

    public List<PythonObject> getMRO() {
        if(mro == null)
            mro = Collections.unmodifiableList(buildMRO());
        return mro;
    }

    protected List<PythonObject> buildMRO() {
        List<PythonObject> result = new ArrayList<>();
        result.add(this);
        result.addAll(getType().getMRO());
        return result;
    }

    public final PythonObject get(String attrName) throws PythonAttributeException {
        for(PythonObject obj : buildMRO())
            if(obj.attrs.containsKey(attrName))
                return obj.attrs.get(attrName);

        throw new PythonAttributeException(this, attrName);
    }

    public final void set(String attrName, PythonObject value) {
        attrs.put(attrName, value);
    }

    @Override
    public String toString() {
        return "PythonObject<" + getType().getName() + ">" + attrs;
    }
}


public class PythonType extends PythonObject {
    private final String name;
    private final PythonObject base;

    public PythonType(String name, PythonObject base) {
        super(null);  // In real Python, this would be the type called `type`
        this.name = name;
        this.base = base;
    }

    public String getName() {
        return name;
    }

    public PythonObject getBase() {
        return base;
    }

    @Override
    protected List<PythonObject> buildMRO() {
        List<PythonObject> result = new ArrayList<>();
        result.add(this);
        if(getBase() != null)
            result.addAll(getBase().getMRO());
        if(getType() != null)
            result.addAll(getType().getMRO());
        return result;
    }

    public PythonObject instantiate() {
        return new PythonObject(this);
    }

    @Override
    public String toString() {
        return "PythonType<" + name + ">";
    }
}

*/
