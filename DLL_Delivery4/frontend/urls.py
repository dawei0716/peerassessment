
from django.urls import path
from . import views
urlpatterns = [
  path('', views.index),
  path('login/', views.index),
  path('studentHome/', views.index),
  path('studentHome/assessments/', views.index),
  path('studentHome/completed/', views.index),
  path('professorHome/', views.index),
  path('professorHome/assessments/', views.index),
  path('professorHome/teams/', views.index),
  path('professorHome/aggregatedresults/', views.index),
  path('changepassword/', views.index),
  path('professorHome/questions/', views.index)
]