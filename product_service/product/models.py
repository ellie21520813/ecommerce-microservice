from django.db import models
from django.utils import timezone
from django.utils.text import slugify


# Create your models here.

class Vendor(models.Model):
    user_id = models.IntegerField()
    bio = models.CharField(max_length=255)
    contact_detail = models.CharField(max_length=255)
    bank_detail = models.CharField(max_length=255)
    shipping_policy = models.CharField(max_length=255)
    return_policy = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return str(self.user_id)


class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=100)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self.create_slug()
        super().save(*args, **kwargs)

    def create_slug(self):
        return slugify(self.name)

    def __str__(self):
        return self.name


class Product(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='products')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)
    description = models.CharField(max_length=255)
    stock = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=100, decimal_places=2)
    image = models.ImageField(upload_to='products/')
    is_flashsale = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self.create_slug()
        super().save(*args, **kwargs)

    def create_slug(self):
        return slugify(self.name)

    def __str__(self):
        return self.name


