package com.MedRef.MedApp.controller;

import com.MedRef.MedApp.model.Medicine;
import com.MedRef.MedApp.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicines")
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    // Add a new medicine
    @PostMapping
    public Medicine addMedicine(@RequestBody Medicine medicine) {
        return medicineService.addMedicine(medicine);
    }

    // Get all medicines
    @GetMapping
    public List<Medicine> getAllMedicines() {
        return medicineService.getAllMedicines();
    }

    // Get today's medicines
    @GetMapping("/today")
    public List<Medicine> getTodaysMedicines() {
        return medicineService.getTodaysMedicines();
    }

    // Get low stock medicines
    @GetMapping("/low-stock")
    public List<Medicine> getLowStockMedicines() {
        return medicineService.getLowStockMedicines();
    }

    // Get medicines with alert (after 9 PM)
    @GetMapping("/alerts")
    public List<Medicine> getAlertMedicines() {
        return medicineService.getAlertMedicines();
    }

    // Get a specific medicine by ID
    @GetMapping("/{id}")
    public Medicine getMedicineById(@PathVariable Long id) {
        return medicineService.getMedicineById(id);
    }

    // Mark medicine as taken
    @PutMapping("/{id}/taken")
    public Medicine markAsTaken(@PathVariable Long id) {
        return medicineService.markMedicineAsTaken(id);
    }

    // Update a medicine
    @PutMapping("/{id}")
    public Medicine updateMedicine(@PathVariable Long id, @RequestBody Medicine medicine) {
        return medicineService.updateMedicine(id, medicine);
    }

    // Delete a medicine
    @DeleteMapping("/{id}")
    public void deleteMedicine(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
    }

    // Track user interaction
    @PostMapping("/{id}/track")
    public void trackInteraction(@PathVariable Long id, @RequestParam String action) {
        medicineService.trackUserInteraction(id, action);
    }
}
