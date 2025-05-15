package com.MedRef.MedApp.service;

import com.MedRef.MedApp.model.Expense;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Add new expense
    public Expense addExpense(Expense expense) {
        String sql = "INSERT INTO EXPENSE (DATE, MEDICINE_NAME, AMOUNT) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, expense.getDate(), expense.getMedicineName(), expense.getAmount());
        return expense;
    }

    // Get all expenses
    public List<Expense> getAllExpenses() {
        String sql = "SELECT * FROM EXPENSE";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Expense.class));
    }

    // Get today's expenses
    public List<Expense> getTodaysExpenses() {
        LocalDate today = LocalDate.now();
        String sql = "SELECT * FROM EXPENSE WHERE DATE = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Expense.class), today);
    }

    // Get a specific expense by ID
    public Expense getExpenseById(int id) {
        String sql = "SELECT * FROM EXPENSE WHERE ID = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(Expense.class), id);
    }

    // Get monthly expenses (for a specific month)
    public List<Expense> getMonthlyExpenses(int year, int month) {
        String sql = "SELECT * FROM EXPENSE WHERE EXTRACT(YEAR FROM DATE) = ? AND EXTRACT(MONTH FROM DATE) = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Expense.class), year, month);
    }

    // Update an expense
    public Expense updateExpense(int id, Expense expense) {
        String sql = "UPDATE EXPENSE SET DATE = ?, MEDICINE_NAME = ?, AMOUNT = ? WHERE ID = ?";
        jdbcTemplate.update(sql, expense.getDate(), expense.getMedicineName(), expense.getAmount(), id);
        return expense;
    }

    // Delete an expense
    public void deleteExpense(int id) {
        String sql = "DELETE FROM EXPENSE WHERE ID = ?";
        jdbcTemplate.update(sql, id);
    }
}
