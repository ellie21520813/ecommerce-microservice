from django.contrib import admin

from .models import Vendor, Product, Category

# Register your models here.
admin.site.register(Vendor)
admin.site.register(Product)
admin.site.register(Category)

