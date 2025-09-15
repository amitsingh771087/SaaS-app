# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models



class Tenant(models.Model):
    tenant_id = models.CharField(primary_key=True, max_length=36)
    tenant_name = models.CharField(max_length=255)
    # add other fields
    class Meta:
        db_table = 'tenants'
        




class ApiKeys(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    name = models.CharField(max_length=80)
    token_hash = models.CharField(max_length=128)
    scopes = models.JSONField(blank=True, null=True)
    created_by = models.CharField(max_length=36, blank=True, null=True)
    expires_at = models.DateTimeField(blank=True, null=True)
    is_active = models.IntegerField()
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'api_keys'
        unique_together = (('tenant', 'name'),)


class Attachments(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    file = models.ForeignKey('Files', models.DO_NOTHING)
    entity_type = models.CharField(max_length=30)
    entity_id = models.CharField(max_length=36)
    caption = models.CharField(max_length=160, blank=True, null=True)
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'attachments'


class AuditLogs(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    entity_type = models.CharField(max_length=30)
    entity_id = models.CharField(max_length=36)
    action = models.CharField(max_length=6)
    changed_by = models.CharField(max_length=36, blank=True, null=True)
    changed_at = models.DateTimeField()
    diff = models.JSONField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'audit_logs'


class CustomerContacts(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    customer = models.ForeignKey('Customers', models.DO_NOTHING)
    label = models.CharField(max_length=40, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.CharField(max_length=160, blank=True, null=True)
    is_primary = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'customer_contacts'


class CustomerTimeline(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    customer = models.ForeignKey('Customers', models.DO_NOTHING)
    event_type = models.CharField(max_length=40)
    data = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField()
    created_by = models.CharField(max_length=36, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'customer_timeline'


class Customers(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', on_delete=models.CASCADE)
    display_name = models.CharField(max_length=120)
    first_name = models.CharField(max_length=80, blank=True, null=True)
    last_name = models.CharField(max_length=80, blank=True, null=True)
    primary_phone = models.CharField(max_length=20, blank=True, null=True)
    primary_email = models.CharField(max_length=160, blank=True, null=True)
    whatsapp_opt_in = models.IntegerField()
    tags = models.JSONField(blank=True, null=True)
    gstin = models.CharField(max_length=15, blank=True, null=True)
    billing_address = models.JSONField(blank=True, null=True)
    shipping_address = models.JSONField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    source = models.CharField(max_length=40, blank=True, null=True)
    status = models.CharField(max_length=11)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'customers'


class Files(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    storage_key = models.TextField()
    original_name = models.CharField(max_length=180, blank=True, null=True)
    mime_type = models.CharField(max_length=80, blank=True, null=True)
    size_bytes = models.IntegerField(blank=True, null=True)
    uploaded_by = models.CharField(max_length=36, blank=True, null=True)
    checksum_sha256 = models.CharField(max_length=64, blank=True, null=True)
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'files'


class InvoiceLineItems(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    invoice = models.ForeignKey('Invoices', models.DO_NOTHING)
    sku = models.CharField(max_length=60, blank=True, null=True)
    name = models.CharField(max_length=160)
    description = models.TextField(blank=True, null=True)
    unit = models.CharField(max_length=20, blank=True, null=True)
    qty = models.DecimalField(max_digits=14, decimal_places=3)
    price = models.DecimalField(max_digits=14, decimal_places=2)
    discount = models.DecimalField(max_digits=14, decimal_places=2)
    tax_rate_percent = models.DecimalField(max_digits=5, decimal_places=2)
    tax_components = models.JSONField(blank=True, null=True)
    is_tax_inclusive = models.IntegerField()
    line_subtotal = models.DecimalField(max_digits=14, decimal_places=2)
    line_tax = models.DecimalField(max_digits=14, decimal_places=2)
    line_total = models.DecimalField(max_digits=14, decimal_places=2)
    hsn_sac = models.CharField(max_length=10, blank=True, null=True)
    meta = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'invoice_line_items'


class Invoices(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    invoice_number = models.CharField(max_length=30)
    order_id = models.CharField(max_length=36, blank=True, null=True)
    customer = models.ForeignKey(Customers, models.DO_NOTHING)
    status = models.CharField(max_length=9)
    issue_date = models.DateField()
    due_date = models.DateField(blank=True, null=True)
    currency = models.CharField(max_length=3)
    subtotal = models.DecimalField(max_digits=14, decimal_places=2)
    discount_total = models.DecimalField(max_digits=14, decimal_places=2)
    tax_total = models.DecimalField(max_digits=14, decimal_places=2)
    grand_total = models.DecimalField(max_digits=14, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=14, decimal_places=2)
    amount_due = models.DecimalField(max_digits=14, decimal_places=2, blank=True, null=True)
    tax_inclusive = models.IntegerField()
    place_of_supply = models.CharField(max_length=2, blank=True, null=True)
    billing_address_snapshot = models.JSONField(blank=True, null=True)
    invoice_notes = models.TextField(blank=True, null=True)
    terms = models.TextField(blank=True, null=True)
    meta = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'invoices'
        unique_together = (('tenant', 'invoice_number'),)


class ItemCategories(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    name = models.CharField(max_length=80)
    parent = models.ForeignKey('self', models.DO_NOTHING, blank=True, null=True)
    slug = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'item_categories'
        unique_together = (('tenant', 'slug'),)


class ItemMedia(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    item_id = models.CharField(max_length=36)
    file_id = models.CharField(max_length=36)
    caption = models.CharField(max_length=140, blank=True, null=True)
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'item_media'


class ItemPrices(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    item = models.ForeignKey('Items', models.DO_NOTHING)
    price_list = models.CharField(max_length=40)
    sell_price = models.DecimalField(max_digits=14, decimal_places=2)
    currency = models.CharField(max_length=3)
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'item_prices'
        unique_together = (('tenant', 'item', 'price_list'),)


class Items(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    sku = models.CharField(max_length=60, blank=True, null=True)
    barcode = models.CharField(max_length=64, blank=True, null=True)
    name = models.CharField(max_length=160)
    type = models.CharField(max_length=7)
    category = models.ForeignKey(ItemCategories, models.DO_NOTHING, blank=True, null=True)
    unit = models.CharField(max_length=20, blank=True, null=True)
    sell_price = models.DecimalField(max_digits=14, decimal_places=2)
    cost_price = models.DecimalField(max_digits=14, decimal_places=2, blank=True, null=True)
    tax_rate_percent = models.DecimalField(max_digits=5, decimal_places=2)
    hsn_sac = models.CharField(max_length=10, blank=True, null=True)
    is_active = models.IntegerField()
    meta = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'items'
        unique_together = (('tenant', 'sku'),)


class MessageRules(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    event = models.CharField(max_length=20)
    channel = models.CharField(max_length=8)
    template = models.ForeignKey('MessageTemplates', models.DO_NOTHING)
    send_delay_seconds = models.IntegerField()
    quiet_hours = models.JSONField(blank=True, null=True)
    is_enabled = models.IntegerField()
    priority = models.IntegerField()
    segment_filter = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'message_rules'
        unique_together = (('tenant', 'event', 'channel', 'priority'),)


class MessageTemplates(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    channel = models.CharField(max_length=8)
    code = models.CharField(max_length=60)
    name = models.CharField(max_length=120, blank=True, null=True)
    language = models.CharField(max_length=10)
    content_template = models.TextField()
    variables = models.JSONField(blank=True, null=True)
    external_template_id = models.CharField(max_length=120, blank=True, null=True)
    header_type = models.CharField(max_length=8)
    footer_text = models.CharField(max_length=60, blank=True, null=True)
    is_approved = models.IntegerField()
    is_active = models.IntegerField()
    meta = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'message_templates'
        unique_together = (('tenant', 'code'),)


class Messages(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    direction = models.CharField(max_length=8)
    channel = models.CharField(max_length=8)
    thread_id = models.CharField(max_length=36, blank=True, null=True)
    customer_id = models.CharField(max_length=36, blank=True, null=True)
    to_address = models.CharField(max_length=180, blank=True, null=True)
    from_address = models.CharField(max_length=180, blank=True, null=True)
    template_code = models.CharField(max_length=60, blank=True, null=True)
    subject = models.CharField(max_length=160, blank=True, null=True)
    rendered_body = models.TextField(blank=True, null=True)
    payload = models.JSONField(blank=True, null=True)
    scheduled_at = models.DateTimeField(blank=True, null=True)
    sent_at = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=9)
    provider = models.CharField(max_length=40, blank=True, null=True)
    provider_message_id = models.CharField(max_length=120, blank=True, null=True)
    error_code = models.CharField(max_length=60, blank=True, null=True)
    error_message = models.TextField(blank=True, null=True)
    cost_micros = models.BigIntegerField(blank=True, null=True)
    campaign_id = models.CharField(max_length=36, blank=True, null=True)
    retry_count = models.IntegerField()
    next_retry_at = models.DateTimeField(blank=True, null=True)
    attachments = models.JSONField(blank=True, null=True)
    meta = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'messages'
        unique_together = (('tenant', 'provider_message_id'),)


class MvCollectionsAging(models.Model):
    tenant_id = models.CharField(primary_key=True, max_length=36)  # The composite primary key (tenant_id, as_of_date) found, that is not supported. The first column is selected.
    as_of_date = models.DateField()
    bucket_0_7 = models.DecimalField(max_digits=14, decimal_places=2)
    bucket_8_30 = models.DecimalField(max_digits=14, decimal_places=2)
    bucket_31_60 = models.DecimalField(max_digits=14, decimal_places=2)
    bucket_61_90 = models.DecimalField(max_digits=14, decimal_places=2)
    bucket_90_plus = models.DecimalField(max_digits=14, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'mv_collections_aging'
        unique_together = (('tenant_id', 'as_of_date'),)


class MvCustomerKpis(models.Model):
    tenant_id = models.CharField(primary_key=True, max_length=36)  # The composite primary key (tenant_id, customer_id) found, that is not supported. The first column is selected.
    customer_id = models.CharField(max_length=36)
    first_order_at = models.DateField(blank=True, null=True)
    last_order_at = models.DateField(blank=True, null=True)
    orders_count = models.IntegerField()
    ltv = models.DecimalField(max_digits=14, decimal_places=2)
    avg_order_value = models.DecimalField(max_digits=14, decimal_places=2)
    amount_due = models.DecimalField(max_digits=14, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'mv_customer_kpis'
        unique_together = (('tenant_id', 'customer_id'),)


class MvKpisDaily(models.Model):
    tenant_id = models.CharField(primary_key=True, max_length=36)  # The composite primary key (tenant_id, day) found, that is not supported. The first column is selected.
    day = models.DateField()
    orders_count = models.IntegerField()
    revenue = models.DecimalField(max_digits=14, decimal_places=2)
    collections = models.DecimalField(max_digits=14, decimal_places=2)
    new_customers = models.IntegerField()
    amount_due = models.DecimalField(max_digits=14, decimal_places=2)
    avg_order_value = models.DecimalField(max_digits=14, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'mv_kpis_daily'
        unique_together = (('tenant_id', 'day'),)


class MvLowStock(models.Model):
    tenant_id = models.CharField(primary_key=True, max_length=36)  # The composite primary key (tenant_id, item_id) found, that is not supported. The first column is selected.
    item_id = models.CharField(max_length=36)
    onhand_qty = models.DecimalField(max_digits=14, decimal_places=3)
    threshold_qty = models.DecimalField(max_digits=14, decimal_places=3)
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'mv_low_stock'
        unique_together = (('tenant_id', 'item_id'),)


class MvSalesByItemDaily(models.Model):
    tenant_id = models.CharField(primary_key=True, max_length=36)  # The composite primary key (tenant_id, day, item_id) found, that is not supported. The first column is selected.
    day = models.DateField()
    item_id = models.CharField(max_length=36)
    qty_sold = models.DecimalField(max_digits=14, decimal_places=3)
    net_sales = models.DecimalField(max_digits=14, decimal_places=2)
    tax_collected = models.DecimalField(max_digits=14, decimal_places=2)
    returns = models.DecimalField(max_digits=14, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'mv_sales_by_item_daily'
        unique_together = (('tenant_id', 'day', 'item_id'),)


class MvStaffPerfDaily(models.Model):
    tenant_id = models.CharField(primary_key=True, max_length=36)  # The composite primary key (tenant_id, day, staff_id) found, that is not supported. The first column is selected.
    day = models.DateField()
    staff_id = models.CharField(max_length=36)
    orders_worked = models.IntegerField()
    sales_value = models.DecimalField(max_digits=14, decimal_places=2)
    commission_est = models.DecimalField(max_digits=14, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'mv_staff_perf_daily'
        unique_together = (('tenant_id', 'day', 'staff_id'),)


class NumberingSequences(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    seq_key = models.CharField(max_length=30)
    prefix = models.CharField(max_length=10, blank=True, null=True)
    next_int = models.IntegerField()
    padding = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'numbering_sequences'
        unique_together = (('tenant', 'seq_key'),)


class OrderLineItems(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    order = models.ForeignKey('Orders', models.DO_NOTHING)
    item_id = models.CharField(max_length=36, blank=True, null=True)
    sku = models.CharField(max_length=60, blank=True, null=True)
    name = models.CharField(max_length=160)
    description = models.TextField(blank=True, null=True)
    unit = models.CharField(max_length=20, blank=True, null=True)
    qty = models.DecimalField(max_digits=14, decimal_places=3)
    price = models.DecimalField(max_digits=14, decimal_places=2)
    discount = models.DecimalField(max_digits=14, decimal_places=2)
    tax_rate_percent = models.DecimalField(max_digits=5, decimal_places=2)
    tax_components = models.JSONField(blank=True, null=True)
    is_tax_inclusive = models.IntegerField()
    line_subtotal = models.DecimalField(max_digits=14, decimal_places=2)
    line_tax = models.DecimalField(max_digits=14, decimal_places=2)
    line_total = models.DecimalField(max_digits=14, decimal_places=2)
    hsn_sac = models.CharField(max_length=10, blank=True, null=True)
    staff_id = models.CharField(max_length=36, blank=True, null=True)
    meta = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'order_line_items'


class Orders(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    order_number = models.CharField(max_length=30)
    customer = models.ForeignKey(Customers, models.DO_NOTHING)
    status = models.CharField(max_length=11)
    order_type = models.CharField(max_length=30, blank=True, null=True)
    scheduled_date = models.DateField(blank=True, null=True)
    scheduled_start = models.DateTimeField(blank=True, null=True)
    scheduled_end = models.DateTimeField(blank=True, null=True)
    assigned_to = models.CharField(max_length=36, blank=True, null=True)
    currency = models.CharField(max_length=3)
    subtotal = models.DecimalField(max_digits=14, decimal_places=2)
    discount_total = models.DecimalField(max_digits=14, decimal_places=2)
    tax_total = models.DecimalField(max_digits=14, decimal_places=2)
    grand_total = models.DecimalField(max_digits=14, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=14, decimal_places=2)
    amount_due = models.DecimalField(max_digits=14, decimal_places=2)
    discount_type = models.CharField(max_length=7, blank=True, null=True)
    discount_value = models.DecimalField(max_digits=14, decimal_places=2, blank=True, null=True)
    tax_inclusive = models.IntegerField()
    place_of_supply = models.CharField(max_length=2, blank=True, null=True)
    meta = models.JSONField(blank=True, null=True)
    notes_internal = models.TextField(blank=True, null=True)
    notes_customer = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'orders'
        unique_together = (('tenant', 'order_number'),)


class PaymentAllocations(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    payment = models.ForeignKey('Payments', models.DO_NOTHING)
    invoice = models.ForeignKey(Invoices, models.DO_NOTHING)
    allocated_amount = models.DecimalField(max_digits=14, decimal_places=2)
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'payment_allocations'


class Payments(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    customer = models.ForeignKey(Customers, models.DO_NOTHING)
    received_on = models.DateField()
    method = models.CharField(max_length=13)
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    currency = models.CharField(max_length=3)
    reference = models.TextField(blank=True, null=True)
    gateway = models.CharField(max_length=30, blank=True, null=True)
    gateway_payment_id = models.CharField(max_length=80, blank=True, null=True)
    status = models.CharField(max_length=13)
    notes = models.TextField(blank=True, null=True)
    meta = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'payments'
        unique_together = (('tenant', 'gateway_payment_id'),)


class PurchaseLines(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    purchase = models.ForeignKey('Purchases', models.DO_NOTHING)
    item = models.ForeignKey(Items, models.DO_NOTHING)
    qty = models.DecimalField(max_digits=14, decimal_places=3)
    unit_cost = models.DecimalField(max_digits=14, decimal_places=4)
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'purchase_lines'


class Purchases(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    supplier_name = models.CharField(max_length=160, blank=True, null=True)
    supplier_invoice_no = models.CharField(max_length=60, blank=True, null=True)
    purchased_on = models.DateField()
    notes = models.TextField(blank=True, null=True)
    meta = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'purchases'


class SavedViews(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    user_id = models.CharField(max_length=36)
    entity_type = models.CharField(max_length=30)
    title = models.CharField(max_length=100)
    filters = models.JSONField()
    is_default = models.IntegerField()
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'saved_views'
        unique_together = (('tenant', 'user_id', 'entity_type', 'title'),)


class StockLocations(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    name = models.CharField(max_length=80)
    type = models.CharField(max_length=9)
    address = models.JSONField(blank=True, null=True)
    is_default = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'stock_locations'
        unique_together = (('tenant', 'name'),)


class StockTxns(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey('Tenants', models.DO_NOTHING)
    item = models.ForeignKey(Items, models.DO_NOTHING)
    location = models.ForeignKey(StockLocations, models.DO_NOTHING)
    txn_type = models.CharField(max_length=12)
    qty_delta = models.DecimalField(max_digits=14, decimal_places=3)
    unit_cost = models.DecimalField(max_digits=14, decimal_places=4, blank=True, null=True)
    ref_type = models.CharField(max_length=30, blank=True, null=True)
    ref_id = models.CharField(max_length=36, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    meta = models.JSONField(blank=True, null=True)
    txn_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'stock_txns'


class TenantUser(models.Model):  # Rename from TenantUsers
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    user = models.ForeignKey('Users', on_delete=models.CASCADE)
    role = models.CharField(max_length=50)
    is_active = models.IntegerField()
    invited_by = models.CharField(max_length=36, blank=True, null=True)
    invite_token = models.CharField(max_length=64, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'tenant_users'
        unique_together = (('tenant', 'user'),)



class Tenants(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    slug = models.CharField(unique=True, max_length=60)
    display_name = models.CharField(max_length=120)
    legal_name = models.CharField(max_length=200, blank=True, null=True)
    currency = models.CharField(max_length=3)
    timezone = models.CharField(max_length=50)
    gst_enabled = models.IntegerField()
    gstin = models.CharField(max_length=15, blank=True, null=True)
    address = models.JSONField(blank=True, null=True)
    branding = models.JSONField(blank=True, null=True)
    locale = models.JSONField(blank=True, null=True)
    invoice_settings = models.JSONField(blank=True, null=True)
    payment_settings = models.JSONField(blank=True, null=True)
    comm_settings = models.JSONField(blank=True, null=True)
    features = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'tenants'


class Users(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    email = models.CharField(unique=True, max_length=160, blank=True, null=True)
    phone = models.CharField(unique=True, max_length=20, blank=True, null=True)
    password_hash = models.TextField(blank=True, null=True)
    full_name = models.CharField(max_length=120, blank=True, null=True)
    status = models.CharField(max_length=8)
    last_login = models.DateTimeField(blank=True, null=True)
    locale = models.CharField(max_length=10)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'users'


class WebhookDeliveries(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey(Tenants, models.DO_NOTHING)
    webhook = models.ForeignKey('Webhooks', models.DO_NOTHING)
    event_type = models.CharField(max_length=40)
    payload = models.JSONField()
    status = models.CharField(max_length=6)
    response_code = models.IntegerField(blank=True, null=True)
    response_body = models.TextField(blank=True, null=True)
    attempted_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'webhook_deliveries'


class Webhooks(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    tenant = models.ForeignKey(Tenants, models.DO_NOTHING)
    url = models.TextField()
    secret = models.CharField(max_length=64)
    event_types = models.JSONField()
    is_enabled = models.IntegerField()
    fail_count = models.IntegerField()
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'webhooks'
