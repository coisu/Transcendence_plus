# Generated by Django 5.0.3 on 2024-03-21 02:08

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='GameType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type_name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='MatchParticipants',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('match_id', models.IntegerField()),
                ('round_number', models.IntegerField()),
                ('player_id', models.IntegerField()),
                ('is_winner', models.BooleanField(default=False)),
                ('participant_score', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='MatchSetting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('duration_sec', models.IntegerField(default=210, validators=[django.core.validators.MinValueValidator(60, message='Duration must be at least 60 seconds.'), django.core.validators.MaxValueValidator(300, message='Duration cannot exceed 300 seconds.')])),
                ('max_score', models.IntegerField(default=5, validators=[django.core.validators.MinValueValidator(1, message='Max score must be at least 1.'), django.core.validators.MaxValueValidator(10, message='Max score cannot exceed 10.')])),
                ('walls_factor', models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(0, message='Walls factor must be at least 0.'), django.core.validators.MaxValueValidator(2, message='Walls factor cannot exceed 2.')])),
                ('size_of_goals', models.IntegerField(default=15, validators=[django.core.validators.MinValueValidator(15, message='Size of goal must be at least 10.'), django.core.validators.MaxValueValidator(30, message='Size of goal cannot exceed 30.')])),
                ('paddle_height', models.IntegerField(default=10, validators=[django.core.validators.MinValueValidator(1, message='Paddle height must be at least 1.'), django.core.validators.MaxValueValidator(12, message='Paddle height cannot exceed 12.')])),
                ('paddle_speed', models.DecimalField(decimal_places=2, default=0.5, max_digits=3, validators=[django.core.validators.MinValueValidator(0.1, message='Paddle speed must be at least 0.1.'), django.core.validators.MaxValueValidator(2, message='Paddle speed cannot exceed 2.')])),
                ('ball_speed', models.DecimalField(decimal_places=2, default=0.7, max_digits=3, validators=[django.core.validators.MinValueValidator(0.1, message='Ball speed must be at least 0.1.'), django.core.validators.MaxValueValidator(2, message='Ball speed cannot exceed 2.')])),
                ('ball_radius', models.DecimalField(decimal_places=2, default=1, max_digits=3, validators=[django.core.validators.MinValueValidator(0.5, message='Ball radius must be at least 0.5.'), django.core.validators.MaxValueValidator(7, message='Ball radius cannot exceed 7.')])),
                ('ball_color', models.CharField(default='#000000', max_length=7, validators=[django.core.validators.RegexValidator('^#(?:[0-9a-fA-F]{3}){1,2}$', message='Invalid color format.')])),
                ('nbr_of_player', models.IntegerField(default=2, validators=[django.core.validators.MinValueValidator(2), django.core.validators.MaxValueValidator(8)])),
            ],
        ),
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='RegistrationType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type_name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='TournamentType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type_name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='TournamentMatch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tournament_id', models.IntegerField()),
                ('match_setting_id', models.IntegerField()),
                ('round_number', models.IntegerField(default=1, validators=[django.core.validators.MinValueValidator(1)])),
                ('match_time', models.DateTimeField(null=True)),
                ('state', models.CharField(default='waiting', max_length=15)),
                ('participants', models.ManyToManyField(related_name='matches', to='manage_tournament.matchparticipants')),
                ('players', models.ManyToManyField(related_name='matches', to='manage_tournament.player')),
            ],
        ),
        migrations.CreateModel(
            name='Tournament',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tournament_name', models.CharField(max_length=255, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('nbr_of_player_total', models.IntegerField(default=2, validators=[django.core.validators.MinValueValidator(2), django.core.validators.MaxValueValidator(100)])),
                ('nbr_of_player_match', models.IntegerField(default=2, validators=[django.core.validators.MinValueValidator(2), django.core.validators.MaxValueValidator(8)])),
                ('registration_period_min', models.IntegerField(default=15, validators=[django.core.validators.MinValueValidator(1, message='Registration period must be at least 1 minutes.'), django.core.validators.MaxValueValidator(60, message='Registration period cannot exceed 60 minutes.')])),
                ('nbr_of_match', models.IntegerField(default=0)),
                ('tournament_type', models.CharField(choices=[('tournament', 'Nock Out'), ('league', 'Round Robin')], default='tournament', max_length=15)),
                ('registration', models.CharField(choices=[('public', 'Opened game'), ('private', 'Invitaion required')], default='public', max_length=15)),
                ('game_type', models.CharField(choices=[('pong', 'Pong')], default='pong', max_length=15)),
                ('state', models.CharField(default='waiting', max_length=15)),
                ('host', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='hosted_tournaments', to='manage_tournament.player')),
                ('players', models.ManyToManyField(related_name='tournaments', to='manage_tournament.player')),
                ('setting', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='manage_tournament.matchsetting')),
                ('tournament_result', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='won_tournaments', to='manage_tournament.player')),
                ('matches', models.ManyToManyField(related_name='tournaments', to='manage_tournament.tournamentmatch')),
            ],
        ),
        migrations.CreateModel(
            name='TournamentPlayer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='player', to='manage_tournament.player')),
                ('tournament_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tournament', to='manage_tournament.tournament')),
            ],
            options={
                'unique_together': {('tournament_id', 'player')},
            },
        ),
    ]
