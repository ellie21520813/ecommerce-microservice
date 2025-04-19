from django.db import models
from django.utils import timezone

# Create your models here.

class Cart(models.Model):
    user = models.IntegerField()
    product = models.IntegerField()
    created_at = models.DateTimeField(default=timezone.now())


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.IntegerField(),
    created_at = models.DateTimeField(auto_now_add= True)

class Order(models.Model):
    user = models.IntegerField(),
    name_order = models.TextField(max_length=255)
    email_order = models.EmailField(max_length=255)
    phone_order = models.TextField(max_length=255)
    products = models.IntegerField(),
    total_price = models.DecimalField(max_digits=100, decimal_places=2)
    shipping_address = models.TextField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now_add=True)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.IntegerField()
    quantity = models.PositiveIntegerField(default=1)


class Refund(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='refunds')
    reason = models.TextField()
    amount = models.DecimalField(max_digits=5, decimal_places=2)
    status = models.CharField(max_length=100)
    requests_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

