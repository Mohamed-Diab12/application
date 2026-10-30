create database if not exists application;

use application;

create table users(
    email varchar(100) not null unique primary key,
    userPassword varchar(300) not null,
    userName varchar(50) not null,
    regstrationData date default(current_date)
);