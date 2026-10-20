CREATE DATABASE IF NOT EXISTS defaultdb;

CREATE USER 'lab5_writer'@'%' IDENTIFIED BY 'CHANGE_ME_WRITER_PASSWORD';
GRANT CREATE, INSERT ON defaultdb.* TO 'lab5_writer'@'%';

CREATE USER 'lab5_reader'@'%' IDENTIFIED BY 'CHANGE_ME_READER_PASSWORD';
GRANT SELECT ON defaultdb.* TO 'lab5_reader'@'%';

SHOW GRANTS FOR 'lab5_writer'@'%';
SHOW GRANTS FOR 'lab5_reader'@'%';