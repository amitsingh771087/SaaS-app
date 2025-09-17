from rest_framework import viewsets, permissions, status , generics
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes , action
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404


from .models import Item
from .serializers import (
    ItemSerializer, UserSerializer, TenantSerializer, 
    TenantUserSerializer, CustomerSerializer,ItemCategorySerializer, ItemSerializer, ItemPriceSerializer,
    CustomerSerializer, CustomerTimelineSerializer
)
from core.models import( Tenants, TenantUsers,ItemCategories, Items, ItemPrices , Customers, CustomerTimeline)


# ---------------------- CRUD ViewSets ----------------------
# class ItemViewSet(viewsets.ModelViewSet):
#     queryset = Item.objects.all()
#     serializer_class = ItemSerializer
#     permission_classes = [permissions.IsAuthenticated]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenants.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [permissions.IsAuthenticated]


class TenantUserViewSet(viewsets.ModelViewSet):
    queryset = TenantUsers.objects.all()
    serializer_class = TenantUserSerializer
    permission_classes = [permissions.IsAuthenticated]



    
# Items

class ItemCategoryViewSet(viewsets.ModelViewSet):
    queryset = ItemCategories.objects.all()
    serializer_class = ItemCategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Items.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]


class ItemPriceViewSet(viewsets.ModelViewSet):
    queryset = ItemPrices.objects.all()
    serializer_class = ItemPriceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    
# --- Customers ---

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customers.objects.all()
    serializer_class = CustomerSerializer

    @action(detail=True, methods=["get", "post"], url_path="timeline")
    def timeline(self, request, pk=None):
        customer = self.get_object()

        if request.method == "GET":
            timeline = CustomerTimeline.objects.filter(customer=customer)
            serializer = CustomerTimelineSerializer(timeline, many=True)
            return Response(serializer.data)

        if request.method == "POST":
            serializer = CustomerTimelineSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(
                    customer=customer,
                    tenant=customer.tenant,
                    created_by=str(request.user.id)
                )
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)
        
        
        
class CustomerListCreateView(generics.ListCreateAPIView):
    queryset = Customers.objects.all()
    serializer_class = CustomerSerializer


class CustomerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Customers.objects.all()
    serializer_class = CustomerSerializer


# --- Customer Timeline ---
class CustomerTimelineView(APIView):
    def get(self, request, pk):
        timeline = CustomerTimeline.objects.filter(customer_id=pk)
        serializer = CustomerTimelineSerializer(timeline, many=True)
        return Response(serializer.data)

    def post(self, request, pk):
        data = request.data.copy()
        data["customer"] = pk
        serializer = CustomerTimelineSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --- Import Customers via CSV ---
class CustomerImportCSVView(APIView):
    def post(self, request):
        file = request.FILES.get("file")
        if not file:
            return Response({"error": "No file uploaded"}, status=400)

        decoded_file = file.read().decode("utf-8")
        io_string = io.StringIO(decoded_file)
        reader = csv.DictReader(io_string)

        customers = []
        for row in reader:
            customer = Customers(
                display_name=row.get("display_name"),
                primary_email=row.get("primary_email"),
                primary_phone=row.get("primary_phone"),
                tenant_id=request.data.get("tenant")  # pass tenant in form-data
            )
            customers.append(customer)

        Customers.objects.bulk_create(customers)

        return Response({"message": f"{len(customers)} customers imported successfully"})


# ---------------------- Auth Endpoints ----------------------
@api_view(["POST"])
@permission_classes([permissions.AllowAny])  
def signup(request):
    username = request.data.get("username")
    password = request.data.get("password")
    email = request.data.get("email")

    if not username or not password:
        return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create(
        username=username,
        password=make_password(password),  
        email=email
    )

    return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
