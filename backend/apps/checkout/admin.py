from django.contrib import admin
from .models import Checkout, CheckoutItem

class CheckoutItemInline(admin.TabularInline):
    model = CheckoutItem
    extra = 0

@admin.register(Checkout)
class CheckoutAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'total_amount', 'payment_status', 'created_at')
    list_filter = ('status', 'payment_status', 'created_at')
    search_fields = ('user__username', 'id')
    inlines = [CheckoutItemInline] 