from rest_framework import serializers
from .models import Order, OrderItem, Cart, CartItem, Refund


class CartSerializer(serializers.ModelSerializer):

    class Meta:
        model = Cart
        fields = '__all__'


class CartItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = CartItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Order
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderItem
        fields = '__all__'