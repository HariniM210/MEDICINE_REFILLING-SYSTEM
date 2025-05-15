package com.MedRef.MedApp.controller;

import com.MedRef.MedApp.model.Expense;
import com.MedRef.MedApp.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    // Add new expense
    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        return expenseService.addExpense(expense);
    }

    // Get all expenses
    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    // Get today's expenses
    @GetMapping("/today")
    public List<Expense> getTodaysExpenses() {
        return expenseService.getTodaysExpenses();
    }

    // Get a specific expense by ID
    @GetMapping("/{id}")
    public Expense getExpenseById(@PathVariable int id) {
        return expenseService.getExpenseById(id);
    }

    // Get monthly expenses (for a specific month)
    @GetMapping("/month/{year}/{month}")
    public List<Expense> getMonthlyExpenses(@PathVariable int year, @PathVariable int month) {
        return expenseService.getMonthlyExpenses(year, month);
    }

    // Update an expense
    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable int id, @RequestBody Expense expense) {
        return expenseService.updateExpense(id, expense);
    }

    // Delete an expense
    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable int id) {
        expenseService.deleteExpense(id);
    }
}
