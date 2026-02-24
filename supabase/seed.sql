-- LIS Clothing Swap — Seed Data
-- Run AFTER 0001_initial_schema.sql

-- Temporary helper function
CREATE OR REPLACE FUNCTION _seed_item(
  p_category  TEXT,
  p_item_name TEXT,
  p_gender    TEXT,
  p_size      TEXT
) RETURNS void AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO catalog_items (category, item_name, gender, size)
  VALUES (p_category, p_item_name, p_gender, p_size)
  ON CONFLICT (category, item_name, gender, size) DO NOTHING
  RETURNING id INTO v_id;

  IF v_id IS NOT NULL THEN
    INSERT INTO inventory (catalog_item_id, quantity)
    VALUES (v_id, 0)
    ON CONFLICT (catalog_item_id) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════
-- OFFICIAL SECONDARY  (XS S M L XL XXL)
-- ═══════════════════════════════════════════════════════

SELECT _seed_item('official_secondary','Polo Short-Sleeve','boys','XS');
SELECT _seed_item('official_secondary','Polo Short-Sleeve','boys','S');
SELECT _seed_item('official_secondary','Polo Short-Sleeve','boys','M');
SELECT _seed_item('official_secondary','Polo Short-Sleeve','boys','L');
SELECT _seed_item('official_secondary','Polo Short-Sleeve','boys','XL');
SELECT _seed_item('official_secondary','Polo Short-Sleeve','boys','XXL');
SELECT _seed_item('official_secondary','Polo Short-Sleeve','girls','XS');
SELECT _seed_item('official_secondary','Polo Short-Sleeve','girls','S');
SELECT _seed_item('official_secondary','Polo Short-Sleeve','girls','M');
SELECT _seed_item('official_secondary','Polo Short-Sleeve','girls','L');
SELECT _seed_item('official_secondary','Polo Short-Sleeve','girls','XL');
SELECT _seed_item('official_secondary','Polo Short-Sleeve','girls','XXL');

SELECT _seed_item('official_secondary','Polo Long-Sleeve','boys','XS');
SELECT _seed_item('official_secondary','Polo Long-Sleeve','boys','S');
SELECT _seed_item('official_secondary','Polo Long-Sleeve','boys','M');
SELECT _seed_item('official_secondary','Polo Long-Sleeve','boys','L');
SELECT _seed_item('official_secondary','Polo Long-Sleeve','boys','XL');
SELECT _seed_item('official_secondary','Polo Long-Sleeve','boys','XXL');
SELECT _seed_item('official_secondary','Polo Long-Sleeve','girls','XS');
SELECT _seed_item('official_secondary','Polo Long-Sleeve','girls','S');
SELECT _seed_item('official_secondary','Polo Long-Sleeve','girls','M');
SELECT _seed_item('official_secondary','Polo Long-Sleeve','girls','L');
SELECT _seed_item('official_secondary','Polo Long-Sleeve','girls','XL');
SELECT _seed_item('official_secondary','Polo Long-Sleeve','girls','XXL');

SELECT _seed_item('official_secondary','Sweatshirt','boys','XS');
SELECT _seed_item('official_secondary','Sweatshirt','boys','S');
SELECT _seed_item('official_secondary','Sweatshirt','boys','M');
SELECT _seed_item('official_secondary','Sweatshirt','boys','L');
SELECT _seed_item('official_secondary','Sweatshirt','boys','XL');
SELECT _seed_item('official_secondary','Sweatshirt','boys','XXL');
SELECT _seed_item('official_secondary','Sweatshirt','girls','XS');
SELECT _seed_item('official_secondary','Sweatshirt','girls','S');
SELECT _seed_item('official_secondary','Sweatshirt','girls','M');
SELECT _seed_item('official_secondary','Sweatshirt','girls','L');
SELECT _seed_item('official_secondary','Sweatshirt','girls','XL');
SELECT _seed_item('official_secondary','Sweatshirt','girls','XXL');

SELECT _seed_item('official_secondary','Chinos','boys','XS');
SELECT _seed_item('official_secondary','Chinos','boys','S');
SELECT _seed_item('official_secondary','Chinos','boys','M');
SELECT _seed_item('official_secondary','Chinos','boys','L');
SELECT _seed_item('official_secondary','Chinos','boys','XL');
SELECT _seed_item('official_secondary','Chinos','boys','XXL');
SELECT _seed_item('official_secondary','Chinos','girls','XS');
SELECT _seed_item('official_secondary','Chinos','girls','S');
SELECT _seed_item('official_secondary','Chinos','girls','M');
SELECT _seed_item('official_secondary','Chinos','girls','L');
SELECT _seed_item('official_secondary','Chinos','girls','XL');
SELECT _seed_item('official_secondary','Chinos','girls','XXL');

SELECT _seed_item('official_secondary','Jeans','boys','XS');
SELECT _seed_item('official_secondary','Jeans','boys','S');
SELECT _seed_item('official_secondary','Jeans','boys','M');
SELECT _seed_item('official_secondary','Jeans','boys','L');
SELECT _seed_item('official_secondary','Jeans','boys','XL');
SELECT _seed_item('official_secondary','Jeans','boys','XXL');
SELECT _seed_item('official_secondary','Jeans','girls','XS');
SELECT _seed_item('official_secondary','Jeans','girls','S');
SELECT _seed_item('official_secondary','Jeans','girls','M');
SELECT _seed_item('official_secondary','Jeans','girls','L');
SELECT _seed_item('official_secondary','Jeans','girls','XL');
SELECT _seed_item('official_secondary','Jeans','girls','XXL');

SELECT _seed_item('official_secondary','Skirt','girls','XS');
SELECT _seed_item('official_secondary','Skirt','girls','S');
SELECT _seed_item('official_secondary','Skirt','girls','M');
SELECT _seed_item('official_secondary','Skirt','girls','L');
SELECT _seed_item('official_secondary','Skirt','girls','XL');
SELECT _seed_item('official_secondary','Skirt','girls','XXL');

SELECT _seed_item('official_secondary','Skort','girls','XS');
SELECT _seed_item('official_secondary','Skort','girls','S');
SELECT _seed_item('official_secondary','Skort','girls','M');
SELECT _seed_item('official_secondary','Skort','girls','L');
SELECT _seed_item('official_secondary','Skort','girls','XL');
SELECT _seed_item('official_secondary','Skort','girls','XXL');

SELECT _seed_item('official_secondary','Cardigan','girls','XS');
SELECT _seed_item('official_secondary','Cardigan','girls','S');
SELECT _seed_item('official_secondary','Cardigan','girls','M');
SELECT _seed_item('official_secondary','Cardigan','girls','L');
SELECT _seed_item('official_secondary','Cardigan','girls','XL');
SELECT _seed_item('official_secondary','Cardigan','girls','XXL');

SELECT _seed_item('official_secondary','Panama Hat','unisex','XS');
SELECT _seed_item('official_secondary','Panama Hat','unisex','S');
SELECT _seed_item('official_secondary','Panama Hat','unisex','M');
SELECT _seed_item('official_secondary','Panama Hat','unisex','L');
SELECT _seed_item('official_secondary','Panama Hat','unisex','XL');
SELECT _seed_item('official_secondary','Panama Hat','unisex','XXL');

-- ═══════════════════════════════════════════════════════
-- OFFICIAL PRIMARY  (3-4Y 5-6Y 7-8Y 9-10Y 11-12Y)
-- ═══════════════════════════════════════════════════════

SELECT _seed_item('official_primary','Polo Short-Sleeve','boys','3-4Y');
SELECT _seed_item('official_primary','Polo Short-Sleeve','boys','5-6Y');
SELECT _seed_item('official_primary','Polo Short-Sleeve','boys','7-8Y');
SELECT _seed_item('official_primary','Polo Short-Sleeve','boys','9-10Y');
SELECT _seed_item('official_primary','Polo Short-Sleeve','boys','11-12Y');
SELECT _seed_item('official_primary','Polo Short-Sleeve','girls','3-4Y');
SELECT _seed_item('official_primary','Polo Short-Sleeve','girls','5-6Y');
SELECT _seed_item('official_primary','Polo Short-Sleeve','girls','7-8Y');
SELECT _seed_item('official_primary','Polo Short-Sleeve','girls','9-10Y');
SELECT _seed_item('official_primary','Polo Short-Sleeve','girls','11-12Y');

SELECT _seed_item('official_primary','Polo Long-Sleeve','boys','3-4Y');
SELECT _seed_item('official_primary','Polo Long-Sleeve','boys','5-6Y');
SELECT _seed_item('official_primary','Polo Long-Sleeve','boys','7-8Y');
SELECT _seed_item('official_primary','Polo Long-Sleeve','boys','9-10Y');
SELECT _seed_item('official_primary','Polo Long-Sleeve','boys','11-12Y');
SELECT _seed_item('official_primary','Polo Long-Sleeve','girls','3-4Y');
SELECT _seed_item('official_primary','Polo Long-Sleeve','girls','5-6Y');
SELECT _seed_item('official_primary','Polo Long-Sleeve','girls','7-8Y');
SELECT _seed_item('official_primary','Polo Long-Sleeve','girls','9-10Y');
SELECT _seed_item('official_primary','Polo Long-Sleeve','girls','11-12Y');

SELECT _seed_item('official_primary','Sweatshirt','boys','3-4Y');
SELECT _seed_item('official_primary','Sweatshirt','boys','5-6Y');
SELECT _seed_item('official_primary','Sweatshirt','boys','7-8Y');
SELECT _seed_item('official_primary','Sweatshirt','boys','9-10Y');
SELECT _seed_item('official_primary','Sweatshirt','boys','11-12Y');
SELECT _seed_item('official_primary','Sweatshirt','girls','3-4Y');
SELECT _seed_item('official_primary','Sweatshirt','girls','5-6Y');
SELECT _seed_item('official_primary','Sweatshirt','girls','7-8Y');
SELECT _seed_item('official_primary','Sweatshirt','girls','9-10Y');
SELECT _seed_item('official_primary','Sweatshirt','girls','11-12Y');

SELECT _seed_item('official_primary','Chinos','boys','3-4Y');
SELECT _seed_item('official_primary','Chinos','boys','5-6Y');
SELECT _seed_item('official_primary','Chinos','boys','7-8Y');
SELECT _seed_item('official_primary','Chinos','boys','9-10Y');
SELECT _seed_item('official_primary','Chinos','boys','11-12Y');
SELECT _seed_item('official_primary','Chinos','girls','3-4Y');
SELECT _seed_item('official_primary','Chinos','girls','5-6Y');
SELECT _seed_item('official_primary','Chinos','girls','7-8Y');
SELECT _seed_item('official_primary','Chinos','girls','9-10Y');
SELECT _seed_item('official_primary','Chinos','girls','11-12Y');

SELECT _seed_item('official_primary','Skirt','girls','3-4Y');
SELECT _seed_item('official_primary','Skirt','girls','5-6Y');
SELECT _seed_item('official_primary','Skirt','girls','7-8Y');
SELECT _seed_item('official_primary','Skirt','girls','9-10Y');
SELECT _seed_item('official_primary','Skirt','girls','11-12Y');

SELECT _seed_item('official_primary','Skort','girls','3-4Y');
SELECT _seed_item('official_primary','Skort','girls','5-6Y');
SELECT _seed_item('official_primary','Skort','girls','7-8Y');
SELECT _seed_item('official_primary','Skort','girls','9-10Y');
SELECT _seed_item('official_primary','Skort','girls','11-12Y');

SELECT _seed_item('official_primary','Panama Hat','unisex','3-4Y');
SELECT _seed_item('official_primary','Panama Hat','unisex','5-6Y');
SELECT _seed_item('official_primary','Panama Hat','unisex','7-8Y');
SELECT _seed_item('official_primary','Panama Hat','unisex','9-10Y');
SELECT _seed_item('official_primary','Panama Hat','unisex','11-12Y');

-- ═══════════════════════════════════════════════════════
-- PE SECONDARY  (XS S M L XL XXL)
-- ═══════════════════════════════════════════════════════

SELECT _seed_item('pe_secondary','T-Shirt','boys','XS');
SELECT _seed_item('pe_secondary','T-Shirt','boys','S');
SELECT _seed_item('pe_secondary','T-Shirt','boys','M');
SELECT _seed_item('pe_secondary','T-Shirt','boys','L');
SELECT _seed_item('pe_secondary','T-Shirt','boys','XL');
SELECT _seed_item('pe_secondary','T-Shirt','boys','XXL');
SELECT _seed_item('pe_secondary','T-Shirt','girls','XS');
SELECT _seed_item('pe_secondary','T-Shirt','girls','S');
SELECT _seed_item('pe_secondary','T-Shirt','girls','M');
SELECT _seed_item('pe_secondary','T-Shirt','girls','L');
SELECT _seed_item('pe_secondary','T-Shirt','girls','XL');
SELECT _seed_item('pe_secondary','T-Shirt','girls','XXL');
SELECT _seed_item('pe_secondary','T-Shirt','unisex','XS');
SELECT _seed_item('pe_secondary','T-Shirt','unisex','S');
SELECT _seed_item('pe_secondary','T-Shirt','unisex','M');
SELECT _seed_item('pe_secondary','T-Shirt','unisex','L');
SELECT _seed_item('pe_secondary','T-Shirt','unisex','XL');
SELECT _seed_item('pe_secondary','T-Shirt','unisex','XXL');

SELECT _seed_item('pe_secondary','Shorts','boys','XS');
SELECT _seed_item('pe_secondary','Shorts','boys','S');
SELECT _seed_item('pe_secondary','Shorts','boys','M');
SELECT _seed_item('pe_secondary','Shorts','boys','L');
SELECT _seed_item('pe_secondary','Shorts','boys','XL');
SELECT _seed_item('pe_secondary','Shorts','boys','XXL');
SELECT _seed_item('pe_secondary','Shorts','girls','XS');
SELECT _seed_item('pe_secondary','Shorts','girls','S');
SELECT _seed_item('pe_secondary','Shorts','girls','M');
SELECT _seed_item('pe_secondary','Shorts','girls','L');
SELECT _seed_item('pe_secondary','Shorts','girls','XL');
SELECT _seed_item('pe_secondary','Shorts','girls','XXL');

SELECT _seed_item('pe_secondary','Tracksuit Bottoms','boys','XS');
SELECT _seed_item('pe_secondary','Tracksuit Bottoms','boys','S');
SELECT _seed_item('pe_secondary','Tracksuit Bottoms','boys','M');
SELECT _seed_item('pe_secondary','Tracksuit Bottoms','boys','L');
SELECT _seed_item('pe_secondary','Tracksuit Bottoms','boys','XL');
SELECT _seed_item('pe_secondary','Tracksuit Bottoms','boys','XXL');
SELECT _seed_item('pe_secondary','Tracksuit Bottoms','girls','XS');
SELECT _seed_item('pe_secondary','Tracksuit Bottoms','girls','S');
SELECT _seed_item('pe_secondary','Tracksuit Bottoms','girls','M');
SELECT _seed_item('pe_secondary','Tracksuit Bottoms','girls','L');
SELECT _seed_item('pe_secondary','Tracksuit Bottoms','girls','XL');
SELECT _seed_item('pe_secondary','Tracksuit Bottoms','girls','XXL');

-- ═══════════════════════════════════════════════════════
-- PE PRESCHOOL/PRIMARY  (3-4Y 5-6Y 7-8Y 9-10Y 11-12Y)
-- ═══════════════════════════════════════════════════════

SELECT _seed_item('pe_preschool_primary','T-Shirt','boys','3-4Y');
SELECT _seed_item('pe_preschool_primary','T-Shirt','boys','5-6Y');
SELECT _seed_item('pe_preschool_primary','T-Shirt','boys','7-8Y');
SELECT _seed_item('pe_preschool_primary','T-Shirt','boys','9-10Y');
SELECT _seed_item('pe_preschool_primary','T-Shirt','boys','11-12Y');
SELECT _seed_item('pe_preschool_primary','T-Shirt','girls','3-4Y');
SELECT _seed_item('pe_preschool_primary','T-Shirt','girls','5-6Y');
SELECT _seed_item('pe_preschool_primary','T-Shirt','girls','7-8Y');
SELECT _seed_item('pe_preschool_primary','T-Shirt','girls','9-10Y');
SELECT _seed_item('pe_preschool_primary','T-Shirt','girls','11-12Y');

SELECT _seed_item('pe_preschool_primary','Shorts','boys','3-4Y');
SELECT _seed_item('pe_preschool_primary','Shorts','boys','5-6Y');
SELECT _seed_item('pe_preschool_primary','Shorts','boys','7-8Y');
SELECT _seed_item('pe_preschool_primary','Shorts','boys','9-10Y');
SELECT _seed_item('pe_preschool_primary','Shorts','boys','11-12Y');
SELECT _seed_item('pe_preschool_primary','Shorts','girls','3-4Y');
SELECT _seed_item('pe_preschool_primary','Shorts','girls','5-6Y');
SELECT _seed_item('pe_preschool_primary','Shorts','girls','7-8Y');
SELECT _seed_item('pe_preschool_primary','Shorts','girls','9-10Y');
SELECT _seed_item('pe_preschool_primary','Shorts','girls','11-12Y');

SELECT _seed_item('pe_preschool_primary','Tracksuit Bottoms','boys','3-4Y');
SELECT _seed_item('pe_preschool_primary','Tracksuit Bottoms','boys','5-6Y');
SELECT _seed_item('pe_preschool_primary','Tracksuit Bottoms','boys','7-8Y');
SELECT _seed_item('pe_preschool_primary','Tracksuit Bottoms','boys','9-10Y');
SELECT _seed_item('pe_preschool_primary','Tracksuit Bottoms','boys','11-12Y');
SELECT _seed_item('pe_preschool_primary','Tracksuit Bottoms','girls','3-4Y');
SELECT _seed_item('pe_preschool_primary','Tracksuit Bottoms','girls','5-6Y');
SELECT _seed_item('pe_preschool_primary','Tracksuit Bottoms','girls','7-8Y');
SELECT _seed_item('pe_preschool_primary','Tracksuit Bottoms','girls','9-10Y');
SELECT _seed_item('pe_preschool_primary','Tracksuit Bottoms','girls','11-12Y');

-- ═══════════════════════════════════════════════════════
-- DAILY SECONDARY  (XS S M L XL XXL)
-- ═══════════════════════════════════════════════════════

SELECT _seed_item('daily_secondary','Fleece Jacket','unisex','XS');
SELECT _seed_item('daily_secondary','Fleece Jacket','unisex','S');
SELECT _seed_item('daily_secondary','Fleece Jacket','unisex','M');
SELECT _seed_item('daily_secondary','Fleece Jacket','unisex','L');
SELECT _seed_item('daily_secondary','Fleece Jacket','unisex','XL');
SELECT _seed_item('daily_secondary','Fleece Jacket','unisex','XXL');

SELECT _seed_item('daily_secondary','Raincoat','unisex','XS');
SELECT _seed_item('daily_secondary','Raincoat','unisex','S');
SELECT _seed_item('daily_secondary','Raincoat','unisex','M');
SELECT _seed_item('daily_secondary','Raincoat','unisex','L');
SELECT _seed_item('daily_secondary','Raincoat','unisex','XL');
SELECT _seed_item('daily_secondary','Raincoat','unisex','XXL');

SELECT _seed_item('daily_secondary','Sweatshirt','unisex','XS');
SELECT _seed_item('daily_secondary','Sweatshirt','unisex','S');
SELECT _seed_item('daily_secondary','Sweatshirt','unisex','M');
SELECT _seed_item('daily_secondary','Sweatshirt','unisex','L');
SELECT _seed_item('daily_secondary','Sweatshirt','unisex','XL');
SELECT _seed_item('daily_secondary','Sweatshirt','unisex','XXL');

-- ═══════════════════════════════════════════════════════
-- DAILY PRESCHOOL/PRIMARY  (3-4Y 5-6Y 7-8Y 9-10Y 11-12Y)
-- ═══════════════════════════════════════════════════════

SELECT _seed_item('daily_preschool_primary','Fleece Jacket','unisex','3-4Y');
SELECT _seed_item('daily_preschool_primary','Fleece Jacket','unisex','5-6Y');
SELECT _seed_item('daily_preschool_primary','Fleece Jacket','unisex','7-8Y');
SELECT _seed_item('daily_preschool_primary','Fleece Jacket','unisex','9-10Y');
SELECT _seed_item('daily_preschool_primary','Fleece Jacket','unisex','11-12Y');

SELECT _seed_item('daily_preschool_primary','Raincoat','unisex','3-4Y');
SELECT _seed_item('daily_preschool_primary','Raincoat','unisex','5-6Y');
SELECT _seed_item('daily_preschool_primary','Raincoat','unisex','7-8Y');
SELECT _seed_item('daily_preschool_primary','Raincoat','unisex','9-10Y');
SELECT _seed_item('daily_preschool_primary','Raincoat','unisex','11-12Y');

SELECT _seed_item('daily_preschool_primary','Sweatshirt','unisex','3-4Y');
SELECT _seed_item('daily_preschool_primary','Sweatshirt','unisex','5-6Y');
SELECT _seed_item('daily_preschool_primary','Sweatshirt','unisex','7-8Y');
SELECT _seed_item('daily_preschool_primary','Sweatshirt','unisex','9-10Y');
SELECT _seed_item('daily_preschool_primary','Sweatshirt','unisex','11-12Y');

SELECT _seed_item('daily_preschool_primary','Hat','unisex','3-4Y');
SELECT _seed_item('daily_preschool_primary','Hat','unisex','5-6Y');
SELECT _seed_item('daily_preschool_primary','Hat','unisex','7-8Y');
SELECT _seed_item('daily_preschool_primary','Hat','unisex','9-10Y');
SELECT _seed_item('daily_preschool_primary','Hat','unisex','11-12Y');

-- Cleanup
DROP FUNCTION _seed_item;
