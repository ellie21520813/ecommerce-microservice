from django.db import models
from django.utils import timezone


# Create your models here.

class Cart(models.Model):
    user = models.IntegerField()
    created_at = models.DateTimeField(default=timezone.now)


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.IntegerField()
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)


class Order(models.Model):
    user = models.IntegerField()
    name_order = models.TextField(max_length=255)
    email_order = models.EmailField(max_length=255)
    phone_order = models.TextField(max_length=255)
    total_price = models.DecimalField(max_digits=100, decimal_places=2)
    shipping_address = models.TextField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now_add=True)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.IntegerField()
    quantity = models.PositiveIntegerField(default=1)


class Shipping(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='shipping')
    order_item = models.OneToOneField(OrderItem, on_delete=models.CASCADE, related_name='shipping_item', null=True, blank=True)
    vendor = models.IntegerField()
    shipping_method = models.CharField(max_length=255, default="Standard")
    shipping_cost = models.DecimalField(max_digits=100, decimal_places=2, default="5")
    shipped_at = models.DateTimeField(null=True, blank=True)
    estimated_delivery = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    shipping_status = models.CharField(max_length=100, default='pending')

    def __str__(self):
        return f'{1} shipping for order {self.order.id}'


class Payment(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    payment_method = models.CharField(max_length=100)
    payment_status = models.CharField(max_length=100, default="Pending")
    transaction_id = models.CharField(max_length=255, blank=True, null=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    amount = models.DecimalField(max_digits=100, decimal_places=2)

    def __str__(self):
        return f"Payment for Order #{self.order.id}"


class Refund(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='refunds')
    reason = models.TextField()
    amount = models.DecimalField(max_digits=5, decimal_places=2)
    status = models.CharField(max_length=100)
    requests_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
