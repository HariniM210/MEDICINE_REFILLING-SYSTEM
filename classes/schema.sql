-- Creating the 'medicine' table with a unique constraint on 'name' and 'dosage'
CREATE TABLE IF NOT EXISTS medicine (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50),
    stock_count INT,
    timing VARCHAR(50),
    taken_today BOOLEAN,
    price_per_unit DOUBLE,
    CONSTRAINT unique_medicine UNIQUE (name, dosage)  -- Prevent duplicate medicines based on name and dosage
);

-- Creating the 'expense' table with a foreign key reference to the 'medicine' table
CREATE TABLE IF NOT EXISTS expense (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE,
    medicine_name VARCHAR(100),
    amount DOUBLE,
    FOREIGN KEY (medicine_name) REFERENCES medicine(name) -- Ensuring that 'medicine_name' in expense refers to a valid 'name' in medicine table
);
