from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Checkout, CheckoutItem
from apps.products.models import Product

User = get_user_model()

class CheckoutModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.checkout = Checkout.objects.create(
            user=self.user,
            total_amount=1000.00,
            shipping_address='123 Test St',
            payment_method='credit_card'
        )

    def test_checkout_creation(self):
        self.assertEqual(self.checkout.user, self.user)
        self.assertEqual(self.checkout.status, 'pending')
        self.assertEqual(self.checkout.total_amount, 1000.00)

class CheckoutAPITest(APITestCase):
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

    def test_create_checkout(self):
        url = '/api/checkout/'
        data = {
            'shipping_address': '123 Test St',
            'payment_method': 'credit_card'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Checkout.objects.count(), 1)

    def test_add_item_to_checkout(self):
        checkout = Checkout.objects.create(
            user=self.user,
            total_amount=0.00,
            shipping_address='123 Test St',
            payment_method='credit_card'
        )
        url = f'/api/checkout/{checkout.id}/add_item/'
        data = {
            'product_id': self.product.id,
            'quantity': 2
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(CheckoutItem.objects.count(), 1) 