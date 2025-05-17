from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .models import Checkout, CheckoutItem
from .serializers import CheckoutSerializer, CheckoutItemSerializer
from apps.products.models import Product
from apps.cart.models import Cart, CartItem
from apps.orders.models import Order, OrderItem

class CheckoutViewSet(viewsets.ModelViewSet):
    serializer_class = CheckoutSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Checkout.objects.filter(user=self.request.user)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            # Get user's cart
            cart = Cart.objects.get(user=request.user)
            if not cart.items.exists():
                return Response(
                    {'error': 'ไม่มีสินค้าในตะกร้า'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Calculate total amount from cart items
            total_amount = sum(item.product.price * item.quantity for item in cart.items.all())

            # Create checkout with cart total and provided information
            checkout_data = {
                'user': request.user,
                'total_amount': total_amount,
                'full_name': request.data.get('full_name'),
                'phone_number': request.data.get('phone_number'),
                'shipping_address': request.data.get('shipping_address'),
                'payment_method': request.data.get('payment_method', 'cash_on_delivery'),
                'status': 'pending'
            }

            # Validate required fields
            required_fields = ['full_name', 'phone_number', 'shipping_address']
            missing_fields = [field for field in required_fields if not request.data.get(field)]
            if missing_fields:
                return Response(
                    {'error': f'กรุณากรอกข้อมูล: {", ".join(missing_fields)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create checkout
            checkout = Checkout.objects.create(**checkout_data)

            # Create checkout items from cart items
            for cart_item in cart.items.all():
                CheckoutItem.objects.create(
                    checkout=checkout,
                    product=cart_item.product,
                    quantity=cart_item.quantity,
                    price=cart_item.product.price
                )

            # Create order
            order = Order.objects.create(
                user=request.user,
                total_amount=total_amount,
                shipping_address=checkout.shipping_address,
                payment_method=checkout.payment_method,
                status='pending'
            )

            # Create order items and clear cart items
            for cart_item in cart.items.all():
                OrderItem.objects.create(
                    order=order,
                    product=cart_item.product,
                    quantity=cart_item.quantity,
                    price=cart_item.product.price
                )

            # Clear the cart
            cart.items.all().delete()

            serializer = self.get_serializer(checkout)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Cart.DoesNotExist:
            return Response(
                {'error': 'ไม่พบตะกร้าสินค้า'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'])
    def cart_preview(self, request):
        """Get cart details and total without creating checkout"""
        try:
            cart = Cart.objects.get(user=request.user)
            if not cart.items.exists():
                return Response(
                    {'error': 'ไม่มีสินค้าในตะกร้า'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            cart_items = []
            total_amount = 0

            for item in cart.items.all():
                cart_items.append({
                    'product': {
                        'id': item.product.id,
                        'name': item.product.name,
                        'price': str(item.product.price)
                    },
                    'quantity': item.quantity,
                    'total': str(item.product.price * item.quantity)
                })
                total_amount += item.product.price * item.quantity

            return Response({
                'cart_items': cart_items,
                'total_amount': str(total_amount)
            })

        except Cart.DoesNotExist:
            return Response(
                {'error': 'ไม่พบตะกร้าสินค้า'},
                status=status.HTTP_404_NOT_FOUND
            )

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