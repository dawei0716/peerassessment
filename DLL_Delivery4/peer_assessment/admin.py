from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(User)
admin.site.register(Class)
admin.site.register(Group)
admin.site.register(Group_Student)
admin.site.register(Class_Professors)
admin.site.register(Assessment)
admin.site.register(Question)
admin.site.register(Assessment_Question)
admin.site.register(Group_Assessment)
admin.site.register(Grade)
# admin.site.register(Grader)
# admin.site.register(InstructorSet)
# admin.site.register(Instructors)
