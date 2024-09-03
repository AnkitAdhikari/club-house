const { Client } = require('pg');
require('dotenv').config();

const SQL = `
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_member BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE
);

    CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    INSERT INTO users (first_name, last_name, username, password, is_member, is_admin)
VALUES
    ('John', 'Doe', 'johndoe', 'passwordhash1', FALSE, TRUE),       -- Admin user
    ('Jane', 'Smith', 'janesmith', 'passwordhash2', TRUE, FALSE),   -- Member user
    ('Alice', 'Johnson', 'alicejohnson', 'passwordhash3', FALSE, FALSE),
    ('Bob', 'Brown', 'bobbrown', 'passwordhash4', FALSE, FALSE),
    ('Charlie', 'Davis', 'charliedavis', 'passwordhash5', TRUE, FALSE),
    ('Emily', 'White', 'emilywhite', 'passwordhash6', FALSE, FALSE),
    ('David', 'Wilson', 'davidwilson', 'passwordhash7', FALSE, FALSE),
    ('Olivia', 'Taylor', 'oliviataylor', 'passwordhash8', TRUE, FALSE),
    ('Sophia', 'Martinez', 'sophiamartinez', 'passwordhash9', FALSE, FALSE),
    ('Liam', 'Moore', 'liammoore', 'passwordhash10', FALSE, FALSE);

    INSERT INTO messages (user_id, title, message, timestamp)
VALUES
    (3, 'Hello World!', 'This is my first message. Excited to be here!', '2024-09-02 12:00:00'),
    (4, 'Feature Request', 'I would like to suggest a new feature for the platform.', '2024-09-03 09:30:00'),
    (5, 'Bug Report', 'I found a bug in the system. Here are the details...', '2024-09-03 14:15:00'),
    (6, 'Thank You!', 'Just wanted to say thanks for the great service.', '2024-09-04 08:45:00'),
    (7, 'Question about Membership', 'Can I upgrade my membership plan?', '2024-09-04 13:20:00'),
    (8, 'Event Announcement', 'We are hosting an event next week. Donot miss it!', '2024-09-05 16:00:00'),
    (9, 'Feedback', 'Here is some feedback on the recent update.', '2024-09-06 10:30:00'),
    (10, 'Support Request', 'I need help with my account. Please assist.', '2024-09-06 11:45:00');


`;

async function main() {
    console.log("Seeding...");
    const client = new Client({
        connectionString: process.env.DB_STRING,
    })
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
}

main();
