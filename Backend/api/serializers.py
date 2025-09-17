from rest_framework import serializers
from .models import Item
from django.contrib.auth.models import User
from core.models import( Tenants, TenantUsers ,ItemCategories, Items, ItemPrices , Customers, CustomerTimeline)


# Users

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

# Tenants

class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenants
        fields = '__all__'


class TenantUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantUsers
        fields = '__all__'


# Items
        
class ItemCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategories
        fields = '__all__'

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Items
        fields = '__all__'

class ItemPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemPrices
        fields = '__all__'
        
        
# customer 

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customers
        fields = "__all__"
        extra_kwargs = {
            "tenant": {"required": False},
            "display_name": {"required": False}
        }


class CustomerTimelineSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerTimeline
        fields = "__all__"
        read_only_fields = ['tenant', 'customer', 'created_by']
        
        
        
