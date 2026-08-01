-- Swap the Notion template out of the store for "Build Your First 5 Java
-- Projects", whose file now occupies that slot in the product-files bucket.
--
-- This updates the existing row rather than deleting and re-inserting, so the
-- product id is preserved and any orders referencing it keep their foreign key.
-- (No orders exist at the time of writing; if that ever changes, prefer adding
-- a new product over repointing an old one, so past receipts stay accurate.)

UPDATE products
SET
  slug = 'java-projects',
  title = 'Build Your First 5 Java Projects',
  description = 'Go from following tutorials to writing real Java, one project at a time.',
  storage_path = 'java-projects.pdf'
WHERE slug = 'notion-os';
