package plang;

import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

public class NoMaybes {
    public static void main(String[] args) {
        List<Student> roster = Arrays.asList(
            new Student("Sally", "Smith"),
            new Student("John", "Q", "Barringtonson IV, Esq."),
            new Student("Beyoncé", "Knowles")
        );

        for(Student student : roster)
            System.out.println(student.getFullName() + ": " + student.getNameLength());
    }
}

class Student {
    private String firstName, middleName, lastName;

    public Student(String firstName, String middleName, String lastName) {
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
    }

    public Student(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public int getNameLength() {
        return firstName.length()
             + middleName.length()
             + lastName.length();
    }

    public String getFullName() {
        return firstName + " " + middleName + " " + lastName;
    }
}

