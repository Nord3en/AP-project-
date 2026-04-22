-- 1. Create Users Table
CREATE TABLE users (
    uid INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    passHash VARCHAR(255) NOT NULL,
    name VARCHAR(100)
);

-- 2. Create Subjects Table
CREATE TABLE subjects (
    subid INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    color_code VARCHAR(7),
    teacher_email VARCHAR(255),
    group_number VARCHAR(50),
    CONSTRAINT fk_user_subject 
        FOREIGN KEY (user_id) 
        REFERENCES users(uid) 
        ON DELETE CASCADE
);

-- 3. Create Tasks Table
CREATE TABLE tasks (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL,
    subid INTEGER,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    is_completed BOOLEAN DEFAULT FALSE,
    source VARCHAR(100),
    CONSTRAINT fk_user_task 
        FOREIGN KEY (user_id) 
        REFERENCES users(uid) 
        ON DELETE CASCADE,
    CONSTRAINT fk_subject_task 
        FOREIGN KEY (subid) 
        REFERENCES subjects(subid) 
        ON DELETE SET NULL
);

//shannee 
//shannee again 