package com.MedRef.MedApp.mapper;

import com.MedRef.MedApp.model.Medicine;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class MedicineRowMapper implements RowMapper<Medicine> {

    @Override
    public Medicine mapRow(ResultSet rs, int rowNum) throws SQLException {
        Medicine med = new Medicine();
        med.setId(rs.getInt("id")); // ✅ fix datatype mismatch
        med.setName(rs.getString("name"));
        med.setDosage(rs.getString("dosage"));
        med.setStockCount(rs.getInt("stock_count"));
        med.setTiming(rs.getString("timing"));
        med.setTakenToday(rs.getBoolean("taken_today"));
        med.setPricePerUnit(rs.getDouble("price_per_unit"));
        return med;
    }
}
