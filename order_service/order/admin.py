from django.contrib import admin

from .models import Order, OrderItem, Cart, CartItem, Refund

# Register your models here.

admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Refund)
