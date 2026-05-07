-- ─────────────────────────────────────────────────────
--  Migration: Add property_id to contacts table
--  Run ONLY if contacts table already exists
--  mysql -u root -p estatehub < migrate_contacts.sql
-- ─────────────────────────────────────────────────────

USE estatehub;

ALTER TABLE contacts
  ADD COLUMN property_id INT NULL DEFAULT NULL,
  ADD CONSTRAINT fk_contact_property
    FOREIGN KEY (property_id)
    REFERENCES properties(id)
    ON DELETE SET NULL;
