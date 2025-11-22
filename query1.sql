DROP DATABASE IF EXISTS DevProjectDB;
GO

CREATE DATABASE DevProjectDB;
GO

USE DevProjectDB;
GO

-- Developer table
DROP TABLE IF EXISTS Developer;
GO
CREATE TABLE Developer (
    DeveloperID INT PRIMARY KEY IDENTITY(1,1),
    FName VARCHAR(50) NOT NULL,
    LName VARCHAR(50) NOT NULL,
    Email VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(20) NOT NULL
);

-- Project table
DROP TABLE IF EXISTS Project;
GO
CREATE TABLE Project (
    ProjectID INT PRIMARY KEY IDENTITY(1,1),
    ProjectName VARCHAR(50) NOT NULL,
    ProjectDescription VARCHAR(50),
    StartDate DATE NOT NULL,
    TargetDate DATE
);

-- Task table
DROP TABLE IF EXISTS Task;
GO
CREATE TABLE Task (
    TaskID INT PRIMARY KEY IDENTITY(1,1),
    ProjectID INT NOT NULL,
    TaskDescription VARCHAR(50) NOT NULL,
    StartDate DATE NOT NULL,
    TargetDate DATE,
    Priority VARCHAR(10) CHECK (Priority IN ('High', 'Medium', 'Low')),
    FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID)
);

-- Project_Management table
DROP TABLE IF EXISTS Project_Management;
GO
CREATE TABLE Project_Management (
    ProjectID INT NOT NULL,
    DeveloperID INT NOT NULL,
    Role VARCHAR(10) CHECK (Role IN ('Editor', 'Viewer', 'Commenter')),
    PRIMARY KEY (ProjectID, DeveloperID),
    FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID),
    FOREIGN KEY (DeveloperID) REFERENCES Developer(DeveloperID)
);


