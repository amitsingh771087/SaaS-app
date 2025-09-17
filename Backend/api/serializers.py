from rest_framework import serializers
from .models import Item
from django.contrib.auth.models import User
# from core.models import Tenant, TenantUser, Customers
from core.models import Tenants, TenantUsers, Customers

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenants
        fields = '__all__'


class TenantUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantUsers
        fields = '__all__'


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customers
        fields = '__all__'