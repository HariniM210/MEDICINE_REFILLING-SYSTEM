package com.MedRef.MedApp.model;

public class Medicine {

    private int id;
    private String name;
    private String dosage;
    private int stockCount;
    private boolean takenToday;
private String timing;
private double pricePerUnit;

    // Getters and Setters

public void setTiming(String timing) {
    this.timing = timing;
}

public void setPricePerUnit(double pricePerUnit) {
    this.pricePerUnit = pricePerUnit;
}
public String getTiming() { return timing; }
public double getPricePerUnit() { return pricePerUnit; }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public int getStockCount() {
        return stockCount;
    }

    public void setStockCount(int stockCount) {
        this.stockCount = stockCount;
    }

    public boolean isTakenToday() {
        return takenToday;
    }

    public void setTakenToday(boolean takenToday) {
        this.takenToday = takenToday;
    }
}
