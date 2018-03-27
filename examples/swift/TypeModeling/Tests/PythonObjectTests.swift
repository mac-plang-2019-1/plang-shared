//
//  Tests.swift
//  Tests
//
//  Created by Paul on 2018/3/26.
//  Copyright © 2018 Comp 394. All rights reserved.
//

import XCTest
import TypeModeling


class PythonObjectTests: XCTestCase {
    private var fooType: PythonType!
    private var barType: PythonType!
    private var foo: PythonObject!
    private var bar: PythonObject!

    /**
     * Equivalent Python:
     *
     *   class Foo:
     *     pass
     *
     *   class Bar:
     *     pass
     *
     *   foo = Foo()
     *   bar = Bar()
     */
    override func setUp() {
        fooType = PythonType("Foo", nil)
        barType = PythonType("Bar", fooType)
        foo = fooType.instantiate()
        bar = barType.instantiate()
    }

    func testCanCreateAndInstantiateTypes() {
        XCTAssertTrue(fooType === foo.getType())
        XCTAssertTrue(barType === bar.getType())
        XCTAssertFalse(foo === bar)
    }

    // –––––– MRO tests ––––––

    func testTypeMroIncludesSelf() {
        XCTAssertEqual(
            [fooType],
            fooType.getMRO())
    }

    func testTypeMroIncludesBaseClass() {
        XCTAssertEqual(
            [barType, fooType],
            barType.getMRO())
    }

    func testObjectMroIncludesType() {
        XCTAssertEqual(
            [foo, fooType],
            foo.getMRO())
    }

    func testObjectMroIncludesBaseClass() {
        XCTAssertEqual(
            [bar, barType, fooType],
            bar.getMRO())
    }

    // –––––– Attribute lookup tests ––––––

    func testFindAttrsOnSelf() throws {
        foo.set("color", PythonString("greenish orange"))
        bar.set("flavor", PythonString("ineffable"))

        try assertEqualPyStr("greenish orange", foo.get("color"))
        try assertEqualPyStr("ineffable", bar.get("flavor"))
    }

    func testExceptionWhenAttrNotFound() throws {
        bar.set("flavor", PythonString("ineffable"))

        do {
            _ = try foo.get("flavor")
            XCTFail("expected exception")
        } catch let error as PythonAttributeException {
            XCTAssertEqual(foo, error.object)
            XCTAssertEqual("flavor", error.attrName)
        }
    }

    func testObjectsSupportNullValues() throws {
        foo.set("worries", nil)
        XCTAssertEqual(nil, try foo.get("worries"))  // No exception!
    }

    func testFindInheritedAttrs() throws {
        // Equivalent Python:
        //
        //   Foo.socks = "rainbow"   # Type attributes...
        //   foo.socks               # ...show up on instances of the type...
        //   Bar.socks               # ...and on subtypes...
        //   bar.socks               # ...and on instances of subtypes too!

        fooType.set("socks", PythonString("rainbow"))
        assertEqualPyStr("rainbow", try fooType.get("socks"))
        assertEqualPyStr("rainbow", try foo.get("socks"))
        assertEqualPyStr("rainbow", try barType.get("socks"))
        assertEqualPyStr("rainbow", try bar.get("socks"))
    }

    func testOverrideInheritedAttrsInType() throws {
        // Equivalent Python:
        //
        //   Foo.socks = "rainbow"
        //   Bar.socks = "polka dot"

        fooType.set("socks", PythonString("rainbow"))
        barType.set("socks", PythonString("polka dot"))

        assertEqualPyStr("rainbow",   try fooType.get("socks"))
        assertEqualPyStr("rainbow",   try foo.get("socks"))
        assertEqualPyStr("polka dot", try barType.get("socks"))
        assertEqualPyStr("polka dot", try bar.get("socks"))
    }

    func testOverrideInheritedAttrsInInstance() throws {
        // Equivalent Python:
        //
        //   Foo.socks = "rainbow"
        //   foo.socks = "chartreuse"

        fooType.set("socks", PythonString("rainbow"))
        foo.set("socks", PythonString("chartreuse"))

        assertEqualPyStr("rainbow",    try fooType.get("socks"))
        assertEqualPyStr("chartreuse", try foo.get("socks"))
        assertEqualPyStr("rainbow",    try barType.get("socks"))
        assertEqualPyStr("rainbow",    try bar.get("socks"))
    }

    func testOverrideInheritedAttrsWithNull() throws {
        // Equivalent Python:
        //
        //   Foo.socks = "rainbow"
        //   Bar.socks = null  # All the bars are going to the beach today

        fooType.set("socks", PythonString("rainbow"))
        barType.set("socks", nil)

        assertEqualPyStr("rainbow", try fooType.get("socks"))
        assertEqualPyStr("rainbow", try foo.get("socks"))
        assertEqualPyStr(nil,       try barType.get("socks"))
        assertEqualPyStr(nil,       try bar.get("socks"))
    }

    // –––––– Helpers ––––––

    private func assertEqualPyStr(_ str: String?, _ pyobj: PythonObject?) {
        if str == nil && pyobj == nil {
            return
        }
        XCTAssertTrue(pyobj is PythonString)
        XCTAssertEqual(str, pyobj?.description)
    }
}

