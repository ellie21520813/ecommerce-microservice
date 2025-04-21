from django.urls import path, include
from rest_framework import routers
from .views import CartItemViewSet, OrderViewSet

router = routers.DefaultRouter()

router.register(r'cart-item', CartItemViewSet)
router.register(r'order', OrderViewSet)


urlpatterns = [
    path('api/v2/', include(router.urls)),
]