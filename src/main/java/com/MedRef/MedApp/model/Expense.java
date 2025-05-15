package com.MedRef.MedApp.model;

import java.time.LocalDate;

public class Expense {
    
    private int id;                  // Unique identifier for the expense
    private LocalDate date;           // Date of the expense
    private String medicineName;      // Which medicine caused the expense
    private double amount;            // Amount spent on the medicine

    // Default constructor
    public Expense() {}

    // Constructor with parameters
    public Expense(int id, LocalDate date, String medicineName, double amount) {
        this.id = id;
        this.date = date;
        this.medicineName = medicineName;
        this.amount = amount;
    }

    // Getters & Setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    // toString method for easy representation of Expense objects
    @Override
    public String toString() {
        return "Expense{" +
                "id=" + id +
                ", date=" + date +
                ", medicineName='" + medicineName + '\'' +
                ", amount=" + amount +
                '}';
    }
}
