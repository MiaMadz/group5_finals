-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 17, 2026 at 03:52 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `breweries_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cafes_tbl`
--

CREATE TABLE `cafes_tbl` (
  `id` int(11) NOT NULL,
  `brewery_api_id` varchar(100) DEFAULT NULL,
  `added_by` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `brewery_type` varchar(50) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state_province` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `website_url` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews_tbl`
--

CREATE TABLE `reviews_tbl` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `cafe_id` int(11) NOT NULL,
  `stars` tinyint(4) NOT NULL CHECK (`stars` between 1 and 5),
  `review_text` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_tbl`
--

CREATE TABLE `users_tbl` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state_province` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cafes_tbl`
--
ALTER TABLE `cafes_tbl`
  ADD PRIMARY KEY (`id`),
  ADD KEY `added_by` (`added_by`);

--
-- Indexes for table `reviews_tbl`
--
ALTER TABLE `reviews_tbl`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `cafe_id` (`cafe_id`);

--
-- Indexes for table `users_tbl`
--
ALTER TABLE `users_tbl`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cafes_tbl`
--
ALTER TABLE `cafes_tbl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews_tbl`
--
ALTER TABLE `reviews_tbl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users_tbl`
--
ALTER TABLE `users_tbl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cafes_tbl`
--
ALTER TABLE `cafes_tbl`
  ADD CONSTRAINT `cafes_tbl_ibfk_1` FOREIGN KEY (`added_by`) REFERENCES `users_tbl` (`id`);

--
-- Constraints for table `reviews_tbl`
--
ALTER TABLE `reviews_tbl`
  ADD CONSTRAINT `reviews_tbl_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_tbl` (`id`),
  ADD CONSTRAINT `reviews_tbl_ibfk_2` FOREIGN KEY (`cafe_id`) REFERENCES `cafes_tbl` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
