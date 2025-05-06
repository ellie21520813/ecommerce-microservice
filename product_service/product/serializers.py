import requests

from .models import Vendor, Product, Category
from rest_framework import serializers
from django.conf import settings


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
    category = CategorySerializer()
    vendor = VendorSerializer(read_only=True)
    id = serializers.IntegerField(read_only=True)


    class Meta:
        model = Product
        fields = ['id', 'vendor', 'category', 'name', 'slug', 'description', 'stock', 'price', 'image', 'is_flashsale']

    def get_image(self, obj):
        request = self.context.get('request')
        domain = settings.DEFAULT_DOMAIN
        return f"{domain}{obj.image.url}" if obj.image else ""
        

