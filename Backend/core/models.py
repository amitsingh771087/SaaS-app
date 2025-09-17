
from django.db import models


import uuid

def generate_uuid():
    return str(uuid.uuid4())


# --- Core Tenancy Models ---
# The Tenant model is the root of the tenancy hierarchy and should not inherit from TenantScopedModel.
class Tenants(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    slug = models.CharField(unique=True, max_length=60)
    display_name = models.CharField(max_length=120)
    legal_name = models.CharField(max_length=200, blank=True, null=True)
    currency = models.CharField(max_length=3, default='INR')
    timezone = models.CharField(max_length=50, default='Asia/Kolkata')
    gst_enabled = models.BooleanField(default=True)
    gstin = models.CharField(max_length=15, blank=True, null=True)
    address = models.JSONField(blank=True, null=True)
    branding = models.JSONField(blank=True, null=True)
    locale = models.JSONField(blank=True, null=True)
    invoice_settings = models.JSONField(blank=True, null=True)
    payment_settings = models.JSONField(blank=True, null=True)
    comm_settings = models.JSONField(blank=True, null=True)
    features = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tenants'

# The User model is also a core model and should not be tenant-scoped by default.
class Users(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    email = models.CharField(unique=True, max_length=160, blank=True, null=True)
    phone = models.CharField(unique=True, max_length=20, blank=True, null=True)
    password_hash = models.TextField(blank=True, null=True)
    full_name = models.CharField(max_length=120, blank=True, null=True)
    status = models.CharField(max_length=8, choices=[('active', 'Active'), ('invited', 'Invited'), ('disabled', 'Disabled')], default='active')
    last_login = models.DateTimeField(blank=True, null=True)
    locale = models.CharField(max_length=10, default='en')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'


# --- Tenancy Scoping (Corrected) ---
# The base model for all tenant-scoped data. It should inherit from models.Model.
class TenantScopedManager(models.Manager):
    def for_tenant(self, tenant):
        return self.filter(tenant=tenant)

class TenantScopedModel(models.Model):
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    objects = TenantScopedManager()

    class Meta:
        abstract = True

# All models that belong to a specific tenant must inherit from TenantScopedModel.
class TenantUsers(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=[('owner', 'Owner'), ('manager', 'Manager'), ('staff', 'Staff'), ('accountant', 'Accountant'), ('viewer', 'Viewer')], default='staff')
    is_active = models.BooleanField(default=True)
    invited_by = models.CharField(max_length=36, blank=True, null=True)
    invite_token = models.CharField(max_length=64, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tenant_users'
        unique_together = (('tenant', 'user'),)

# The rest of your models are correct and can be placed here.
# I've included the Customers model as an example of correct inheritance.

# --- Customer Models ---
class Customers(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    display_name = models.CharField(max_length=120)
    first_name = models.CharField(max_length=80, blank=True, null=True)
    last_name = models.CharField(max_length=80, blank=True, null=True)
    primary_phone = models.CharField(max_length=20, blank=True, null=True)
    primary_email = models.CharField(max_length=160, blank=True, null=True)
    whatsapp_opt_in = models.BooleanField(default=True)
    tags = models.JSONField(blank=True, null=True)
    gstin = models.CharField(max_length=15, blank=True, null=True)
    billing_address = models.JSONField(blank=True, null=True)
    shipping_address = models.JSONField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    source = models.CharField(max_length=40, blank=True, null=True)
    status = models.CharField(max_length=11, choices=[('active', 'Active'), ('inactive', 'Inactive'), ('blacklisted', 'Blacklisted')], default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'customers'
        
class NumberingSequences(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    seq_key = models.CharField(max_length=30)
    prefix = models.CharField(max_length=10, blank=True, null=True)
    next_int = models.IntegerField(default=1001)
    padding = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'numbering_sequences'
        unique_together = (('tenant', 'seq_key'),)


class CustomerContacts(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customers, on_delete=models.CASCADE)
    label = models.CharField(max_length=40, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.CharField(max_length=160, blank=True, null=True)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'customer_contacts'

class CustomerTimeline(TenantScopedModel):
    
    EVENT_TYPES = [
        ("note", "Note"),
        ("call", "Call"),
        ("meeting", "Meeting"),
        ("email", "Email"),
        ("status_update", "Status Update"),
    ]
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customers, on_delete=models.CASCADE)
    event_type = models.CharField(max_length=40 ,choices=EVENT_TYPES )
    data = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=36, blank=True, null=True)

    class Meta:
        db_table = 'customer_timeline'


# Catalog Models
class ItemCategories(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    name = models.CharField(max_length=80)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, blank=True, null=True)
    slug = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'item_categories'
        unique_together = (('tenant', 'slug'),)

class Items(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    sku = models.CharField(max_length=60, blank=True, null=True)
    barcode = models.CharField(max_length=64, blank=True, null=True)
    name = models.CharField(max_length=160)
    type = models.CharField(max_length=7, choices=[('service', 'Service'), ('product', 'Product')])
    category = models.ForeignKey(ItemCategories, on_delete=models.SET_NULL, blank=True, null=True)
    unit = models.CharField(max_length=20, blank=True, null=True)
    sell_price = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    cost_price = models.DecimalField(max_digits=14, decimal_places=2, blank=True, null=True)
    tax_rate_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    hsn_sac = models.CharField(max_length=10, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    meta = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'items'
        unique_together = (('tenant', 'sku'),)

class ItemPrices(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    item = models.ForeignKey(Items, on_delete=models.CASCADE)
    price_list = models.CharField(max_length=40)
    sell_price = models.DecimalField(max_digits=14, decimal_places=2)
    currency = models.CharField(max_length=3, default='INR')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'item_prices'
        unique_together = (('tenant', 'item', 'price_list'),)

class ItemMedia(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    item_id = models.CharField(max_length=36)
    file_id = models.CharField(max_length=36)
    caption = models.CharField(max_length=140, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'item_media'


# Orders & Invoices Models (with proper foreign keys)
class Orders(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    order_number = models.CharField(max_length=30)
    customer = models.ForeignKey(Customers, on_delete=models.DO_NOTHING)
    status = models.CharField(max_length=11, choices=[('draft', 'Draft'), ('pending', 'Pending'), ('in_progress', 'In Progress'), ('completed', 'Completed'), ('delivered', 'Delivered'), ('cancelled', 'Cancelled')], default='pending')
    order_type = models.CharField(max_length=30, blank=True, null=True)
    scheduled_date = models.DateField(blank=True, null=True)
    scheduled_start = models.DateTimeField(blank=True, null=True)
    scheduled_end = models.DateTimeField(blank=True, null=True)
    assigned_to = models.CharField(max_length=36, blank=True, null=True)
    currency = models.CharField(max_length=3, default='INR')
    subtotal = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    discount_total = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    tax_total = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    grand_total = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    amount_paid = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    amount_due = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    discount_type = models.CharField(max_length=7, choices=[('percent', 'Percent'), ('flat', 'Flat')], blank=True, null=True)
    discount_value = models.DecimalField(max_digits=14, decimal_places=2, blank=True, null=True)
    tax_inclusive = models.BooleanField(default=False)
    place_of_supply = models.CharField(max_length=2, blank=True, null=True)
    meta = models.JSONField(blank=True, null=True)
    notes_internal = models.TextField(blank=True, null=True)
    notes_customer = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'orders'
        unique_together = (('tenant', 'order_number'),)

class OrderLineItems(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    order = models.ForeignKey(Orders, on_delete=models.CASCADE)
    item_id = models.CharField(max_length=36, blank=True, null=True)
    sku = models.CharField(max_length=60, blank=True, null=True)
    name = models.CharField(max_length=160)
    description = models.TextField(blank=True, null=True)
    unit = models.CharField(max_length=20, blank=True, null=True)
    qty = models.DecimalField(max_digits=14, decimal_places=3)
    price = models.DecimalField(max_digits=14, decimal_places=2)
    discount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    tax_rate_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    tax_components = models.JSONField(blank=True, null=True)
    is_tax_inclusive = models.BooleanField(default=False)
    line_subtotal = models.DecimalField(max_digits=14, decimal_places=2)
    line_tax = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    line_total = models.DecimalField(max_digits=14, decimal_places=2)
    hsn_sac = models.CharField(max_length=10, blank=True, null=True)
    staff_id = models.CharField(max_length=36, blank=True, null=True)
    meta = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'order_line_items'


class Invoices(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    invoice_number = models.CharField(max_length=30)
    order_id = models.CharField(max_length=36, blank=True, null=True)
    customer = models.ForeignKey(Customers, on_delete=models.DO_NOTHING)
    status = models.CharField(max_length=9, choices=[('draft', 'Draft'), ('issued', 'Issued'), ('paid', 'Paid'), ('part_paid', 'Part Paid'), ('void', 'Void')], default='draft')
    issue_date = models.DateField()
    due_date = models.DateField(blank=True, null=True)
    currency = models.CharField(max_length=3, default='INR')
    subtotal = models.DecimalField(max_digits=14, decimal_places=2)
    discount_total = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    tax_total = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    grand_total = models.DecimalField(max_digits=14, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    amount_due = models.DecimalField(max_digits=14, decimal_places=2)
    tax_inclusive = models.BooleanField(default=False)
    place_of_supply = models.CharField(max_length=2, blank=True, null=True)
    billing_address_snapshot = models.JSONField(blank=True, null=True)
    invoice_notes = models.TextField(blank=True, null=True)
    terms = models.TextField(blank=True, null=True)
    meta = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'invoices'
        unique_together = (('tenant', 'invoice_number'),)

class InvoiceLineItems(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    invoice = models.ForeignKey(Invoices, on_delete=models.CASCADE)
    sku = models.CharField(max_length=60, blank=True, null=True)
    name = models.CharField(max_length=160)
    description = models.TextField(blank=True, null=True)
    unit = models.CharField(max_length=20, blank=True, null=True)
    qty = models.DecimalField(max_digits=14, decimal_places=3)
    price = models.DecimalField(max_digits=14, decimal_places=2)
    discount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    tax_rate_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    tax_components = models.JSONField(blank=True, null=True)
    is_tax_inclusive = models.BooleanField(default=False)
    line_subtotal = models.DecimalField(max_digits=14, decimal_places=2)
    line_tax = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    line_total = models.DecimalField(max_digits=14, decimal_places=2)
    hsn_sac = models.CharField(max_length=10, blank=True, null=True)
    meta = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'invoice_line_items'


# Payments Models
class Payments(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customers, on_delete=models.DO_NOTHING)
    received_on = models.DateField()
    method = models.CharField(max_length=13, choices=[('upi', 'UPI'), ('card', 'Card'), ('cash', 'Cash'), ('bank_transfer', 'Bank Transfer'), ('wallet', 'Wallet'), ('cheque', 'Cheque'), ('other', 'Other')])
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    currency = models.CharField(max_length=3, default='INR')
    reference = models.TextField(blank=True, null=True)
    gateway = models.CharField(max_length=30, blank=True, null=True)
    gateway_payment_id = models.CharField(max_length=80, blank=True, null=True)
    status = models.CharField(max_length=13, choices=[('captured', 'Captured'), ('pending', 'Pending'), ('failed', 'Failed'), ('refunded', 'Refunded'), ('part_refunded', 'Part Refunded')], default='captured')
    notes = models.TextField(blank=True, null=True)
    meta = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'payments'
        unique_together = (('tenant', 'gateway_payment_id'),)

class PaymentAllocations(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    payment = models.ForeignKey('Payments', on_delete=models.CASCADE)
    invoice = models.ForeignKey(Invoices, on_delete=models.CASCADE)
    allocated_amount = models.DecimalField(max_digits=14, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'payment_allocations'

# Inventory Models
class StockLocations(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    name = models.CharField(max_length=80)
    type = models.CharField(max_length=9, choices=[('store', 'Store'), ('warehouse', 'Warehouse'), ('vehicle', 'Vehicle'), ('room', 'Room'), ('cold', 'Cold')], default='store')
    address = models.JSONField(blank=True, null=True)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'stock_locations'
        unique_together = (('tenant', 'name'),)

class StockTxns(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    item = models.ForeignKey(Items, on_delete=models.CASCADE)
    location = models.ForeignKey(StockLocations, on_delete=models.CASCADE)
    txn_type = models.CharField(max_length=12, choices=[('purchase', 'Purchase'), ('sale', 'Sale'), ('consume', 'Consume'), ('adjust_in', 'Adjust In'), ('adjust_out', 'Adjust Out'), ('transfer_in', 'Transfer In'), ('transfer_out', 'Transfer Out'), ('return_in', 'Return In'), ('return_out', 'Return Out')])
    qty_delta = models.DecimalField(max_digits=14, decimal_places=3)
    unit_cost = models.DecimalField(max_digits=14, decimal_places=4, blank=True, null=True)
    ref_type = models.CharField(max_length=30, blank=True, null=True)
    ref_id = models.CharField(max_length=36, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    meta = models.JSONField(blank=True, null=True)
    txn_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'stock_txns'

class Purchases(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    supplier_name = models.CharField(max_length=160, blank=True, null=True)
    supplier_invoice_no = models.CharField(max_length=60, blank=True, null=True)
    purchased_on = models.DateField()
    notes = models.TextField(blank=True, null=True)
    meta = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'purchases'

class PurchaseLines(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    purchase = models.ForeignKey(Purchases, on_delete=models.CASCADE)
    item = models.ForeignKey(Items, on_delete=models.CASCADE)
    qty = models.DecimalField(max_digits=14, decimal_places=3)
    unit_cost = models.DecimalField(max_digits=14, decimal_places=4)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'purchase_lines'


# Messaging Models
class MessageTemplates(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    channel = models.CharField(max_length=8, choices=[('whatsapp', 'WhatsApp'), ('sms', 'SMS'), ('email', 'Email')])
    code = models.CharField(max_length=60)
    name = models.CharField(max_length=120, blank=True, null=True)
    language = models.CharField(max_length=10, default='en')
    content_template = models.TextField()
    variables = models.JSONField(blank=True, null=True)
    external_template_id = models.CharField(max_length=120, blank=True, null=True)
    header_type = models.CharField(max_length=8, choices=[('none', 'None'), ('text', 'Text'), ('image', 'Image'), ('document', 'Document')], default='none')
    footer_text = models.CharField(max_length=60, blank=True, null=True)
    is_approved = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    meta = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'message_templates'
        unique_together = (('tenant', 'code'),)

class MessageRules(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    event = models.CharField(max_length=20, choices=[('order.created', 'Order Created'), ('order.status_changed', 'Order Status Changed'), ('invoice.issued', 'Invoice Issued'), ('payment.due', 'Payment Due'), ('payment.received', 'Payment Received'), ('low_stock', 'Low Stock'), ('birthday', 'Birthday')])
    channel = models.CharField(max_length=8, choices=[('whatsapp', 'WhatsApp'), ('sms', 'SMS'), ('email', 'Email')])
    template = models.ForeignKey(MessageTemplates, on_delete=models.CASCADE)
    send_delay_seconds = models.IntegerField(default=0)
    quiet_hours = models.JSONField(blank=True, null=True)
    is_enabled = models.BooleanField(default=True)
    priority = models.IntegerField(default=1)
    segment_filter = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'message_rules'
        unique_together = (('tenant', 'event', 'channel', 'priority'),)

class Messages(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    direction = models.CharField(max_length=8, choices=[('outbound', 'Outbound'), ('inbound', 'Inbound')])
    channel = models.CharField(max_length=8, choices=[('whatsapp', 'WhatsApp'), ('sms', 'SMS'), ('email', 'Email')])
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
    status = models.CharField(max_length=9, choices=[('queued', 'Queued'), ('scheduled', 'Scheduled'), ('sent', 'Sent'), ('delivered', 'Delivered'), ('failed', 'Failed'), ('read', 'Read')], default='queued')
    provider = models.CharField(max_length=40, blank=True, null=True)
    provider_message_id = models.CharField(max_length=120, blank=True, null=True)
    error_code = models.CharField(max_length=60, blank=True, null=True)
    error_message = models.TextField(blank=True, null=True)
    cost_micros = models.BigIntegerField(blank=True, null=True)
    campaign_id = models.CharField(max_length=36, blank=True, null=True)
    retry_count = models.IntegerField(default=0)
    next_retry_at = models.DateTimeField(blank=True, null=True)
    attachments = models.JSONField(blank=True, null=True)
    meta = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'messages'
        unique_together = (('tenant', 'provider_message_id'),)


# Files, Attachments, Audit Models
class Files(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    storage_key = models.TextField()
    original_name = models.CharField(max_length=180, blank=True, null=True)
    mime_type = models.CharField(max_length=80, blank=True, null=True)
    size_bytes = models.IntegerField(blank=True, null=True)
    uploaded_by = models.CharField(max_length=36, blank=True, null=True)
    checksum_sha256 = models.CharField(max_length=64, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'files'

class Attachments(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    file = models.ForeignKey(Files, on_delete=models.CASCADE)
    entity_type = models.CharField(max_length=30)
    entity_id = models.CharField(max_length=36)
    caption = models.CharField(max_length=160, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'attachments'

class AuditLogs(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    entity_type = models.CharField(max_length=30)
    entity_id = models.CharField(max_length=36)
    action = models.CharField(max_length=6, choices=[('create', 'Create'), ('update', 'Update'), ('delete', 'Delete')])
    changed_by = models.CharField(max_length=36, blank=True, null=True)
    changed_at = models.DateTimeField(auto_now_add=True)
    diff = models.JSONField(blank=True, null=True)

    class Meta:
        db_table = 'audit_logs'


# API Keys, Webhooks, Saved Views
class ApiKeys(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    name = models.CharField(max_length=80)
    token_hash = models.CharField(max_length=128)
    scopes = models.JSONField(blank=True, null=True)
    created_by = models.CharField(max_length=36, blank=True, null=True)
    expires_at = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'api_keys'
        unique_together = (('tenant', 'name'),)

class Webhooks(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    url = models.TextField()
    secret = models.CharField(max_length=64)
    event_types = models.JSONField()
    is_enabled = models.BooleanField(default=True)
    fail_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'webhooks'

class WebhookDeliveries(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    webhook = models.ForeignKey(Webhooks, on_delete=models.CASCADE)
    event_type = models.CharField(max_length=40)
    payload = models.JSONField()
    status = models.CharField(max_length=6, choices=[('queued', 'Queued'), ('sent', 'Sent'), ('failed', 'Failed')], default='queued')
    response_code = models.IntegerField(blank=True, null=True)
    response_body = models.TextField(blank=True, null=True)
    attempted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'webhook_deliveries'

class SavedViews(TenantScopedModel):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    user_id = models.CharField(max_length=36)
    entity_type = models.CharField(max_length=30)
    title = models.CharField(max_length=100)
    filters = models.JSONField()
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'saved_views'
        unique_together = (('tenant', 'user_id', 'entity_type', 'title'),)

# Materialized View Models (with proper composite primary keys)
class MvKpisDaily(TenantScopedModel):
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    day = models.DateField()
    orders_count = models.IntegerField(default=0)
    revenue = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    collections = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    new_customers = models.IntegerField(default=0)
    amount_due = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    avg_order_value = models.DecimalField(max_digits=14, decimal_places=2, default=0)

    class Meta:
        db_table = 'mv_kpis_daily'
        unique_together = (('tenant', 'day'),)

class MvSalesByItemDaily(TenantScopedModel):
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    day = models.DateField()
    item = models.ForeignKey(Items, on_delete=models.CASCADE)
    qty_sold = models.DecimalField(max_digits=14, decimal_places=3, default=0)
    net_sales = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    tax_collected = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    returns = models.DecimalField(max_digits=14, decimal_places=2, default=0)

    class Meta:
        db_table = 'mv_sales_by_item_daily'
        unique_together = (('tenant', 'day', 'item'),)

class MvCollectionsAging(TenantScopedModel):
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    as_of_date = models.DateField()
    bucket_0_7 = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    bucket_8_30 = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    bucket_31_60 = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    bucket_61_90 = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    bucket_90_plus = models.DecimalField(max_digits=14, decimal_places=2, default=0)

    class Meta:
        db_table = 'mv_collections_aging'
        unique_together = (('tenant', 'as_of_date'),)

class MvCustomerKpis(TenantScopedModel):
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customers, on_delete=models.CASCADE)
    first_order_at = models.DateField(blank=True, null=True)
    last_order_at = models.DateField(blank=True, null=True)
    orders_count = models.IntegerField(default=0)
    ltv = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    avg_order_value = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    amount_due = models.DecimalField(max_digits=14, decimal_places=2, default=0)

    class Meta:
        db_table = 'mv_customer_kpis'
        unique_together = (('tenant', 'customer'),)

class MvStaffPerfDaily(TenantScopedModel):
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    day = models.DateField()
    staff_id = models.CharField(max_length=36)
    orders_worked = models.IntegerField(default=0)
    sales_value = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    commission_est = models.DecimalField(max_digits=14, decimal_places=2, default=0)

    class Meta:
        db_table = 'mv_staff_perf_daily'
        unique_together = (('tenant', 'day', 'staff_id'),)

class MvLowStock(TenantScopedModel):
    tenant = models.ForeignKey(Tenants, on_delete=models.CASCADE)
    item = models.ForeignKey(Items, on_delete=models.CASCADE)
    onhand_qty = models.DecimalField(max_digits=14, decimal_places=3, default=0)
    threshold_qty = models.DecimalField(max_digits=14, decimal_places=3, default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'mv_low_stock'
        unique_together = (('tenant', 'item'),)