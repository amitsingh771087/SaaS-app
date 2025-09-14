-- 5.1 Tenancy & Users
CREATE TABLE tenants (
  id CHAR(36) PRIMARY KEY,
  slug VARCHAR(60) NOT NULL UNIQUE,
  display_name VARCHAR(120) NOT NULL,
  legal_name VARCHAR(200),
  currency CHAR(3) NOT NULL DEFAULT 'INR',
  timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Kolkata',
  gst_enabled TINYINT(1) NOT NULL DEFAULT 1,
  gstin VARCHAR(15),
  address JSON,
  branding JSON,
  locale JSON,
  invoice_settings JSON,
  payment_settings JSON,
  comm_settings JSON,
  features JSON,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(160) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  password_hash TEXT,
  full_name VARCHAR(120),
  status ENUM('active','invited','disabled') NOT NULL DEFAULT 'active',
  last_login DATETIME(6),
  locale VARCHAR(10) NOT NULL DEFAULT 'en',
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB;

CREATE TABLE tenant_users (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  role ENUM('owner','manager','staff','accountant','viewer') NOT NULL DEFAULT 'staff',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  invited_by CHAR(36),
  invite_token VARCHAR(64),
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  UNIQUE KEY uq_tenant_user (tenant_id, user_id),
  KEY ix_tenant_users_tenant (tenant_id),
  CONSTRAINT fk_tu_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_tu_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE numbering_sequences (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  seq_key VARCHAR(30) NOT NULL,
  prefix VARCHAR(10),
  next_int INT NOT NULL DEFAULT 1001,
  padding INT NOT NULL DEFAULT 0,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  UNIQUE KEY uq_seq (tenant_id, seq_key),
  CONSTRAINT fk_seq_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB;


-- 5.2 Customers
CREATE TABLE customers (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  display_name VARCHAR(120) NOT NULL,
  first_name VARCHAR(80),
  last_name VARCHAR(80),
  primary_phone VARCHAR(20),
  primary_email VARCHAR(160),
  whatsapp_opt_in TINYINT(1) NOT NULL DEFAULT 1,
  tags JSON,
  gstin VARCHAR(15),
  billing_address JSON,
  shipping_address JSON,
  notes TEXT,
  source VARCHAR(40),
  status ENUM('active','inactive','blacklisted') NOT NULL DEFAULT 'active',
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  KEY ix_cust_tenant (tenant_id),
  KEY ix_cust_phone (tenant_id, primary_phone),
  KEY ix_cust_email (tenant_id, primary_email),
  CONSTRAINT fk_cust_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB;

CREATE TABLE customer_contacts (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  customer_id CHAR(36) NOT NULL,
  label VARCHAR(40),
  phone VARCHAR(20),
  email VARCHAR(160),
  is_primary TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  KEY ix_cc_tenant (tenant_id),
  KEY ix_cc_customer (tenant_id, customer_id),
  CONSTRAINT fk_cc_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_cc_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
) ENGINE=InnoDB;

CREATE TABLE customer_timeline (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  customer_id CHAR(36) NOT NULL,
  event_type VARCHAR(40) NOT NULL,
  data JSON,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  created_by CHAR(36),
  KEY ix_ct_tenant (tenant_id),
  KEY ix_ct_customer (tenant_id, customer_id, created_at),
  CONSTRAINT fk_ct_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_ct_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
) ENGINE=InnoDB;


-- 5.3 Catalog (Items/Services)
CREATE TABLE item_categories (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  name VARCHAR(80) NOT NULL,
  parent_id CHAR(36),
  slug VARCHAR(100),
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  UNIQUE KEY uq_cat_slug (tenant_id, slug),
  KEY ix_cat_parent (tenant_id, parent_id),
  CONSTRAINT fk_cat_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_cat_parent FOREIGN KEY (parent_id) REFERENCES item_categories(id)
) ENGINE=InnoDB;

CREATE TABLE items (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  sku VARCHAR(60),
  barcode VARCHAR(64),
  name VARCHAR(160) NOT NULL,
  type ENUM('service','product') NOT NULL,
  category_id CHAR(36),
  unit VARCHAR(20),
  sell_price DECIMAL(14,2) NOT NULL DEFAULT 0,
  cost_price DECIMAL(14,2),
  tax_rate_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
  hsn_sac VARCHAR(10),
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  meta JSON,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  UNIQUE KEY uq_item_sku (tenant_id, sku),
  KEY ix_item_name (tenant_id, name),
  KEY ix_item_cat (tenant_id, category_id),
  CONSTRAINT fk_item_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_item_cat FOREIGN KEY (category_id) REFERENCES item_categories(id)
) ENGINE=InnoDB;

CREATE TABLE item_prices (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  item_id CHAR(36) NOT NULL,
  price_list VARCHAR(40) NOT NULL,
  sell_price DECIMAL(14,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'INR',
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  UNIQUE KEY uq_item_price (tenant_id, item_id, price_list),
  KEY ix_ip_tenant (tenant_id),
  CONSTRAINT fk_ip_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_ip_item FOREIGN KEY (item_id) REFERENCES items(id)
) ENGINE=InnoDB;

CREATE TABLE item_media (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  item_id CHAR(36) NOT NULL,
  file_id CHAR(36) NOT NULL,
  caption VARCHAR(140),
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  KEY ix_im (tenant_id, item_id),
  CONSTRAINT fk_im_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB;


-- 5.4 Orders & Lines
CREATE TABLE orders (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  order_number VARCHAR(30) NOT NULL,
  customer_id CHAR(36) NOT NULL,
  status ENUM('draft','pending','in_progress','completed','delivered','cancelled') NOT NULL DEFAULT 'pending',
  order_type VARCHAR(30),
  scheduled_date DATE,
  scheduled_start DATETIME(6),
  scheduled_end DATETIME(6),
  assigned_to CHAR(36),
  currency CHAR(3) NOT NULL DEFAULT 'INR',
  subtotal DECIMAL(14,2) NOT NULL DEFAULT 0,
  discount_total DECIMAL(14,2) NOT NULL DEFAULT 0,
  tax_total DECIMAL(14,2) NOT NULL DEFAULT 0,
  grand_total DECIMAL(14,2) NOT NULL DEFAULT 0,
  amount_paid DECIMAL(14,2) NOT NULL DEFAULT 0,
  amount_due DECIMAL(14,2) NOT NULL DEFAULT 0,
  discount_type ENUM('percent','flat'),
  discount_value DECIMAL(14,2),
  tax_inclusive TINYINT(1) NOT NULL DEFAULT 0,
  place_of_supply VARCHAR(2),
  meta JSON,
  notes_internal TEXT,
  notes_customer TEXT,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  UNIQUE KEY uq_order_num (tenant_id, order_number),
  KEY ix_order_status (tenant_id, status, scheduled_date),
  CONSTRAINT fk_order_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
) ENGINE=InnoDB;

CREATE TABLE order_line_items (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  order_id CHAR(36) NOT NULL,
  item_id CHAR(36),
  sku VARCHAR(60),
  name VARCHAR(160) NOT NULL,
  description TEXT,
  unit VARCHAR(20),
  qty DECIMAL(14,3) NOT NULL,
  price DECIMAL(14,2) NOT NULL,
  discount DECIMAL(14,2) NOT NULL DEFAULT 0,
  tax_rate_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
  tax_components JSON,
  is_tax_inclusive TINYINT(1) NOT NULL DEFAULT 0,
  line_subtotal DECIMAL(14,2) NOT NULL,
  line_tax DECIMAL(14,2) NOT NULL DEFAULT 0,
  line_total DECIMAL(14,2) NOT NULL,
  hsn_sac VARCHAR(10),
  staff_id CHAR(36),
  meta JSON,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  KEY ix_oli_order (tenant_id, order_id),
  CONSTRAINT fk_oli_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_oli_order FOREIGN KEY (order_id) REFERENCES orders(id)
) ENGINE=InnoDB;


-- 5.5 Invoices & Lines
CREATE TABLE invoices (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  invoice_number VARCHAR(30) NOT NULL,
  order_id CHAR(36),
  customer_id CHAR(36) NOT NULL,
  status ENUM('draft','issued','paid','part_paid','void') NOT NULL DEFAULT 'draft',
  issue_date DATE NOT NULL,
  due_date DATE,
  currency CHAR(3) NOT NULL DEFAULT 'INR',
  subtotal DECIMAL(14,2) NOT NULL,
  discount_total DECIMAL(14,2) NOT NULL DEFAULT 0,
  tax_total DECIMAL(14,2) NOT NULL DEFAULT 0,
  grand_total DECIMAL(14,2) NOT NULL,
  amount_paid DECIMAL(14,2) NOT NULL DEFAULT 0,
  amount_due DECIMAL(14,2) AS (GREATEST(grand_total - amount_paid, 0)) STORED,
  tax_inclusive TINYINT(1) NOT NULL DEFAULT 0,
  place_of_supply VARCHAR(2),
  billing_address_snapshot JSON,
  invoice_notes TEXT,
  terms TEXT,
  meta JSON,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  UNIQUE KEY uq_invoice_num (tenant_id, invoice_number),
  KEY ix_inv_status_due (tenant_id, status, due_date),
  CONSTRAINT fk_inv_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_inv_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
) ENGINE=InnoDB;

CREATE TABLE invoice_line_items (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  invoice_id CHAR(36) NOT NULL,
  sku VARCHAR(60),
  name VARCHAR(160) NOT NULL,
  description TEXT,
  unit VARCHAR(20),
  qty DECIMAL(14,3) NOT NULL,
  price DECIMAL(14,2) NOT NULL,
  discount DECIMAL(14,2) NOT NULL DEFAULT 0,
  tax_rate_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
  tax_components JSON,
  is_tax_inclusive TINYINT(1) NOT NULL DEFAULT 0,
  line_subtotal DECIMAL(14,2) NOT NULL,
  line_tax DECIMAL(14,2) NOT NULL DEFAULT 0,
  line_total DECIMAL(14,2) NOT NULL,
  hsn_sac VARCHAR(10),
  meta JSON,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  KEY ix_ili_inv (tenant_id, invoice_id),
  CONSTRAINT fk_ili_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_ili_inv FOREIGN KEY (invoice_id) REFERENCES invoices(id)
) ENGINE=InnoDB;


-- 5.6 Payments & Allocations
CREATE TABLE payments (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  customer_id CHAR(36) NOT NULL,
  received_on DATE NOT NULL,
  method ENUM('upi','card','cash','bank_transfer','wallet','cheque','other') NOT NULL,
  amount DECIMAL(14,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'INR',
  reference TEXT,
  gateway VARCHAR(30),
  gateway_payment_id VARCHAR(80),
  status ENUM('captured','pending','failed','refunded','part_refunded') NOT NULL DEFAULT 'captured',
  notes TEXT,
  meta JSON,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  KEY ix_pay_cust_date (tenant_id, customer_id, received_on),
  UNIQUE KEY uq_gateway_pid (tenant_id, gateway_payment_id),
  CONSTRAINT fk_pay_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_pay_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
) ENGINE=InnoDB;

CREATE TABLE payment_allocations (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  payment_id CHAR(36) NOT NULL,
  invoice_id CHAR(36) NOT NULL,
  allocated_amount DECIMAL(14,2) NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  KEY ix_pa_payment (tenant_id, payment_id),
  KEY ix_pa_invoice (tenant_id, invoice_id),
  CONSTRAINT fk_pa_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_pa_payment FOREIGN KEY (payment_id) REFERENCES payments(id),
  CONSTRAINT fk_pa_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id)
) ENGINE=InnoDB;



-- 5.7 Inventory & Purchases
CREATE TABLE stock_locations (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  name VARCHAR(80) NOT NULL,
  type ENUM('store','warehouse','vehicle','room','cold') NOT NULL DEFAULT 'store',
  address JSON,
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  UNIQUE KEY uq_loc_name (tenant_id, name),
  CONSTRAINT fk_loc_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB;

CREATE TABLE stock_txns (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  item_id CHAR(36) NOT NULL,
  location_id CHAR(36) NOT NULL,
  txn_type ENUM('purchase','sale','consume','adjust_in','adjust_out','transfer_in','transfer_out','return_in','return_out') NOT NULL,
  qty_delta DECIMAL(14,3) NOT NULL,
  unit_cost DECIMAL(14,4),
  ref_type VARCHAR(30),
  ref_id CHAR(36),
  notes TEXT,
  meta JSON,
  txn_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  KEY ix_st_base (tenant_id, item_id, location_id, txn_at),
  CONSTRAINT fk_st_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_st_item FOREIGN KEY (item_id) REFERENCES items(id),
  CONSTRAINT fk_st_loc FOREIGN KEY (location_id) REFERENCES stock_locations(id)
) ENGINE=InnoDB;

CREATE VIEW v_inventory_onhand AS
SELECT tenant_id, item_id, location_id, SUM(qty_delta) AS onhand_qty
FROM stock_txns
GROUP BY tenant_id, item_id, location_id;

CREATE TABLE purchases (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  supplier_name VARCHAR(160),
  supplier_invoice_no VARCHAR(60),
  purchased_on DATE NOT NULL,
  notes TEXT,
  meta JSON,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_pur_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB;

CREATE TABLE purchase_lines (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  purchase_id CHAR(36) NOT NULL,
  item_id CHAR(36) NOT NULL,
  qty DECIMAL(14,3) NOT NULL,
  unit_cost DECIMAL(14,4) NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  KEY ix_pl_purchase (tenant_id, purchase_id),
  CONSTRAINT fk_pl_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_pl_purchase FOREIGN KEY (purchase_id) REFERENCES purchases(id),
  CONSTRAINT fk_pl_item FOREIGN KEY (item_id) REFERENCES items(id)
) ENGINE=InnoDB;


-- 5.8 Messaging
CREATE TABLE message_templates (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  channel ENUM('whatsapp','sms','email') NOT NULL,
  code VARCHAR(60) NOT NULL,
  name VARCHAR(120),
  language VARCHAR(10) NOT NULL DEFAULT 'en',
  content_template TEXT NOT NULL,
  variables JSON,
  external_template_id VARCHAR(120),
  header_type ENUM('none','text','image','document') NOT NULL DEFAULT 'none',
  footer_text VARCHAR(60),
  is_approved TINYINT(1) NOT NULL DEFAULT 1,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  meta JSON,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  UNIQUE KEY uq_tpl_code (tenant_id, code),
  CONSTRAINT fk_tpl_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB;

CREATE TABLE message_rules (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  event ENUM('order.created','order.status_changed','invoice.issued','payment.due','payment.received','low_stock','birthday') NOT NULL,
  channel ENUM('whatsapp','sms','email') NOT NULL,
  template_id CHAR(36) NOT NULL,
  send_delay_seconds INT NOT NULL DEFAULT 0,
  quiet_hours JSON,
  is_enabled TINYINT(1) NOT NULL DEFAULT 1,
  priority INT NOT NULL DEFAULT 1,
  segment_filter JSON,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  UNIQUE KEY uq_rule (tenant_id, event, channel, priority),
  CONSTRAINT fk_rule_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_rule_template FOREIGN KEY (template_id) REFERENCES message_templates(id)
) ENGINE=InnoDB;

CREATE TABLE messages (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  direction ENUM('outbound','inbound') NOT NULL,
  channel ENUM('whatsapp','sms','email') NOT NULL,
  thread_id CHAR(36),
  customer_id CHAR(36),
  to_address VARCHAR(180),
  from_address VARCHAR(180),
  template_code VARCHAR(60),
  subject VARCHAR(160),
  rendered_body TEXT,
  payload JSON,
  scheduled_at DATETIME(6),
  sent_at DATETIME(6),
  status ENUM('queued','scheduled','sent','delivered','failed','read') NOT NULL DEFAULT 'queued',
  provider VARCHAR(40),
  provider_message_id VARCHAR(120),
  error_code VARCHAR(60),
  error_message TEXT,
  cost_micros BIGINT,
  campaign_id CHAR(36),
  retry_count INT NOT NULL DEFAULT 0,
  next_retry_at DATETIME(6),
  attachments JSON,
  meta JSON,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  KEY ix_msg_customer (tenant_id, customer_id, created_at),
  KEY ix_msg_queue (tenant_id, status, scheduled_at),
  UNIQUE KEY uq_provider_msg (tenant_id, provider_message_id),
  CONSTRAINT fk_msg_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB;



-- 5.9 Files, Attachments, Audit
CREATE TABLE files (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  storage_key TEXT NOT NULL,
  original_name VARCHAR(180),
  mime_type VARCHAR(80),
  size_bytes INT,
  uploaded_by CHAR(36),
  checksum_sha256 CHAR(64),
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  KEY ix_files_tenant (tenant_id),
  CONSTRAINT fk_files_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB;

CREATE TABLE attachments (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  file_id CHAR(36) NOT NULL,
  entity_type VARCHAR(30) NOT NULL,
  entity_id CHAR(36) NOT NULL,
  caption VARCHAR(160),
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  KEY ix_att_entity (tenant_id, entity_type, entity_id),
  KEY ix_att_file (tenant_id, file_id),
  CONSTRAINT fk_att_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_att_file FOREIGN KEY (file_id) REFERENCES files(id)
) ENGINE=InnoDB;

CREATE TABLE audit_logs (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  entity_type VARCHAR(30) NOT NULL,
  entity_id CHAR(36) NOT NULL,
  action ENUM('create','update','delete') NOT NULL,
  changed_by CHAR(36),
  changed_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  diff JSON,
  KEY ix_audit (tenant_id, entity_type, entity_id, changed_at),
  CONSTRAINT fk_audit_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB;


-- 5.10 API Keys, Webhooks, Saved Views, MVs
CREATE TABLE api_keys (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  name VARCHAR(80) NOT NULL,
  token_hash VARCHAR(128) NOT NULL,
  scopes JSON,
  created_by CHAR(36),
  expires_at DATETIME(6),
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  UNIQUE KEY uq_api_key (tenant_id, name),
  CONSTRAINT fk_apik_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB;

CREATE TABLE webhooks (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  url TEXT NOT NULL,
  secret VARCHAR(64) NOT NULL,
  event_types JSON NOT NULL,
  is_enabled TINYINT(1) NOT NULL DEFAULT 1,
  fail_count INT NOT NULL DEFAULT 0,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_wh_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB;

CREATE TABLE webhook_deliveries (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  webhook_id CHAR(36) NOT NULL,
  event_type VARCHAR(40) NOT NULL,
  payload JSON NOT NULL,
  status ENUM('queued','sent','failed') NOT NULL DEFAULT 'queued',
  response_code INT,
  response_body TEXT,
  attempted_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  KEY ix_wd_wh (tenant_id, webhook_id, attempted_at),
  CONSTRAINT fk_wd_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_wd_webhook FOREIGN KEY (webhook_id) REFERENCES webhooks(id)
) ENGINE=InnoDB;

CREATE TABLE saved_views (
  id CHAR(36) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  entity_type VARCHAR(30) NOT NULL,
  title VARCHAR(100) NOT NULL,
  filters JSON NOT NULL,
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  UNIQUE KEY uq_sv (tenant_id, user_id, entity_type, title),
  CONSTRAINT fk_sv_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB;

-- Materialized tables (refreshed via Celery jobs)
CREATE TABLE mv_kpis_daily (
  tenant_id CHAR(36) NOT NULL,
  day DATE NOT NULL,
  orders_count INT NOT NULL DEFAULT 0,
  revenue DECIMAL(14,2) NOT NULL DEFAULT 0,
  collections DECIMAL(14,2) NOT NULL DEFAULT 0,
  new_customers INT NOT NULL DEFAULT 0,
  amount_due DECIMAL(14,2) NOT NULL DEFAULT 0,
  avg_order_value DECIMAL(14,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (tenant_id, day)
) ENGINE=InnoDB;

CREATE TABLE mv_sales_by_item_daily (
  tenant_id CHAR(36) NOT NULL,
  day DATE NOT NULL,
  item_id CHAR(36) NOT NULL,
  qty_sold DECIMAL(14,3) NOT NULL DEFAULT 0,
  net_sales DECIMAL(14,2) NOT NULL DEFAULT 0,
  tax_collected DECIMAL(14,2) NOT NULL DEFAULT 0,
  returns DECIMAL(14,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (tenant_id, day, item_id)
) ENGINE=InnoDB;

CREATE TABLE mv_collections_aging (
  tenant_id CHAR(36) NOT NULL,
  as_of_date DATE NOT NULL,
  bucket_0_7 DECIMAL(14,2) NOT NULL DEFAULT 0,
  bucket_8_30 DECIMAL(14,2) NOT NULL DEFAULT 0,
  bucket_31_60 DECIMAL(14,2) NOT NULL DEFAULT 0,
  bucket_61_90 DECIMAL(14,2) NOT NULL DEFAULT 0,
  bucket_90_plus DECIMAL(14,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (tenant_id, as_of_date)
) ENGINE=InnoDB;

CREATE TABLE mv_customer_kpis (
  tenant_id CHAR(36) NOT NULL,
  customer_id CHAR(36) NOT NULL,
  first_order_at DATE,
  last_order_at DATE,
  orders_count INT NOT NULL DEFAULT 0,
  ltv DECIMAL(14,2) NOT NULL DEFAULT 0,
  avg_order_value DECIMAL(14,2) NOT NULL DEFAULT 0,
  amount_due DECIMAL(14,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (tenant_id, customer_id)
) ENGINE=InnoDB;

CREATE TABLE mv_staff_perf_daily (
  tenant_id CHAR(36) NOT NULL,
  day DATE NOT NULL,
  staff_id CHAR(36) NOT NULL,
  orders_worked INT NOT NULL DEFAULT 0,
  sales_value DECIMAL(14,2) NOT NULL DEFAULT 0,
  commission_est DECIMAL(14,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (tenant_id, day, staff_id)
) ENGINE=InnoDB;

CREATE TABLE mv_low_stock (
  tenant_id CHAR(36) NOT NULL,
  item_id CHAR(36) NOT NULL,
  onhand_qty DECIMAL(14,3) NOT NULL DEFAULT 0,
  threshold_qty DECIMAL(14,3) NOT NULL DEFAULT 0,
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (tenant_id, item_id)
) ENGINE=InnoDB;