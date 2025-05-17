from django.db import models
from django.core.exceptions import ValidationError

class Category(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"

class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/')
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_primary', '-created_at']

    def clean(self):
        if self.is_primary:
            # Check if there's already a primary image for this product
            existing_primary = ProductImage.objects.filter(
                product=self.product, 
                is_primary=True
            ).exclude(id=self.id).exists()
            
            if existing_primary:
                raise ValidationError('This product already has a primary image')

        # Check if the product already has 4 images
        if not self.id and self.product.images.count() >= 4:
            raise ValidationError('A product cannot have more than 4 images')

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

        # If this is the only image, make it primary
        if self.product.images.count() == 1:
            self.is_primary = True
            super().save(update_fields=['is_primary'])

    def __str__(self):
        return f"Image for {self.product.name} ({'Primary' if self.is_primary else 'Secondary'})"
