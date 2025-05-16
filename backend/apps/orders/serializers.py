from rest_framework import serializers
from .models import Order, OrderItem, Shipment, Payment
from apps.products.serializers import ProductSerializer
from apps.users.serializers import UserSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = OrderItem
        fields = ['order_item_id', 'product', 'product_id', 'quantity', 'price']

class ShipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = ['shipment_id', 'shipment_date', 'address', 'city', 
                 'state', 'country', 'zip_code']

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['payment_id', 'payment_date', 'payment_method', 'amount']

class OrderSerializer(serializers.ModelSerializer):
    customer = UserSerializer(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    shipment = ShipmentSerializer(read_only=True)
    payment = PaymentSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['order_id', 'customer', 'order_date', 'total_price', 
                 'items', 'shipment', 'payment']
