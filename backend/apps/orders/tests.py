from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Order, OrderItem, OrderStatusHistory
from apps.products.models import Product

User = get_user_model()

class OrderModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.order = Order.objects.create(
            user=self.user,
            order_number='TEST-123',
            total_amount=1000.00,
            shipping_address='123 Test St',
            payment_method='credit_card'
        )

    def test_order_creation(self):
        self.assertEqual(self.order.user, self.user)
        self.assertEqual(self.order.status, 'pending')
        self.assertEqual(self.order.total_amount, 1000.00)

class OrderAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        self.product = Product.objects.create(
            name='Test Product',
            price=500.00,
            description='Test Description'
        )

    def test_create_order(self):
        url = '/api/orders/'
        data = {
            'shipping_address': '123 Test St',
            'payment_method': 'credit_card'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Order.objects.count(), 1)
        self.assertTrue('order_number' in response.data)

    def test_add_item_to_order(self):
        order = Order.objects.create(
            user=self.user,
            order_number='TEST-123',
            total_amount=0.00,
            shipping_address='123 Test St',
            payment_method='credit_card'
        )
        url = f'/api/orders/{order.id}/add_item/'
        data = {
            'product_id': self.product.id,
            'quantity': 2
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(OrderItem.objects.count(), 1)

    def test_update_order_status(self):
        order = Order.objects.create(
            user=self.user,
            order_number='TEST-123',
            total_amount=1000.00,
            shipping_address='123 Test St',
            payment_method='credit_card'
        )
        url = f'/api/orders/{order.id}/update_status/'
        data = {
            'status': 'processing',
            'note': 'เริ่มดำเนินการ'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(OrderStatusHistory.objects.count(), 1)
        self.assertEqual(order.status, 'processing') 