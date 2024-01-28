from django.urls import path, include
from django.contrib import admin
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views
from .views import CustomPasswordResetConfirmView, CustomPasswordResetDoneView


app_name = "account"

urlpatterns = [
    path("login", views.api_login_view, name="login"),
    path("logout", views.api_logout_view, name="logout"),
    path("signup", views.api_signup_view, name="signup"),
    path("friend", views.friend_view, name="friend"),
    path("add_friend/<int:pk>", views.add_friend, name="add_friend"),
    path("remove_friend/<int:pk>", views.remove_friend, name="remove_friend"),
    path("detail", views.detail_view, name="detail"),
    path("profile_update", views.profile_update_view, name="profile_update"),
    path("PasswordChangeForm", views.password_update_view, name="password_update"),
    path('password_reset_confirm/<uidb64>/<token>/', CustomPasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    # path('passwordResetForm/', CustomPasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', CustomPasswordResetDoneView.as_view(), name='password_reset_done'),
    # path('password_reset_done/', custom_password_reset_done, name='password_reset_done'),
    path('sendResetLink', views.password_reset_link, name='send_resetLink'),
    path('verify_code', views.verify_one_time_code, name='verify_one_time_code'),
    path('access_code', views.send_one_time_code, name='send_one_time_code'),
    path('delete_account', views.delete_account, name='delete_account'),
    path('developer_setting', views.print_all_user_data, name='print_db'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)