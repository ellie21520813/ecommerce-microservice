import requests

from .models import Vendor, Product, Category
from rest_framework import serializers


class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = ['user_id', 'bio', 'contact_detail', 'bank_detail', 'shipping_policy', 'return_policy']


class CategorySerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(max_length=255, min_length= 6, read_only=True)

    class Meta:
        model = Category
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    vendor = VendorSerializer(read_only=True)


    class Meta:
        model = Product
        fields = ['vendor', 'category', 'name', 'slug', 'description', 'stock', 'price', 'image', 'is_flashsale']

