# Generated by Django 5.0.4 on 2024-04-14 13:53

import django.core.validators
from decimal import Decimal
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('manage_tournament', '0010_alter_matchsetting_ball_speed'),
    ]

    operations = [
        migrations.AlterField(
            model_name='matchsetting',
            name='ball_radius',
            field=models.DecimalField(decimal_places=1, default=1, max_digits=3, validators=[django.core.validators.MinValueValidator(Decimal('0.5'), message='Ball radius must be at least 0.5.'), django.core.validators.MaxValueValidator(Decimal('7'), message='Ball radius cannot exceed 7.')]),
        ),
    ]
