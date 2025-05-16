from rest_framework import serializers
from .models import Order, OrderItem, OrderStatusHistory
from apps.products.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'quantity', 'price']

class OrderStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatusHistory
        fields = ['id', 'status', 'created_at', 'note']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'order_number', 'user', 'created_at', 'updated_at', 
                 'status', 'total_amount', 'shipping_address', 'payment_method', 
                 'payment_status', 'tracking_number', 'items', 'status_history']
        read_only_fields = ['user', 'order_number', 'total_amount']
