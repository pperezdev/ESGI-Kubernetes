CREATE TABLE D_TODO
(
ID int NOT NULL AUTO_INCREMENT,
NAME varchar(255) NOT NULL,
DESCRIPTION  varchar(255) NOT NULL,
STATUS varchar(255) DEFAULT "not-done" NOT NULL,
PRIMARY KEY (ID)
);