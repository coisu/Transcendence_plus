# Generated by Django 3.1.3 on 2024-02-17 18:03

from django.db import migrations, models
import django.db.models.deletion
from django.contrib.auth.models import User
from manage_tournament.models import Player


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='GameType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type_name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='MatchSetting',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('duration_sec', models.IntegerField(default=210)),
                ('max_score', models.IntegerField(default=5)),
                ('nbr_of_sets', models.IntegerField(default=1)),
                ('paddle_speed', models.IntegerField(default=10)),
                ('ball_speed', models.IntegerField(default=10)),
                ('nbr_of_players', models.IntegerField(default=2)),
            ],
        ),
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=255)),
            ],
            options={
                'unique_together': {('id', 'username')},
            },
        ),
        migrations.CreateModel(
            name='RegistrationType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type_name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='TournamentType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type_name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='TournamentMatch',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('round_number', models.IntegerField()),
                ('match_time', models.DateTimeField(null=True)),
                ('match_result', models.CharField(max_length=255)),
                ('tournament_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='matches', to='manage_tournament.Tournament')),
                ('nbr_of_player', models.IntegerField(default=1)),
                ('match_setting_id', models.ForeignKey(on_delete=models.PROTECT, null=False, related_name='matches', to='manage_tournament.MatchSetting')),
            ],
        ),
        migrations.CreateModel(
            name='MatchParticipants',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_winner', models.BooleanField(default=False)),
                ('participant_score', models.IntegerField(default=0)),
                ('match_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='participants', to='manage_tournament.TournamentMatch')),
                ('player_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='player_from_match', to='manage_tournament.Player')),
            ],
        ),
        migrations.CreateModel(
            name='TournamentPlayer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tournament_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='players', to='manage_tournament.Tournament')),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tournaments', to='manage_tournament.Player')),
            ],
            options={
                'unique_together': {('tournament_id', 'player')},
            },
        ),
        migrations.CreateModel(
            name='Tournament',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tournament_name', models.CharField(max_length=255, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('nbr_of_player_total', models.IntegerField(default=2, validators=[django.core.validators.MinValueValidator(2), django.core.validators.MaxValueValidator(100)])),
                ('nbr_of_player_match', models.IntegerField(default=1, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(8)])),
                ('registration_period_min', models.IntegerField(default=15, validators=[django.core.validators.MinValueValidator(1, message='Registration period must be at least 1 minutes.'), django.core.validators.MaxValueValidator(60, message='Registration period cannot exceed 60 minutes.')])),
                ('host', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='hosted_tournaments', to='auth.User')),
                ('game_type', models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='manage_tournament.GameType')),
                ('tournament_type', models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='manage_tournament.TournamentType')),
                ('settings', models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='manage_tournament.MatchSetting')),
                ('registration', models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='manage_tournament.RegistrationType')),
                ('tournament_result', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='won_tournaments', to='manage_tournament.Player')),
                ('players', models.ManyToManyField(related_name='tournaments', to='manage_tournament.Player')),
                ('matches', models.ManyToManyField(related_name='tournaments', to='manage_tournament.TournamentMatch')),
                ('nbr_of_match', models.IntegerField(default=0)),
            ],
        ),
    ]
