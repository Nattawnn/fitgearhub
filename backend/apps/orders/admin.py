from django.contrib import admin
from .models import Order, OrderItem, Shipment, Payment

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

class ShipmentInline(admin.TabularInline):
    model = Shipment
    extra = 0

class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'customer', 'order_date', 'total_price')
    list_filter = ('order_date',)
    search_fields = ('customer__username', 'order_id')
    inlines = [OrderItemInline, ShipmentInline, PaymentInline]

@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ('shipment_id', 'order', 'shipment_date', 'city', 'country')
    list_filter = ('shipment_date', 'country')
    search_fields = ('order__order_id', 'address')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('payment_id', 'order', 'payment_date', 'payment_method', 'amount')
    list_filter = ('payment_date', 'payment_method')
    search_fields = ('order__order_id',)
