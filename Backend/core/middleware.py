from core.models import Tenant
from django.http import HttpResponseForbidden

class TenantMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        tenant_id = request.headers.get("X-Tenant-ID")  # or subdomain logic
        if tenant_id:
            try:
                request.tenant = Tenant.objects.get(id=tenant_id)
            except Tenant.DoesNotExist:
                return HttpResponseForbidden("Invalid tenant")
        else:
            request.tenant = None
        return self.get_response(request)
