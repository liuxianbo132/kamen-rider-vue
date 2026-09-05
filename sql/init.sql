-- ============================================================
-- 商城毕业设计系统 - MySQL 初始化脚本
-- 说明：系统默认使用 SQLite（后端启动时自动建表初始化，零配置）。
--       本脚本供需要在 MySQL 环境下部署/答辩演示时使用，两者表结构一致。
-- 使用方式：mysql -u root -p < sql/init.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS graduation_mall DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE graduation_mall;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 商品表
CREATE TABLE IF NOT EXISTS goods (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  category VARCHAR(50),
  image_url VARCHAR(255),
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 轮播图表
CREATE TABLE IF NOT EXISTS banners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  image_url VARCHAR(255) NOT NULL,
  link_url VARCHAR(255),
  sort_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 初始数据
-- ============================================================

-- 初始化管理员（账号 admin / 密码 123456，密文由 bcryptjs 加密生成）
INSERT INTO users (username, password, role) VALUES
('admin', '$2a$10$0ep80hhmkjPiEyTZaG6ZxOC7EThnDuQ.UDspb2.VJd4EYQrsRHlC.', 'admin');

-- 10 条演示商品（假面骑士驱动器腰带，图片为前端 public/images 静态资源）
INSERT INTO goods (name, price, stock, category, image_url, description) VALUES
('W 驱动器（Cyclone & Joker）', 180.00, 100, '平成系列', '/images/1.jpg', '双插槽变身腰带，疾风与王牌的旋律'),
('OOO 驱动器', 220.00, 80, '平成系列', '/images/2.jpg', '三枚核心奖章，欲望的化身'),
('Build 驱动器', 260.00, 60, '平成系列', '/images/3.jpg', '满装瓶罐变身系统，天才物理学家的杰作'),
('01 驱动器', 240.00, 50, '令和系列', '/images/4.jpg', '飞电或人之腰，人工生命体的黎明'),
('Faiz 驱动器', 190.00, 90, '平成系列', '/images/5.jpg', '555 变身腰带，流线型未来设计'),
('Decade 驱动器', 280.00, 40, '平成系列', '/images/6.jpg', '穿越世界的破坏者，卡片式变身'),
('Kabuto 驱动器', 200.00, 70, '平成系列', '/images/7.jpg', '天道总司的正义，速度变身系统'),
('Zi-O 驱动器', 230.00, 55, '平成系列', '/images/8.jpg', '时之魔王，驾驭时间的骑士表头'),
('Den-O 驱动器', 210.00, 65, '平成系列', '/images/xilie.jpg', '月台通行，异魔神附身的变身腰带'),
('Ex-Aid 驱动器', 195.00, 75, '平成系列', '/images/xilie2.jpg', '游戏领域展开，卡带式变身');

-- 3 条轮播图（假面骑士主题）
INSERT INTO banners (image_url, link_url, sort_order) VALUES
('/images/hero.jpg', '/', 1),
('/images/123.jpg', '/', 2),
('/images/xilie3.jpg', '/', 3);
