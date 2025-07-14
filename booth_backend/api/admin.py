from django.contrib import admin
from .models import Poll, Candidate
# Register your models here.


admin.site.register(Poll)
admin.site.register(Candidate)