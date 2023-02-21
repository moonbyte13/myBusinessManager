SELECT
  roles.id,
  roles.title,
  department.name AS department,
  roles.salary
FROM roles
LEFT JOIN department ON roles.department_id = department.id;