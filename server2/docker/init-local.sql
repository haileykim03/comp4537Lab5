CREATE DATABASE IF NOT EXISTS lab5;

CREATE USER 'lab5_writer'@'%' IDENTIFIED BY 'lab5-local-writer-only';
GRANT CREATE, INSERT ON lab5.* TO 'lab5_writer'@'%';

CREATE USER 'lab5_reader'@'%' IDENTIFIED BY 'lab5-local-reader-only';
GRANT SELECT ON lab5.* TO 'lab5_reader'@'%';
