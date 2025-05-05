from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import viewsets, status

from .auth_helpers import get_product, update_product
from .models import Cart, CartItem, OrderItem, Order, Shipping
from .serializers import CartSerializer, CartItemSerializer, OrderItemSerializer, OrderSerializer, ShippingSerializer
from django.db import transaction


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer

    def create(self, request):
        user_id = request.user_id
        product_id = request.data.get('product')
        quantity = request.data.get('quantity')

        cart, created = Cart.objects.get_or_create(user=user_id)
        product_data, error = get_product(product_id)
        if not product_data:
            return Response({"detail": "Product not found or out of stock",
                             "error": error}, status=status.HTTP_302_FOUND)

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product_id,
            quantity=quantity
        )
        if not created:
            item.quantity += int(quantity)
            item.save()

        return Response(CartItemSerializer(item).data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        try:
            cart_item = self.get_object()
            cart_item.delete()
            return Response({'message': 'Cart item deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response({'message': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

    def list(self, request, *args, **kwargs):
        user_id = request.user_id
        cart = Cart.objects.filter(user=user_id)
        serializer = CartSerializer(cart, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def list(self, request, *args, **kwargs):
        user_id = request.user_id
        order = Order.objects.filter(user=user_id)
        serializer = OrderSerializer(order, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        user_id = request.user_id
        data = request.data
        order_items = data.get('order_item', [])

        order = Order.objects.create(
            user=user_id,
            name_order=data.get('name_order'),
            email_order=data.get('email_order'),
            phone_order=data.get('phone_order'),
            total_price=0,
            shipping_address=data.get('shipping_address')
        )

        total_price = 0
        try:
            for item in order_items:
                product_id = item.get('product_id')
                quantity = int(item.get('quantity'))
                product_data, error = get_product(product_id)
                if not product_data:
                    return Response({"detail": "Product not found or out of stock",
                                     "error": error}, status=status.HTTP_302_FOUND)

                total_price += float(product_data.get('price')) * quantity

                order_item = OrderItem.objects.create(
                    order=order,
                    product=product_id,
                    quantity=quantity
                )
                vendor = product_data.get('vendor')
                Shipping.objects.create(order=order, order_item=order_item, vendor=vendor.get("user_id"))
                CartItem.objects.filter(product=product_id).delete()

                update_data = {'stock': product_data.get('stock') - quantity}
                token = request.headers.get('Authorization')
                update_status, error = update_product(product_id, update_data, token)

                if update_status != 200:
                    return Response({"detail": "Failed to update product stock",
                                     "error": error}, status=status.HTTP_400_BAD_REQUEST)
            order.total_price = total_price
            order.save()

            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ShippingViewSet(viewsets.ModelViewSet):
    queryset = Shipping.objects.all()
    serializer_class = ShippingSerializer
    lookup_field = 'id'

    def list(self, request, *args, **kwargs):
        user_id = request.user_id
        if not self.request.is_vendor:
            return Response({"detail": "You are not authorized as a vendor."},
                            status=status.HTTP_403_FORBIDDEN)
        shipping = Shipping.objects.filter(vendor=user_id)
        serializer = ShippingSerializer(shipping)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        if not self.request.is_vendor:
            return Response({"detail": "You are not authorized as a vendor."},
                            status=status.HTTP_403_FORBIDDEN)
        shipping_id = self.kwargs.get("id")
        shipping = get_object_or_404(Shipping, id=shipping_id)
        serializer = self.get_serializer(shipping)
        return Response(serializer.data, status=status.HTTP_200_OK)
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        if not self.request.is_vendor:
            return Response({"detail": "You are not authorized as a vendor."},
                            status=status.HTTP_403_FORBIDDEN)
        try:
            shipping_id = self.kwargs.get('id')
            shipping = Shipping.objects.select_for_update().get(id=shipping_id)
            if shipping.delivered_at:
                return Response({"detail": "Order was already delivered"},
                                status=status.HTTP_400_BAD_REQUEST)
            serializer = ShippingSerializer(shipping, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Shipping.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "An unexpected error occurred",
                             "detail": str(e)
                             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

