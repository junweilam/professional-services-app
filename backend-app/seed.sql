-- Create a user 'example_user' with a password
CREATE USER IF NOT EXISTS 'users'@'%' IDENTIFIED BY 'pw123123';

-- Grant necessary permissions to 'example_user'
GRANT ALL PRIVILEGES ON *.* TO 'users'@'%';

-- Flush privileges to apply the changes
FLUSH PRIVILEGES;

-- Check if the database 'mydb' exists
SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'mydb';

-- If 'mydb' does not exist, create it
CREATE DATABASE IF NOT EXISTS mydb;

-- Switch to 'mydb' database
USE mydb;

-- Create services table
CREATE TABLE IF NOT EXISTS services(
    serviceID VARCHAR(10),
    ServiceName VARCHAR(255),
    ServiceDesc VARCHAR(255),
    ServiceAdd VARCHAR(255),
    Price FLOAT,
    PRIMARY KEY(serviceID)
);

-- Create users table
CREATE TABLE IF NOT EXISTS users(
    UID INT NOT NULL AUTO_INCREMENT,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255),
    Email varchar(255),
    ContactNo INT,
    Address varchar(255),
    Password varchar(255),
    Authorization INT,
    Token VARCHAR(255),
    serviceID VARCHAR(255),
    MistakeCount INT DEFAULT 0,
    IsLocked BOOLEAN DEFAULT 0,
    LockoutTimestamp DATETIME,
    PRIMARY KEY (UID),
    FOREIGN KEY(serviceID) REFERENCES services(serviceID)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    OrderID INT NOT NULL AUTO_INCREMENT,
    UID INT,
    serviceID VARCHAR(10),
    OrderTime TIMESTAMP,
    DateofService DATETIME,
    DeliveryAddress VARCHAR(255),
    Status VARCHAR(255),
    PRIMARY KEY (OrderID),
    FOREIGN KEY (UID) REFERENCES users(UID),
    FOREIGN KEY (serviceID) REFERENCES services(serviceID)
);

-- Insert dummy services
INSERT INTO services (serviceID, ServiceName, ServiceDesc, ServiceAdd, Price)
VALUES ("Pest1", "Cockroach Killer", "Kill Cockroach", "Batok", 60)
ON DUPLICATE KEY UPDATE
ServiceName = VALUES(ServiceName),
ServiceDesc = VALUES(ServiceDesc),
ServiceAdd = VALUES(ServiceAdd),
Price = VALUES(Price);

INSERT INTO services (serviceID, ServiceName, ServiceDesc, ServiceAdd, Price)
VALUES ("Term2", "Termite Killer", "Kill Termite", "Khatib", 100)
ON DUPLICATE KEY UPDATE
ServiceName = VALUES(ServiceName),
ServiceDesc = VALUES(ServiceDesc),
ServiceAdd = VALUES(ServiceAdd),
Price = VALUES(Price);

INSERT INTO services (serviceID, ServiceName, ServiceDesc, ServiceAdd, Price)
VALUES ("Clean1", "Mr Muscle Cleaner", "Number 1 cleaning service in Singapore", "Yishun", 150)
ON DUPLICATE KEY UPDATE
ServiceName = VALUES(ServiceName),
ServiceDesc = VALUES(ServiceDesc),
ServiceAdd = VALUES(ServiceAdd),
Price = VALUES(Price);

INSERT INTO services (serviceID, ServiceName, ServiceDesc, ServiceAdd, Price)
VALUES ("Elec1", "Hazard Destroyer", "Best electrician company in town","Jurong", 50)
ON DUPLICATE KEY UPDATE
ServiceName = VALUES(ServiceName),
ServiceDesc = VALUES(ServiceDesc),
ServiceAdd = VALUES(ServiceAdd),
Price = VALUES(Price);

-- Insert dummy admin : Password == Z1Y5hiVCLFk1GX8V91yV
INSERT INTO users (LastName, FirstName, Email, ContactNo, Address, Password, Authorization) 
VALUES ("admin1", "admin", "2100891@sit.singaporetech.edu.sg", 99999999, "admin", "$argon2id$v=19$m=65536,t=3,p=4$iAxy+R8m6f/Js+8224+Dzg$yi0+hr1VRZiWHgKZ0mKnnDoXKMxnLhbXl/Iqfmu9IxQ", 1);