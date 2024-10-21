INSERT INTO departments (name)
VALUES ('Engineering'),
       ('Finance'),
       ('Legal'),
       ('Sales'),
       ('Marketing'),
       ('Human Resources');

INSERT INTO roles (title, salary, department_id)
VALUES ('Software Engineer', 100000, 1),
       ('Accountant', 75000, 2),
       ('Lawyer', 120000, 3),
       ('Sales Lead', 80000, 4),
       ('CMO', 150000, 5),
       ('HR Director', 120000, 6);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, 1),
       ('Mike', 'Chan', 1, 1),
       ('Ashley', 'Rodriguez', 2, 2),
       ('Kevin', 'Tupik', 2, 2),
       ('Malia', 'Brown', 3, 3),
       ('Sarah', 'Lourd', 3, 3),
       ('Tom', 'Allen', 4, 4),
       ('Tina', 'Barkley', 4, 4),
       ('Erin', 'Nelson', 5, 5),
       ('Amy', 'Bennett', 5, 5),
       ('Nathan', 'Jensen', 6, 6),
       ('Samantha', 'Stuart', 6, 6);