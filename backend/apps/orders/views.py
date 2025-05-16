from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem, OrderStatusHistory
from .serializers import OrderSerializer, OrderItemSerializer
from apps.products.models import Product
import uuid

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        serializer.save(user=self.request.user, order_number=order_number)

    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        order = self.get_object()
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        try:
            product = Product.objects.get(id=product_id)
            item = OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=product.price
            )
            return Response(OrderItemSerializer(item).data)
        except Product.DoesNotExist:
            return Response(
                {'error': 'สินค้าไม่พบ'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        note = request.data.get('note', '')

        if new_status not in dict(Order.STATUS_CHOICES):
            return Response(
                {'error': 'สถานะไม่ถูกต้อง'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = new_status
        order.save()

        # บันทึกประวัติการเปลี่ยนแปลงสถานะ
        OrderStatusHistory.objects.create(
            order=order,
            status=new_status,
            note=note
        )

        return Response(OrderSerializer(order).data)

    @action(detail=True, methods=['post'])
    def update_tracking(self, request, pk=None):
        order = self.get_object()
        tracking_number = request.data.get('tracking_number')

        order.tracking_number = tracking_number
        order.save()

        return Response(OrderSerializer(order).data)
