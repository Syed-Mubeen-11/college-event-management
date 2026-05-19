-- ===========================================
-- INSTITUTIONS TABLE
-- ===========================================
CREATE TABLE institutions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email_domain VARCHAR(100) UNIQUE,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    address TEXT,
    logo_url VARCHAR(500),
    signature_image_url VARCHAR(500),
    organizer_title VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- USERS TABLE
-- ===========================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    institution_id INT,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('SUPER_ADMIN', 'INSTITUTION_ADMIN', 'STUDENT')),
    branch VARCHAR(100),
    year VARCHAR(20) CHECK (year IN ('1st Year', '2nd Year', '3rd Year', '4th Year', NULL)),
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE,
    UNIQUE(institution_id, email)
);

-- ===========================================
-- EVENTS TABLE
-- ===========================================
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    institution_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    venue VARCHAR(200) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    registered_count INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'UPCOMING' CHECK (status IN ('UPCOMING', 'CLOSED', 'COMPLETED')),
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    CHECK (end_date > start_date)
);

-- ===========================================
-- REGISTRATIONS TABLE
-- ===========================================
CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    event_id INT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled BOOLEAN DEFAULT FALSE,
    cancelled_at TIMESTAMP,
    attendance_marked BOOLEAN DEFAULT FALSE,
    attendance_percentage INTEGER DEFAULT 0,
    grade VARCHAR(20),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE(student_id, event_id)
);

-- ===========================================
-- CERTIFICATES TABLE
-- ===========================================
CREATE TABLE certificates (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    certificate_unique_id VARCHAR(100) UNIQUE NOT NULL,
    certificate_url VARCHAR(500),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    issue_date DATE DEFAULT CURRENT_DATE,
    duration_hours INTEGER,
    grade VARCHAR(20),
    organizer_name VARCHAR(200),
    has_signature BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- ===========================================
-- INDEXES
-- ===========================================
CREATE INDEX idx_users_institution ON users(institution_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_branch_year ON users(branch, year);
CREATE INDEX idx_events_institution ON events(institution_id);
CREATE INDEX idx_events_dates ON events(start_date, end_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_registrations_student ON registrations(student_id);
CREATE INDEX idx_registrations_event ON registrations(event_id);

-- ===========================================
-- TRIGGER: Auto-update event status
-- ===========================================
CREATE OR REPLACE FUNCTION update_event_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.end_date < NOW() THEN
        NEW.status = 'COMPLETED';
    ELSIF NEW.start_date > NOW() AND NEW.status != 'CLOSED' THEN
        NEW.status = 'UPCOMING';
    ELSIF NEW.status != 'CLOSED' THEN
        NEW.status = 'UPCOMING';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_event_status
BEFORE INSERT OR UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_event_status();

-- ===========================================
-- TRIGGER: Update registered count
-- ===========================================
CREATE OR REPLACE FUNCTION update_event_registered_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.cancelled = FALSE THEN
        UPDATE events SET registered_count = registered_count + 1 WHERE id = NEW.event_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.cancelled = FALSE AND NEW.cancelled = TRUE THEN
        UPDATE events SET registered_count = registered_count - 1 WHERE id = NEW.event_id;
    ELSIF TG_OP = 'DELETE' AND OLD.cancelled = FALSE THEN
        UPDATE events SET registered_count = registered_count - 1 WHERE id = OLD.event_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_registration_count
AFTER INSERT OR UPDATE OR DELETE ON registrations
FOR EACH ROW
EXECUTE FUNCTION update_event_registered_count();

-- ===========================================
-- GRANT PERMISSIONS
-- ===========================================
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO event_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO event_admin;