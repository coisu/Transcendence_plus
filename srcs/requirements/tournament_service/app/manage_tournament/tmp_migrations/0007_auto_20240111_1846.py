# Generated by Django 3.1.3 on 2024-01-11 18:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('manage_tournament', '0006_auto_20240111_1829'),
    ]

    operations = [
        migrations.RenameField(
            model_name='tournament',
            old_name='tournement_name',
            new_name='tournament_name',
        ),
    ]