from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Checkout, CheckoutItem
from .serializers import CheckoutSerializer, CheckoutItemSerializer
from apps.products.models import Product

class CheckoutViewSet(viewsets.ModelViewSet):
    serializer_class = CheckoutSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Checkout.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        checkout = self.get_object()
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        try:
            product = Product.objects.get(id=product_id)
            item = CheckoutItem.objects.create(
                checkout=checkout,
                product=product,
                quantity=quantity,
                price=product.price
            )
            return Response(CheckoutItemSerializer(item).data)
        except Product.DoesNotExist:
            return Response(
                {'error': 'สินค้าไม่พบ'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'])
    def update_address(self, request, pk=None):
        checkout = self.get_object()
        checkout.shipping_address = request.data.get('shipping_address')
        checkout.save()
        return Response(CheckoutSerializer(checkout).data)

    @action(detail=True, methods=['post'])
    def process_payment(self, request, pk=None):
        checkout = self.get_object()
        payment_method = request.data.get('payment_method')
        
        # จำลองการประมวลผลการชำระเงิน
        checkout.payment_method = payment_method
        checkout.payment_status = 'completed'
        checkout.status = 'processing'
        checkout.save()
        
        return Response(CheckoutSerializer(checkout).data) 