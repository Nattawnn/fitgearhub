from rest_framework import serializers
from .models import Product, Category, ProductImage

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        required=False
    )
    images = ProductImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock', 
                 'category', 'category_id', 'images', 'uploaded_images',
                 'created_at', 'updated_at']

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        product = Product.objects.create(**validated_data)

        for image in uploaded_images[:4]:  # Limit to first 4 images
            ProductImage.objects.create(
                product=product,
                image=image,
                is_primary=not ProductImage.objects.filter(product=product).exists()  # First image is primary
            )

        return product

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        
        # Update product fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Add new images if there's room
        current_image_count = instance.images.count()
        remaining_slots = 4 - current_image_count

        if remaining_slots > 0 and uploaded_images:
            for image in uploaded_images[:remaining_slots]:
                ProductImage.objects.create(
                    product=instance,
                    image=image,
                    is_primary=not ProductImage.objects.filter(product=instance).exists()
                )

        return instance
