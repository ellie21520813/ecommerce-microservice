from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import viewsets
from .auth_helpers import update_user
from .models import Vendor, Product, Category
from .serializers import VendorSerializer, ProductSerializer, CategorySerializer


class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer

    @action(detail=False, methods=['get'], url_path='get-token')
    def get(self, request):
        token = request.headers.get('Authorization')
        return Response({"token": token}, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        slug = request.user_id
        print("slug", slug)
        is_vendor = request.is_vendor
        if is_vendor:
            return Response({"Detail": "user have been vendor"}, status=status.HTTP_302_FOUND)

        data = self.request.data
        update = {"is_vendor": True}
        bio = data.get('bio')
        contact_detail = data.get('contact_detail')
        bank_detail = data.get('bank_detail')
        shipping_policy = data.get('shipping_policy')
        return_policy = data.get('return_policy')
        token = self.request.headers.get('Authorization')
        auth_status, error = update_user(slug, token, update)
        if auth_status != 200:
            return Response({"Detail": f"{error}"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            vendor = Vendor.objects.create(
                user_id=slug,
                bio=bio,
                contact_detail=contact_detail,
                bank_detail=bank_detail,
                shipping_policy=shipping_policy,
                return_policy=return_policy
            )

            return Response(VendorSerializer(vendor).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    lookup_field = 'id'

    def retrieve(self, request, *args, **kwargs):
        product_id = self.kwargs.get('id')
        print(product_id)
        product = get_object_or_404(Product, id=product_id)
        serializer = self.get_serializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        try:
            product_id = self.kwargs.get('id')
            product = Product.objects.select_for_update().get(id=product_id)
            serializer = ProductSerializer(product, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error occurred: {str(e)}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MyProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    parser_classes = (MultiPartParser, FormParser)
    lookup_field = 'slug'

    def get_queryset(self):
        user_id = self.request.user_id
        vendor = Vendor.objects.get(user_id=user_id)
        print(Product.objects.filter(vendor=vendor))
        return Product.objects.filter(vendor=vendor)

    def perform_create(self, serializer):
        if not self.request.is_vendor:
            return Response({"detail": "You are not authorized as a vendor."},
                            status=status.HTTP_403_FORBIDDEN)
        user_id = self.request.user_id
        data = self.request.data
        product_image = self.request.FILES.get('image')
        try:
            vendor = Vendor.objects.get(user_id=user_id)
            category = get_object_or_404(Category, id=data.get("category"))

            product = Product.objects.create(
                vendor=vendor,
                category=category,
                name=data.get('name'),
                description=data.get('description'),
                price=data.get('price'),
                stock=data.get('stock'),
                image=product_image,
                is_flashsale=data.get('is_flashsale') in ['true', 'True', True],
            )
            return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)
        except Vendor.DoesNotExist:
            return Response({'message': 'Vendor not found'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("❌ Error creating product:", str(e))
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        if not self.request.is_vendor:
            return Response({"detail": "You are not authorized as a vendor."},
                            status=status.HTTP_403_FORBIDDEN)
        try:
            slug = self.kwargs.get('slug')
            print(slug)
            product = Product.objects.select_for_update().get(slug=slug)
            serializer = ProductSerializer(product, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error occurred: {str(e)}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, slug=None):
        try:
            slug = self.kwargs.get('slug')
            print(f"Received pk: {slug}")
            product = Product.objects.get(id=slug)
            product.delete()
            return Response({'message': 'product item deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({'message': 'Product item not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
