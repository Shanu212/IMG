from django.contrib import admin
from .models import Meeting, Comment
# Register your models here.
models = [Meeting, Comment]

admin.site.register(models)