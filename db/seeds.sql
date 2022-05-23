INSERT INTO employee (id, first_name,last_name,role_id,managerId,department_id)
VALUES (1, "Tony", "Smith", 001,0,1),
       (2,"Neale", "Philippe", 002,1,2),
       (3,"Rut", "Prun",003,1,1),
       (4,"Jess", "Smith",004,3,3),
       (5,"Emma", "Harf",005,3,1);

INSERT INTO department (department_name,id)
VALUES ( "Company",1),
       ( "Operations",2),
       ( "Hr",3);
INSERT INTO role (id,title, salary,department_id)
VALUES (001,"Manager", 100000,1),
       (002,"Operations Manager", 60000,2),
       (003,"General Manager", 80000,1),
       (004,"Hr Manager", 60000,3),
       (005,"Client Account Manager", 65000,1);