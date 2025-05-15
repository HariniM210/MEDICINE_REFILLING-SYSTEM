package com.MedRef.MedApp.service;

import com.MedRef.MedApp.model.Medicine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MedicineService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Add new medicine and return the added medicine
    public Medicine addMedicine(Medicine medicine) {
        String sql = "INSERT INTO medicine (name, dosage, stock_count, taken_today) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql, medicine.getName(), medicine.getDosage(), medicine.getStockCount(), false);
        
        // Return the medicine object (with added ID)
        String query = "SELECT * FROM medicine WHERE name = ? AND dosage = ? ORDER BY id DESC LIMIT 1";
        return jdbcTemplate.queryForObject(query, new BeanPropertyRowMapper<>(Medicine.class),
                medicine.getName(), medicine.getDosage());
    }

    // Get all medicines
    public List<Medicine> getAllMedicines() {
        String sql = "SELECT * FROM medicine";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Medicine.class));
    }

    // Get today's medicines (not taken yet)
    public List<Medicine> getTodaysMedicines() {
        String sql = "SELECT * FROM medicine WHERE taken_today = false";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Medicine.class));
    }

    // Get low stock medicines
    public List<Medicine> getLowStockMedicines() {
        String sql = "SELECT * FROM medicine WHERE stock_count < 5";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Medicine.class));
    }

    // Get medicines with alert (after 9 PM)
    public List<Medicine> getAlertMedicines() {
        String sql = "SELECT * FROM medicine WHERE taken_today = false";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Medicine.class));
    }

    // Get a specific medicine by ID
    public Medicine getMedicineById(Long id) {
        String sql = "SELECT * FROM medicine WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(Medicine.class), id);
    }

    // Mark medicine as taken
    public Medicine markMedicineAsTaken(Long id) {
        Medicine med = getMedicineById(id);
        if (!med.isTakenToday() && med.getStockCount() > 0) {
            med.setTakenToday(true);
            med.setStockCount(med.getStockCount() - 1);
            updateMedicine(id, med);
        }
        return med;
    }

    // Update medicine
    public Medicine updateMedicine(Long id, Medicine medicine) {
        String sql = "UPDATE medicine SET name = ?, dosage = ?, stock_count = ?, taken_today = ? WHERE id = ?";
        jdbcTemplate.update(sql, medicine.getName(), medicine.getDosage(), medicine.getStockCount(), medicine.isTakenToday(), id);
        
        return getMedicineById(id);
    }

    // Delete medicine
    public void deleteMedicine(Long id) {
        String sql = "DELETE FROM medicine WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    // Track user interaction
    public void trackUserInteraction(Long id, String action) {
        System.out.println("Tracking interaction for medicine ID " + id + " with action: " + action);
    }
}
