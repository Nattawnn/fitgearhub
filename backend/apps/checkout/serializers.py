from rest_framework import serializers
from .models import Checkout, CheckoutItem
from apps.products.serializers import ProductSerializer

class CheckoutItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = CheckoutItem
        fields = ['id', 'product', 'product_id', 'quantity', 'price']

class CheckoutSerializer(serializers.ModelSerializer):
    items = CheckoutItemSerializer(many=True, read_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Checkout
        fields = ['id', 'user', 'created_at', 'updated_at', 'status', 
                 'total_amount', 'shipping_address', 'payment_method', 
                 'payment_status', 'items']
        read_only_fields = ['user', 'total_amount'] 