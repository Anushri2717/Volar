import java.util.*;

class Reservation {
    String passengerName;
    String gender;
    String flight;
    String airline;
    String seat;
    String flightClass;
    String govIdType;
    String govIdNumber;
    String time;
    String date;
    String pnr;

    public Reservation(String passengerName, String gender, String flight, String airline, String seat,
                       String flightClass, String govIdType, String govIdNumber, String time, String date) {
        this.passengerName = passengerName;
        this.gender = gender;
        this.flight = flight;
        this.airline = airline;
        this.seat = seat;
        this.flightClass = flightClass;
        this.govIdType = govIdType;
        this.govIdNumber = govIdNumber;
        this.time = time;
        this.date = date;
        this.pnr = generatePNR();
    }

    private String generatePNR() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random rand = new Random();
        StringBuilder sb = new StringBuilder();
        for(int i=0; i<6; i++) {
            sb.append(chars.charAt(rand.nextInt(chars.length())));
        }
        return sb.toString();
    }

    public void displayTicket() {
        System.out.println("\n================ AIRLINE TICKET ================");
        System.out.println("PNR: " + pnr);
        System.out.println("Passenger: " + passengerName + " (" + gender + ")");
        System.out.println("Flight: " + flight);
        System.out.println("Airline: " + airline);
        System.out.println("Class: " + flightClass);
        System.out.println("Seat: " + seat);
        System.out.println("Date: " + date + "   Time: " + time);
        System.out.println("Government ID: " + govIdType + " - " + govIdNumber);
        System.out.println("================================================\n");
    }
}

public class AirlineReservationSystem {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ArrayList<Reservation> reservations = new ArrayList<>();

        int choice;
        do {
            System.out.println("\n===== AIRLINE RESERVATION SYSTEM =====");
            System.out.println("1. Book Ticket");
            System.out.println("2. View All Bookings");
            System.out.println("3. Cancel Booking");
            System.out.println("4. Exit");
            System.out.print("Enter your choice: ");
            choice = sc.nextInt();
            sc.nextLine(); 

            switch (choice) {
                case 1: 
                    System.out.print("Enter Passenger Name: ");
                    String name = sc.nextLine();

                    System.out.print("Enter Gender (Male/Female/Other): ");
                    String gender = sc.nextLine();

                    System.out.println("Select Flight: ");
                    System.out.println("1. Paris → Tokyo");
                    System.out.println("2. London → New York");
                    System.out.println("3. Dubai → Sydney");
                    int flightChoice = sc.nextInt(); sc.nextLine();
                    String flight = (flightChoice==1) ? "Paris → Tokyo" :
                                    (flightChoice==2) ? "London → New York" :
                                    "Dubai → Sydney";

                    System.out.println("Select Airline: ");
                    System.out.println("1. Air France");
                    System.out.println("2. British Airways");
                    System.out.println("3. Emirates");
                    int airlineChoice = sc.nextInt(); sc.nextLine();
                    String airline = (airlineChoice==1) ? "Air France" :
                                     (airlineChoice==2) ? "British Airways" :
                                     "Emirates";

                    System.out.println("Select Class: ");
                    System.out.println("1. Economy");
                    System.out.println("2. Business");
                    System.out.println("3. First");
                    int classChoice = sc.nextInt(); sc.nextLine();
                    String flightClass = (classChoice==1) ? "Economy" :
                                         (classChoice==2) ? "Business" :
                                         "First";

                    System.out.println("Select Time: ");
                    System.out.println("1. 06:00 AM");
                    System.out.println("2. 12:00 PM");
                    System.out.println("3. 06:00 PM");
                    int timeChoice = sc.nextInt(); sc.nextLine();
                    String time = (timeChoice==1) ? "06:00 AM" :
                                  (timeChoice==2) ? "12:00 PM" :
                                  "06:00 PM";

                    System.out.print("Enter Date (YYYY-MM-DD): ");
                    String date = sc.nextLine();

                    System.out.println("Select Government ID Type: ");
                    System.out.println("1. Passport");
                    System.out.println("2. Aadhar");
                    System.out.println("3. Driving License");
                    int idChoice = sc.nextInt(); sc.nextLine();
                    String govIdType = (idChoice==1) ? "Passport" :
                                       (idChoice==2) ? "Aadhar" :
                                       "Driving License";

                    System.out.print("Enter Government ID Number: ");
                    String govIdNumber = sc.nextLine();

                    System.out.print("Enter Seat Number (e.g., 5A): ");
                    String seat = sc.nextLine();

                    Reservation r = new Reservation(name, gender, flight, airline, seat,
                                                    flightClass, govIdType, govIdNumber, time, date);
                    reservations.add(r);
                    System.out.println("\nBooking Confirmed!");
                    r.displayTicket();
                    break;

                case 2: 
                    if (reservations.isEmpty()) {
                        System.out.println("No bookings yet!");
                    } else {
                        System.out.println("\n===== ALL BOOKINGS =====");
                        for (int i=0; i<reservations.size(); i++) {
                            System.out.println((i+1) + ". " + reservations.get(i).passengerName
                                    + " | Flight: " + reservations.get(i).flight
                                    + " | Seat: " + reservations.get(i).seat);
                        }
                    }
                    break;

                case 3: // Cancel Booking
                    if (reservations.isEmpty()) {
                        System.out.println("No bookings to cancel!");
                    } else {
                        System.out.print("Enter booking number to cancel: ");
                        int cancelIndex = sc.nextInt();
                        sc.nextLine();
                        if (cancelIndex >=1 && cancelIndex <= reservations.size()) {
                            reservations.remove(cancelIndex-1);
                            System.out.println("Booking cancelled successfully!");
                        } else {
                            System.out.println("Invalid booking number!");
                        }
                    }
                    break;

                case 4:
                    System.out.println("Exiting... Thank you for using Airline Reservation System!");
                    break;

                default:
                    System.out.println("Invalid choice! Please try again.");
            }

        } while(choice != 4);

        sc.close();
    }
}