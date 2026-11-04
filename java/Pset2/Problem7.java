import java.util.Comparator;
import java.util.PriorityQueue;

class Patient {

  private int patientId;
  private String name;
  private int priority, arrivalNumber;

  public Patient(int patientId, String name, int priority, int arrivalNumber) {
    this.patientId = patientId;
    this.name = name;
    this.priority = priority;
    this.arrivalNumber = arrivalNumber;
  }

  public int getPriority() {
    return priority;
  }

  public int getArrivalNumber() {
    return arrivalNumber;
  }

  public void display() {
    System.out.println("Patient " + name + " - Priority " + priority);
  }
}

public class Problem7 {

  public static void problem7() {
    System.out.println("\n===== Problem 7: Hospital Patient Queue =====");
    PriorityQueue<Patient> patientQueue = new PriorityQueue<Patient>(
      new Comparator<Patient>() {
        public int compare(Patient firstPatient, Patient secondPatient) {
          if (
            firstPatient.getPriority() != secondPatient.getPriority()
          ) return firstPatient.getPriority() - secondPatient.getPriority();
          return (
            firstPatient.getArrivalNumber() - secondPatient.getArrivalNumber()
          );
        }
      }
    );
    patientQueue.add(new Patient(1, "A", 1, 1));
    patientQueue.add(new Patient(2, "B", 2, 2));
    patientQueue.add(new Patient(3, "C", 1, 3));
    patientQueue.add(new Patient(4, "D", 3, 4));
    while (!patientQueue.isEmpty()) patientQueue.poll().display();
  }
}
