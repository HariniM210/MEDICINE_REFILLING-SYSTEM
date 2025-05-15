-- Sample medicines (upsert via MERGE)
MERGE INTO medicine (name, dosage, stock_count, timing, taken_today, price_per_unit)
KEY(name, dosage)  -- uses the unique key on (name, dosage)
VALUES
  ('Paracetamol', '500mg', 20, 'Morning & Night', false, 2.0),
  ('Cetirizine',  '10mg',  15, 'Night',             false, 1.5),
  ('Metformin',   '850mg', 30, 'Morning',           false, 3.0);

-- Sample expenses (only inserts if the (date, medicine_name) key is new)
MERGE INTO expense (date, medicine_name, amount)
KEY(date, medicine_name)  -- composite key to prevent duplicate expense entries
VALUES
  (CURRENT_DATE, 'Paracetamol', 40.0),
  (CURRENT_DATE, 'Cetirizine', 22.5);

-- Uncomment to test foreign-key enforcement (this will now fail)
-- MERGE INTO expense (date, medicine_name, amount)
-- KEY(date, medicine_name)
-- VALUES (CURRENT_DATE, 'Aspirin', 15.0);
