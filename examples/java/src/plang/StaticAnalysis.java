package plang;

public class StaticAnalysis {
    public static void main(String[] args) {
        // Why do these give results of different types?

        System.out.println(
            "2" + 3 + 4
        );

        System.out.println(
            2 + 3 + "4"
        );

    }

    void unreachableOrIsIt(String[] args) {

        //// The Compiler flags this as an error:
        //return;
        //System.out.println("ahoy");

        // ...but not this:
        if(args.length >= 0)  // we know this is always true, but compiler doesn't
            return;

        System.out.println("ahoy");
    }
}
