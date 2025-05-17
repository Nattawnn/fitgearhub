from django.contrib import admin
from .models import Cart

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('cart_id', 'customer', 'product', 'quantity', 'total_price')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('customer__username', 'product__name')
