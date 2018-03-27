import XCTest

class MyTestCase: XCTestCase {

    /*
    def test_collect_transforms_elements_of_an_array
        array = [1, 2, 3]

        another_array = array.map { |item| item + 10 }
        assert_equal [11, 12, 13], another_array
    end
    */

    func test_collect_transforms_elements_of_an_array() {
        let array = [1, 2, 3]

        let another_array = array.map { item in item + 10 }
        XCTAssertEqual([11, 12, 13], another_array)
    }

    /*
    def test_select_selects_certain_items_from_an_array
        array = [1, 2, 3, 4, 5, 6]

        even_numbers = array.select { |item| (item % 2) == 0 }
        assert_equal [2, 4, 6], even_numbers
    end
    */

    func test_select_selects_certain_items_from_an_array() {
        let array = [1, 2, 3, 4, 5, 6]

        let even_numbers = array.filter { item in (item % 2) == 0 }
        XCTAssertEqual([2, 4, 6], even_numbers)
    }

    /*
    def test_inject_will_blow_your_mind
        result = [2, 3, 4].inject(0) { |sum, item| sum + item }
        assert_equal 9, result
    end
    */

    func test_inject_will_blow_your_mind() {
        let result = [2, 3, 4].reduce(0) { sum, item in sum + item }
        XCTAssertEqual(9, result)
    }

    func test_inject_with_plus_will_blow_your_mind() {
        let result = [2, 3, 4].reduce(0, +)
        XCTAssertEqual(9, result)
    }

    /*
    def test_all_iteration_methods_work_on_any_collection_not_just_arrays
        # Ranges act like a collection
        result = (1..3).map { |item| item + 10 }
        assert_equal [11, 12, 13], result
    end
    */

    func test_all_iteration_methods_work_on_any_collection_not_just_arrays() {
        let result = (1 ... 3).map { item in item + 10 }
        XCTAssertEqual([11, 12, 13], result)
    }
}

MyTestCase.defaultTestSuite.run()

