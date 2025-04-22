from django.urls import path, include
from rest_framework import routers
from .views import CartItemViewSet, OrderViewSet, OrderItemViewSet, CartViewSet, ShippingViewSet

router = routers.DefaultRouter()

router.register(r'cart-item', CartItemViewSet)
router.register(r'order', OrderViewSet)
router.register(r'order-item', OrderItemViewSet)
router.register(r'cart', CartViewSet)
router.register(r'shipping', ShippingViewSet)


urlpatterns = [
    path('api/v2/', include(router.urls)),
]