-- USERS
CREATE TABLE user (
    user_id INT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    user_role ENUM('admin', 'guest', 'manager') NOT NULL,
    user_email VARCHAR(255) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) UNIQUE
);

-- PLATFORM ADMINS
CREATE TABLE platform_admin (
    user_id INT PRIMARY KEY,
    access_level VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

-- HOTEL MANAGERS
CREATE TABLE hotel_manager (
    user_id INT PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

-- GUESTS
CREATE TABLE guest (
    user_id INT PRIMARY KEY,
    age INT,
    gender VARCHAR(10),
    identity_number VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

-- HOTELS
CREATE TABLE hotels (
    hotel_id INT PRIMARY KEY,
    hotel_name VARCHAR(255),
    rating FLOAT,
    hotel_capacity INT,
    city VARCHAR(100),
    country VARCHAR(100),
    address VARCHAR(255),
    hotel_email VARCHAR(255),
    hotel_phone_number VARCHAR(20),
    hotel_description TEXT,
    status ENUM('open', 'closed', 'under_maintenance'),
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES hotel_manager(user_id)
);

-- HOTEL IMAGES
CREATE TABLE hotel_image (
    image_id INT PRIMARY KEY,
    hotel_id INT,
    image_url VARCHAR(255),
    uploaded_at DATETIME,
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
);

-- AMENITIES
CREATE TABLE amenities (
    amenity_id INT PRIMARY KEY,
    amenity_name VARCHAR(100),
    amenity_description TEXT
);

-- ROOMS
CREATE TABLE rooms (
    room_id INT PRIMARY KEY,
    room_name VARCHAR(100),
    hotel_id INT,
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
);

-- ROOM TYPES (Weak Entity: Composite PK)
CREATE TABLE room_types (
    room_id INT,
    type_capacity VARCHAR(100),
    available_capacity INT,
    room_price DECIMAL(10,2),
    PRIMARY KEY (room_id, type_capacity),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);

-- ROOM STATUSES (Weak Entity: Composite PK)
CREATE TABLE room_statuses (
    room_id INT,
    date DATE,
    availability_status ENUM('available', 'unavailable'),
    PRIMARY KEY (room_id, date),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);

-- BOOKINGS
CREATE TABLE bookings (
    booking_id INT PRIMARY KEY,
    hotel_id INT,
    check_in_date DATE,
    check_out_date DATE,
    booking_status ENUM('pending', 'confirmed', 'cancelled'),
    amount_due DECIMAL(10,2),
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
);

-- BOOKING GUESTS (Weak Entity: Composite PK)
CREATE TABLE booking_guests (
    booking_guest_no INT,
    booking_id INT,
    name VARCHAR(255),
    age INT,
    PRIMARY KEY (booking_guest_no, booking_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

-- WALLET
CREATE TABLE wallet (
    wallet_id INT PRIMARY KEY,
    user_id INT,
    balance DECIMAL(10,2),
    last_updated DATETIME,
    FOREIGN KEY (user_id) REFERENCES guest(user_id)
);

-- TRANSACTIONS (Link with Bookings)
CREATE TABLE transactions (
    transaction_id INT PRIMARY KEY,
    wallet_id INT,
    booking_id INT,
    amount DECIMAL(10,2),
    transaction_type VARCHAR(50),
    timestamp DATETIME,
    method VARCHAR(50),
    status VARCHAR(50),
    points_used INT,
    points_earned INT,
    FOREIGN KEY (wallet_id) REFERENCES wallet(wallet_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

-- LOYALTY PROGRAM
CREATE TABLE loyalty_program (
    loyalty_id INT PRIMARY KEY,
    user_id INT,
    membership_level VARCHAR(50),
    date_joined DATE,
    conversion_rate FLOAT,
    FOREIGN KEY (user_id) REFERENCES guest(user_id)
);

-- REVIEWS (Linked to Bookings)
CREATE TABLE reviews (
    review_id INT PRIMARY KEY,
    booking_id INT,
    review TEXT,
    rating INT,
    date DATE,
    response TEXT,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

-- REPORTS
CREATE TABLE reports (
    report_id INT PRIMARY KEY,
    user_id INT,
    generated_at DATETIME,
    content TEXT,
    FOREIGN KEY (user_id) REFERENCES platform_admin(user_id)
);

-- MANY-TO-MANY RELATIONSHIPS

-- HOTEL_AMENITIES (M:N between hotels and amenities)
CREATE TABLE hotel_amenities (
    hotel_id INT,
    amenity_id INT,
    PRIMARY KEY (hotel_id, amenity_id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id),
    FOREIGN KEY (amenity_id) REFERENCES amenities(amenity_id)
);

-- ROOM_AMENITIES (M:N between rooms and amenities)
CREATE TABLE room_amenities (
    room_id INT,
    amenity_id INT,
    PRIMARY KEY (room_id, amenity_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id),
    FOREIGN KEY (amenity_id) REFERENCES amenities(amenity_id)
);

-- GUEST_BOOKINGS (M:N between guests and bookings)
CREATE TABLE guest_bookings (
    guest_id INT,
    booking_id INT,
    PRIMARY KEY (guest_id, booking_id),
    FOREIGN KEY (guest_id) REFERENCES guest(user_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);